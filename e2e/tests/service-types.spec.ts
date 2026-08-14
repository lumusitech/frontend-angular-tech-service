import { test, expect } from '../fixtures/auth.fixture';
import { ServiceTypesPage } from '../pages/service-types.page';

test.describe('Service Types', () => {
  test('should display service types list', async ({ adminPage }) => {
    const page = new ServiceTypesPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toMatch(/servicio|tipo/);
  });

  test('should open create service type dialog', async ({ adminPage }) => {
    const page = new ServiceTypesPage(adminPage);
    await page.goto();
    await page.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search service types', async ({ adminPage }) => {
    const page = new ServiceTypesPage(adminPage);
    await page.goto();
    await page.search('reparacion');
    const input = adminPage
      .locator('input[placeholder*="Buscar"], input[placeholder*="Search"]')
      .first();
    await expect(input).toHaveValue('reparacion');
  });
});
