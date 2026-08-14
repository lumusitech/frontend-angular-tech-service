import { Page } from '@playwright/test';

export class PaymentsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/payments');
  }

  async search(text: string) {
    await this.page.fill('input[placeholder*="Buscar"], input[placeholder*="Search"]', text);
  }

  async clickCreate() {
    await this.page
      .locator('button:has-text("Nuevo Pago"), button:has-text("Create")')
      .first()
      .click();
  }

  async getRowCount(): Promise<number> {
    return this.page.locator('mat-row').count();
  }
}
