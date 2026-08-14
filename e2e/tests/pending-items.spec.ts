import { test, expect } from '../fixtures/auth.fixture';
import { PendingItemsPage } from '../pages/pending-items.page';

test.describe('Pending Items', () => {
  test('should display pending items list', async ({ adminPage }) => {
    const page = new PendingItemsPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('pendiente');
  });

  test('should open create pending item dialog', async ({ adminPage }) => {
    const page = new PendingItemsPage(adminPage);
    await page.goto();
    await page.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search pending items', async ({ adminPage }) => {
    const page = new PendingItemsPage(adminPage);
    await page.goto();
    await page.search('seguimiento');
    const input = adminPage
      .locator('input[placeholder*="Buscar"], input[placeholder*="Search"]')
      .first();
    await expect(input).toHaveValue('seguimiento');
  });
});
