import { test, expect } from '../fixtures/auth.fixture';
import { ExpensesPage } from '../pages/expenses.page';

test.describe('Expenses', () => {
  test('should display expenses list', async ({ adminPage }) => {
    const page = new ExpensesPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('gasto');
  });

  test('should open create expense dialog', async ({ adminPage }) => {
    const page = new ExpensesPage(adminPage);
    await page.goto();
    await page.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search expenses', async ({ adminPage }) => {
    const page = new ExpensesPage(adminPage);
    await page.goto();
    await page.search('materiales');
    const input = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(input).toHaveValue('materiales');
  });
});
