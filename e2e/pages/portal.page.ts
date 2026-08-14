import { Page } from '@playwright/test';

export class PortalPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/track');
  }

  async searchTrackingCode(code: string) {
    await this.page.fill(
      'input[placeholder*="Código"], input[placeholder*="code"], input[type="text"]',
      code,
    );
    await this.page
      .locator('button[type="submit"], button:has-text("Buscar"), button:has-text("Track")')
      .first()
      .click();
  }

  async hasTimeline() {
    return this.page.locator('app-portal-status-timeline, [class*="timeline"]').isVisible();
  }

  async getResultVisible() {
    return this.page.locator('app-portal-result').isVisible();
  }
}
