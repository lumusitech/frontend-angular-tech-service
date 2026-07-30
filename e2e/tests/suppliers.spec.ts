import { test, expect } from '../fixtures/auth.fixture';

test.describe('Suppliers', () => {
  test('should display suppliers list', async ({ adminPage }) => {
    await adminPage.goto('/admin/suppliers');
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('proveedor');
  });

  test('should open create dialog', async ({ adminPage }) => {
    await adminPage.goto('/admin/suppliers');
    await adminPage.waitForSelector('h1');
    await adminPage.locator('button:has-text("Nuevo Proveedor"), button:has-text("Create")').first().click();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search suppliers', async ({ adminPage }) => {
    await adminPage.goto('/admin/suppliers');
    await adminPage.waitForSelector('h1');
    await adminPage.fill('input[placeholder*="Buscar"], input[placeholder*="Search"]', 'E2E');
    const input = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(input).toHaveValue('E2E');
  });

  test('should navigate via global search', async ({ adminPage }) => {
    await adminPage.goto('/admin/dashboard');
    await adminPage.waitForSelector('app-global-search');
    await adminPage.fill('app-global-search input', 'Proveedor E2E');
    await adminPage.waitForSelector('app-global-search .shadow-lg', { timeout: 5000 });
    await adminPage.locator('app-global-search .shadow-lg button').first().click();
    await adminPage.waitForURL(/\/admin\/suppliers/, { timeout: 5000 });
    expect(adminPage.url()).toContain('highlight=');
  });
});
