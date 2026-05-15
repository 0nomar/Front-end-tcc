import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { buildLoginCandidate } from "../../factories/auth.factory";
import { LoginPage } from "../../pages/LoginPage";
import { unique } from "../../helpers/test-data.helper";

const API_URL = process.env.VITE_API_URL ?? "http://127.0.0.1:8080";

export async function prepareChatUsers(request: APIRequestContext) {
  const a = buildLoginCandidate();
  const b = buildLoginCandidate();
  await request.post(`${API_URL}/api/auth/register`, { data: { nome: a.nome, email: a.email, senha: a.senha, ra: a.ra } });
  await request.post(`${API_URL}/api/auth/register`, { data: { nome: b.nome, email: b.email, senha: b.senha, ra: b.ra } });
  return { a, b };
}

export async function loginAndOpenChat(page: Page, user: { email: string; senha: string }) {
  const loginPage = new LoginPage(page);
  await loginPage.login(user.email, user.senha);
  await page.goto("/app/chat");
  await expect(page.locator("h1").filter({ hasText: "Mensagens" })).toBeVisible();
}

export async function sendChatMessage(page: Page) {
  const message = `msg-${unique("chat")}`;
  const input = page.getByPlaceholder("Digite uma mensagem");
  if (!(await input.isVisible())) return null;
  await input.fill(message);
  await page.locator(".pagina-chat__botao-enviar").click();
  await expect(page.getByText(message)).toBeVisible();
  return message;
}

export async function assertChatApiReachable(request: APIRequestContext, token: string, userId: number) {
  const res = await request.get(`${API_URL}/api/conversas/${userId}/todas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.ok()).toBeTruthy();
}
