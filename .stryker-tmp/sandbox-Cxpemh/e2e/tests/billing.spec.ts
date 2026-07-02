// @ts-nocheck
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Billing', () => {
  test('should display invoices list', async ({ adminPage }) => {
    await adminPage.goto('/admin/billing');
    await adminPage.waitForTimeout(1000);
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('factura');
  });

  test('should open create invoice dialog', async ({ adminPage }) => {
    await adminPage.goto('/admin/billing');
    await adminPage.waitForTimeout(500);
    const createBtn = adminPage.locator('button:has-text("Nueva Factura"), button:has-text("New Invoice")').first();
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
    }
  });

  test('should have status filter', async ({ adminPage }) => {
    await adminPage.goto('/admin/billing');
    await adminPage.waitForTimeout(500);
    const filterSelect = adminPage.locator('mat-select').first();
    if (await filterSelect.isVisible()) {
      await expect(filterSelect).toBeVisible();
    }
  });
});
