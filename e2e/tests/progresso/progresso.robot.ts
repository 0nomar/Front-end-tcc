import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { buildLoginCandidate } from "../../factories/auth.factory";
import { buildProjectCandidate } from "../../factories/project.factory";
import { LoginPage } from "../../pages/LoginPage";

const API_URL = process.env.VITE_API_URL ?? "http://127.0.0.1:8080";

export async function prepareProgressUserAndProject(request: APIRequestContext) {
  const user = buildLoginCandidate();
  const register = await request.post(`${API_URL}/api/auth/register`, {
    data: { nome: user.nome, email: user.email, senha: user.senha, ra: user.ra },
  });
  expect([200, 409]).toContain(register.status());
  const login = await request.post(`${API_URL}/api/auth/login`, { data: { email: user.email, senha: user.senha } });
  expect(login.ok()).toBeTruthy();
  const auth = await login.json();
  const token = auth.token;

  const areasRes = await request.get(`${API_URL}/api/areas`, { headers: { Authorization: `Bearer ${token}` } });
  const cursosRes = await request.get(`${API_URL}/api/cursos`, { headers: { Authorization: `Bearer ${token}` } });
  const areas = await areasRes.json();
  const cursos = await cursosRes.json();
  const draft = buildProjectCandidate();
  const createdRes = await request.post(`${API_URL}/api/projetos`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      titulo: draft.title,
      descricao: draft.description,
      requisitos: draft.requirements,
      areaId: areas[0]?.id,
      curso: cursos[0]?.nome,
      vagas: draft.slots,
    },
  });
  expect(createdRes.ok()).toBeTruthy();
  const project = await createdRes.json();
  return { user, token, projectId: Number(project.id) };
}

export async function loginAndOpenProgress(page: Page, user: { email: string; senha: string }) {
  const loginPage = new LoginPage(page);
  await loginPage.login(user.email, user.senha);
  await page.goto("/app/progress");
  await expect(page.getByText(/progresso|atualizações/i).first()).toBeVisible();
}

export async function postProgressUpdate(page: Page, text: string) {
  await page.getByRole("button", { name: /nova atualização/i }).click();
  await page.getByPlaceholder("Descreva a atualização...").fill(text);
  await page.getByRole("button", { name: "Publicar" }).click();
  await expect(page.getByText(text).first()).toBeVisible();
}

export async function assertProgressApi(request: APIRequestContext, token: string, projectId: number, text: string) {
  const res = await request.get(`${API_URL}/api/projetos/${projectId}/progresso`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.ok()).toBeTruthy();
  const entries = await res.json();
  const found = (Array.isArray(entries) ? entries : []).some((item) =>
    String(item?.descricao ?? item?.titulo ?? "").includes(text),
  );
  expect(found).toBeTruthy();
}

export async function reloadProgressAndAssert(page: Page, text: string) {
  await page.reload();
  await expect(page.getByText(text).first()).toBeVisible();
}
