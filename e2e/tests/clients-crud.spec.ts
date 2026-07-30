import { test, expect } from '../fixtures/auth.fixture';

test.describe('Clients CRUD', () => {
  test('should display clients list', async ({ adminPage }) => {
    await adminPage.goto('/admin/clients');
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('cliente');
  });

  test('should open create dialog', async ({ adminPage }) => {
    await adminPage.goto('/admin/clients');
    await adminPage.waitForSelector('h1');
    await adminPage.locator('button:has-text("Nuevo Cliente"), button:has-text("Create")').first().click();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search clients', async ({ adminPage }) => {
    await adminPage.goto('/admin/clients');
    await adminPage.waitForSelector('h1');
    await adminPage.fill('input[placeholder*="Buscar"], input[placeholder*="Search"]', 'E2E');
    const input = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(input).toHaveValue('E2E');
  });

  test('should view client detail', async ({ adminPage }) => {
    await adminPage.goto('/admin/clients');
    await adminPage.waitForSelector('mat-row', { timeout: 10000 });
    const firstRow = adminPage.locator('mat-row').first();
    await firstRow.click();
    await adminPage.waitForURL(/\/admin\/clients\/(?!new)[a-f0-9-]+/, { timeout: 5000 });
    expect(adminPage.url()).toMatch(/\/admin\/clients\/[a-f0-9-]+/);
  });
});
