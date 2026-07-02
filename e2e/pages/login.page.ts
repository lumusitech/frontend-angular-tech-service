import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getError() {
    return this.page.locator('[class*="red"]').textContent();
  }

  async isLoading() {
    return this.page.locator('button[type="submit"]').isDisabled();
  }
}
