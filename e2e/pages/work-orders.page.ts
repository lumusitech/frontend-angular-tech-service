import { Page, expect } from '@playwright/test';

export class WorkOrdersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/work-orders');
  }

  async getOrderCount() {
    return this.page.locator('mat-row').count();
  }

  async clickCreate() {
    await this.page.locator('button:has-text("Nueva Orden"), button:has-text("New Order")').first().click();
  }

  async getStatusBadges() {
    return this.page.locator('app-status-badge').allTextContents();
  }

  async filterByStatus(status: string) {
    await this.page.locator('mat-select').first().click();
    await this.page.locator(`mat-option:has-text("${status}")`).click();
  }
}
