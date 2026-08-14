import { test, expect } from '../fixtures/auth.fixture';

test.describe('Reports', () => {
  test('should display reports dashboard', async ({ adminPage }) => {
    await adminPage.goto('/admin/reports');
    await adminPage.waitForTimeout(2000);
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('reporte');
  });

  test('should have period selector', async ({ adminPage }) => {
    await adminPage.goto('/admin/reports');
    await adminPage.waitForTimeout(1000);
    const periodSelect = adminPage.locator('mat-select').first();
    if (await periodSelect.isVisible()) {
      await periodSelect.click();
      await adminPage.waitForTimeout(300);
      const options = await adminPage.locator('mat-option').count();
      expect(options).toBeGreaterThan(0);
    }
  });

  test('should display KPI cards', async ({ adminPage }) => {
    await adminPage.goto('/admin/reports');
    await adminPage.waitForTimeout(2000);
    const kpiCards = await adminPage.locator('[class*="border-l-4"]').count();
    expect(kpiCards).toBeGreaterThan(0);
  });

  test('should have chart sections', async ({ adminPage }) => {
    await adminPage.goto('/admin/reports');
    await adminPage.waitForTimeout(2000);
    const charts = await adminPage.locator('canvas, [class*="chart"]').count();
    expect(charts).toBeGreaterThan(0);
  });
});
