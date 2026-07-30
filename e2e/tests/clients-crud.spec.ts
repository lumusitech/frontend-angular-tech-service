import { test, expect } from '../fixtures/auth.fixture';
import { ClientsPage } from '../pages/clients.page';

test.describe('Clients CRUD', () => {
  test('should display clients list', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('cliente');
  });

  test('should open create dialog', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await clientsPage.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search clients', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await clientsPage.search('test');
    const searchInput = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(searchInput).toHaveValue('test');
  });

  test('should clear filters', async ({ adminPage }) => {
    const clientsPage = new ClientsPage(adminPage);
    await clientsPage.goto();
    await clientsPage.search('test');
    await adminPage.locator('button:has-text("Limpiar"), button:has-text("Clear")').first().click();
    const searchInput = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(searchInput).toHaveValue('');
  });

  test('should view client detail', async ({ adminPage }) => {
    await adminPage.goto('/admin/clients');
    await adminPage.waitForSelector('mat-row', { timeout: 10000 });
    const firstRow = adminPage.locator('mat-row').first();
    await firstRow.click();
    await adminPage.waitForURL(/\/admin\/clients\/[a-f0-9-]+/, { timeout: 5000 });
    expect(adminPage.url()).toMatch(/\/admin\/clients\/[a-f0-9-]+/);
  });
});
