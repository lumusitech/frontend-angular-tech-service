import { test, expect } from '../fixtures/auth.fixture';
import { SuppliersPage } from '../pages/suppliers.page';

test.describe('Suppliers', () => {
  test('should display suppliers list', async ({ adminPage }) => {
    const page = new SuppliersPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('proveedor');
  });

  test('should open create supplier dialog', async ({ adminPage }) => {
    const page = new SuppliersPage(adminPage);
    await page.goto();
    await page.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search suppliers', async ({ adminPage }) => {
    const page = new SuppliersPage(adminPage);
    await page.goto();
    await page.search('test');
    const input = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(input).toHaveValue('test');
  });
});
