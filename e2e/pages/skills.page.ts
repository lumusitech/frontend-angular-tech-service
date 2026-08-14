import { Page } from '@playwright/test';

export class SkillsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/skills');
  }

  async search(text: string) {
    await this.page.fill('input[placeholder*="Buscar"], input[placeholder*="Search"]', text);
  }

  async clickCreate() {
    await this.page
      .locator('button:has-text("Nueva Habilidad"), button:has-text("Create")')
      .first()
      .click();
  }

  async getRowCount(): Promise<number> {
    return this.page.locator('tr[mat-row]').count();
  }
}
