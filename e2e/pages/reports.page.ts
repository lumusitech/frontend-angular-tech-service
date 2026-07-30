import { Page, expect } from '@playwright/test';

export class ReportsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/reports');
  }

  async getChartsCount(): Promise<number> {
    return this.page.locator('canvas, app-chart').count();
  }

  async hasExportButtons(): Promise<boolean> {
    return (await this.page.locator('button:has-text("Exportar"), button:has-text("PDF")').count()) > 0;
  }

  async clickExportPdf() {
    await this.page.locator('button:has-text("Exportar"), button:has-text("PDF")').first().click();
  }
}
