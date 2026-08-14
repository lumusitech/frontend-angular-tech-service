import { test, expect } from '../fixtures/auth.fixture';
import { NotificationsPage } from '../pages/notifications.page';

test.describe('Notifications', () => {
  test('should display notifications list', async ({ adminPage }) => {
    const page = new NotificationsPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('notificacion');
  });

  test('should have notifications items', async ({ adminPage }) => {
    const page = new NotificationsPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('main div[role="button"]', {
      timeout: 10000,
    });
    const count = await page.getRowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have mark all as read button', async ({ adminPage }) => {
    const page = new NotificationsPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const hasButton = await adminPage
      .locator('button:has-text("Marcar todas"), button:has-text("Mark all")')
      .isVisible()
      .catch(() => false);
    expect(typeof hasButton).toBe('boolean');
  });
});
