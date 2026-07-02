// @ts-nocheck
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Payments', () => {
  test('should display payments list', async ({ adminPage }) => {
    await adminPage.goto('/admin/payments');
    await adminPage.waitForTimeout(1000);
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('pago');
  });

  test('should have search input', async ({ adminPage }) => {
    await adminPage.goto('/admin/payments');
    await adminPage.waitForTimeout(500);
    const searchInput = adminPage.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('should filter by status', async ({ adminPage }) => {
    await adminPage.goto('/admin/payments');
    await adminPage.waitForTimeout(500);
    const filterSelect = adminPage.locator('mat-select').first();
    if (await filterSelect.isVisible()) {
      await filterSelect.click();
      await adminPage.waitForTimeout(300);
      const options = await adminPage.locator('mat-option').count();
      expect(options).toBeGreaterThan(0);
    }
  });
});
