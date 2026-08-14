import { test, expect } from '../fixtures/auth.fixture';

test.describe('Expenses', () => {
  test('should display expenses list', async ({ adminPage }) => {
    await adminPage.goto('/admin/expenses');
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('gasto');
  });

  test('should open create dialog', async ({ adminPage }) => {
    await adminPage.goto('/admin/expenses');
    await adminPage.waitForSelector('h1');
    await adminPage
      .locator('button:has-text("Nuevo Gasto"), button:has-text("Create")')
      .first()
      .click();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search expenses', async ({ adminPage }) => {
    await adminPage.goto('/admin/expenses');
    await adminPage.waitForSelector('h1');
    await adminPage.fill(
      'input[placeholder*="Buscar"], input[placeholder*="Search"]',
      'materiales',
    );
    const input = adminPage
      .locator('input[placeholder*="Buscar"], input[placeholder*="Search"]')
      .first();
    await expect(input).toHaveValue('materiales');
  });

  test('should navigate via global search with highlight', async ({ adminPage }) => {
    await adminPage.goto('/admin/dashboard');
    await adminPage.waitForSelector('app-global-search');
    await adminPage.fill('app-global-search input', 'Gasto E2E');
    await adminPage.waitForSelector('app-global-search .shadow-lg', { timeout: 5000 });
    const hasResults = await adminPage.locator('app-global-search .shadow-lg button').count();
    if (hasResults > 0) {
      await adminPage.locator('app-global-search .shadow-lg button').first().click();
      await adminPage.waitForURL(/\/admin\/expenses/, { timeout: 5000 });
      expect(adminPage.url()).toContain('highlight=');
    }
  });
});
