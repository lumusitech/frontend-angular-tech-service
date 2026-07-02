import { test, expect } from '../fixtures/auth.fixture';
import { WorkOrdersPage } from '../pages/work-orders.page';

test.describe('Work Orders Lifecycle', () => {
  test('should display work orders list', async ({ adminPage }) => {
    const workOrdersPage = new WorkOrdersPage(adminPage);
    await workOrdersPage.goto();
    await adminPage.waitForTimeout(1000);
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('orden');
  });

  test('should show status badges', async ({ adminPage }) => {
    const workOrdersPage = new WorkOrdersPage(adminPage);
    await workOrdersPage.goto();
    await adminPage.waitForTimeout(1000);
    const badges = await workOrdersPage.getStatusBadges();
    expect(badges.length).toBeGreaterThan(0);
  });

  test('should open create dialog', async ({ adminPage }) => {
    const workOrdersPage = new WorkOrdersPage(adminPage);
    await workOrdersPage.goto();
    await adminPage.waitForTimeout(500);
    await workOrdersPage.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should view order detail', async ({ adminPage }) => {
    await adminPage.goto('/admin/work-orders');
    await adminPage.waitForTimeout(1000);
    const firstRow = adminPage.locator('mat-row').first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await adminPage.waitForTimeout(500);
      expect(adminPage.url()).toContain('/admin/work-orders/');
    }
  });
});
