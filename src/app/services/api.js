import { clearStoredToken, getStoredToken } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function request(path, options = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers ?? {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }

    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || payload?.error || "Nao foi possivel concluir a requisicao.";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, options = {}) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  put: (path, body, options = {}) =>
    request(path, {
      method: "PUT",
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
  baseUrl: API_BASE_URL,
};
