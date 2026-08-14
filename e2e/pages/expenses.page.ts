import { Page } from '@playwright/test';

export class ExpensesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/expenses');
  }

  async search(text: string) {
    await this.page.fill('input[placeholder*="Buscar"], input[placeholder*="Search"]', text);
  }

  async clickCreate() {
    await this.page
      .locator('button:has-text("Nuevo Gasto"), button:has-text("Create")')
      .first()
      .click();
  }

  async getRowCount(): Promise<number> {
    return this.page.locator('tr[mat-row]').count();
  }
}
