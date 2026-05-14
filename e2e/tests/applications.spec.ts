import { test, expect } from "@playwright/test";
import { authenticateAs, expectToast, mockUsers, setupApiMock } from "../helpers/api-mock.helper";

test.describe("inscricoes do aluno", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMock(page);
    await authenticateAs(page, mockUsers.student);
  });

  test("filtra, expande, navega para projeto e cancela inscricao pendente", async ({ page }) => {
    await page.goto("/app/applications");

    await expect(page.getByRole("heading", { name: "Minhas Inscricoes", exact: true })).toBeVisible();
    await expect(page.getByText("Total de inscricoes")).toBeVisible();
    await expect(page.getByText("Projeto E2E Candidatura").first()).toBeVisible();

    await page.getByRole("button", { name: "Aprovadas" }).first().click();
    await expect(page.getByText("Boa aderencia ao projeto.")).toBeHidden();
    await page.getByText("Projeto E2E Autoria").click();
    await expect(page.getByText("Parecer do orientador:")).toBeVisible();

    await page.getByRole("button", { name: "Todas" }).click();
    await page.getByText("Projeto E2E Candidatura").first().click();
    await expect(page.getByText("Minha motivacao:")).toBeVisible();
    await page.getByRole("button", { name: "Ver projeto" }).click();
    await expect(page).toHaveURL(/\/app\/projects\/2$/);

    await page.goto("/app/applications");
    await page.getByText("Projeto E2E Candidatura").first().click();
    await page.getByRole("button", { name: "Cancelar inscricao" }).click();
    await expect(page.getByRole("heading", { name: "Cancelar inscricao" })).toBeVisible();
    await page.getByRole("button", { name: "Confirmar cancelamento" }).click();
    await expectToast(page, "Inscricao cancelada.");
  });

  test("mostra estado vazio e erro de carregamento", async ({ browser }) => {
    const emptyContext = await browser.newContext();
    const emptyPage = await emptyContext.newPage();
    await setupApiMock(emptyPage, { empty: { applications: true } });
    await authenticateAs(emptyPage, mockUsers.student);
    await emptyPage.goto("/app/applications");
    await expect(emptyPage.getByText("Nenhuma inscricao encontrada")).toBeVisible();
    await emptyPage.getByRole("button", { name: "Explorar projetos" }).click();
    await expect(emptyPage).toHaveURL(/\/app\/projects$/);
    await emptyContext.close();

    const errorContext = await browser.newContext();
    const errorPage = await errorContext.newPage();
    await setupApiMock(errorPage, { fail: ["/api/usuarios/minhas-inscricoes"] });
    await authenticateAs(errorPage, mockUsers.student);
    await errorPage.goto("/app/applications");
    await expect(errorPage.getByText("Falha ao carregar inscricoes")).toBeVisible();
    await errorContext.close();
  });
});
