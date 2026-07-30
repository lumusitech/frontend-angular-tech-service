import { Page } from '@playwright/test';

export class NotificationsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/notifications');
  }

  async getRowCount(): Promise<number> {
    return this.page.locator('[class*="notification"], mat-card, mat-row').count();
  }

  async clickFirstNotification() {
    await this.page.locator('mat-card, [class*="notification-item"]').first().click();
  }

  async markAllAsRead() {
    await this.page.locator('button:has-text("Marcar todas"), button:has-text("Mark all")').first().click();
  }
}
