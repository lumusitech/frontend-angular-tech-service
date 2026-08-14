import { Page } from '@playwright/test';

export class PortalPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/track');
  }

  async searchTrackingCode(code: string) {
    await this.page.fill('input[placeholder*="TS-"]', code);
    await this.page.press('input[placeholder*="TS-"]', 'Enter');
  }

  async hasTimeline() {
    return this.page.locator('app-portal-status-timeline, [class*="timeline"]').isVisible();
  }

  async getResultVisible() {
    return this.page.locator('app-portal-result').isVisible();
  }
}
