import { test } from "@playwright/test";
import { assertProgressApi, loginAndOpenProgress, postProgressUpdate, prepareProgressUserAndProject, reloadProgressAndAssert } from "./progresso.robot";
import { unique } from "../../helpers/test-data.helper";

test.describe("progresso real", () => {
  test("publica progresso e valida no backend real", async ({ page, request }) => {
    const ctx = await prepareProgressUserAndProject(request);
    await loginAndOpenProgress(page, ctx.user);
    const note = `Atualização ${unique("progress")}`;
    await postProgressUpdate(page, note);
    await assertProgressApi(request, ctx.token, ctx.projectId, note);
    await reloadProgressAndAssert(page, note);
  });
});
