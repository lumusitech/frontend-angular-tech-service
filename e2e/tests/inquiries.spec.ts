import { test, expect } from '../fixtures/auth.fixture';
import { InquiriesPage } from '../pages/inquiries.page';

test.describe('Inquiries', () => {
  test('should display inquiries list', async ({ adminPage }) => {
    const page = new InquiriesPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('consulta');
  });

  test('should open create inquiry dialog', async ({ adminPage }) => {
    const page = new InquiriesPage(adminPage);
    await page.goto();
    await page.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search inquiries', async ({ adminPage }) => {
    const page = new InquiriesPage(adminPage);
    await page.goto();
    await page.search('cliente');
    const input = adminPage
      .locator('input[placeholder*="Buscar"], input[placeholder*="Search"]')
      .first();
    await expect(input).toHaveValue('cliente');
  });
});
