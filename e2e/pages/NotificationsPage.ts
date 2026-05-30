import { expect, type Page } from "@playwright/test";

export class NotificationsPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto("/app/notifications");
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Notificações", exact: true })).toBeVisible();
  }
}
