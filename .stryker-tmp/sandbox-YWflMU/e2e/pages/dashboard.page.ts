// @ts-nocheck
import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async isLoaded() {
    await this.page.waitForSelector('h1');
    return this.page.locator('h1').textContent();
  }

  async hasKPICards() {
    return this.page.locator('app-kpi-cards').isVisible();
  }

  async hasCharts() {
    return this.page.locator('app-charts-widget').isVisible();
  }

  async getWidgetCount() {
    return this.page.locator('[cdkDrag]').count();
  }
}
