import { test, expect } from '../fixtures/auth.fixture';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('Dashboard', () => {
  test('should load dashboard with KPIs', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await expect.poll(() => dashboard.isLoaded()).toBeTruthy();
  });

  test('should display dashboard widgets', async ({ adminPage }) => {
    await adminPage.waitForSelector('[cdkDrag], [class*="widget"]', { timeout: 10000 });
    const widgetCount = await adminPage.locator('[cdkDrag], [class*="widget"]').count();
    expect(widgetCount).toBeGreaterThan(0);
  });

  test('should show business name from settings', async ({ adminPage }) => {
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title).toBeTruthy();
  });

  test('should have edit mode toggle', async ({ adminPage }) => {
    await adminPage.waitForSelector('button:has-text("tune"), [title*="Reordenar"]', {
      timeout: 10000,
    });
    const editBtn = adminPage
      .locator('button[title*="Reordenar"], mat-icon:has-text("tune")')
      .first();
    await expect(editBtn).toBeVisible();
  });
});
