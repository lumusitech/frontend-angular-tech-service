// @ts-nocheck
import { test, expect } from '@playwright/test';
import { PortalPage } from '../pages/portal.page';

test.describe('Portal Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await new PortalPage(page).goto();
  });

  test('should display tracking form', async ({ page }) => {
    await expect(page.locator('input[type="text"], input[placeholder*="ódigo"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Buscar")')).toBeVisible();
  });

  test('should show error for invalid tracking code', async ({ page }) => {
    const portalPage = new PortalPage(page);
    await portalPage.searchTrackingCode('INVALID-CODE');
    await page.waitForTimeout(2000);
    const errorVisible = await page.locator('[class*="red"], [class*="error"], mat-icon:has-text("error")').isVisible();
    expect(errorVisible).toBeTruthy();
  });

  test('should display page title', async ({ page }) => {
    const title = await page.locator('h1, h2').first().textContent();
    expect(title).toBeTruthy();
  });
});
