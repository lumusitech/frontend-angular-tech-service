import { test, expect } from '../fixtures/auth.fixture';
import { ClientsPage } from '../pages/clients.page';

test.describe('Clients CRUD', () => {
  test('should display clients list', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await adminPage.waitForTimeout(1000);
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('cliente');
  });

  test('should open create dialog', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await adminPage.waitForTimeout(500);
    await clientsPage.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search clients', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await adminPage.waitForTimeout(500);
    await clientsPage.search('test');
    await adminPage.waitForTimeout(500);
    // Verify search input has value
    const searchInput = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(searchInput).toHaveValue('test');
  });

  test('should clear filters', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await adminPage.waitForTimeout(500);
    await clientsPage.search('test');
    await adminPage.waitForTimeout(300);
    await adminPage.locator('button:has-text("Limpiar"), button:has-text("Clear")').first().click();
    const searchInput = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(searchInput).toHaveValue('');
  });

  test('should view client detail', async ({ adminPage }) => {
    await adminPage.goto('/admin/clients');
    await adminPage.waitForTimeout(1000);
    const firstRow = adminPage.locator('mat-row').first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await adminPage.waitForTimeout(500);
      expect(adminPage.url()).toContain('/admin/clients/');
    }
  });
});
