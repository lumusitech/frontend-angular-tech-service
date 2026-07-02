// @ts-nocheck
import { Page, expect } from '@playwright/test';

export class ClientsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/clients');
  }

  async getClientCount() {
    return this.page.locator('mat-row, tr[data-row]').count();
  }

  async clickCreate() {
    await this.page.locator('button:has-text("Nuevo Cliente"), button:has-text("Create")').first().click();
  }

  async fillForm(data: { name: string; email: string; phone: string; address: string }) {
    await this.page.fill('input[formcontrolname="name"], input[name="name"]', data.name);
    await this.page.fill('input[formcontrolname="email"], input[name="email"]', data.email);
    await this.page.fill('input[formcontrolname="phone"], input[name="phone"]', data.phone);
    await this.page.fill('input[formcontrolname="address"], input[name="address"]', data.address);
  }

  async submitForm() {
    await this.page.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Save")').first().click();
  }

  async search(text: string) {
    await this.page.fill('input[placeholder*="Buscar"], input[placeholder*="Search"]', text);
  }

  async getTableRows() {
    return this.page.locator('mat-row').count();
  }
}
