import { test, expect } from '../fixtures/auth.fixture';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).goto();
  });

  test('should show login form', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await new LoginPage(page).login('wrong@test.com', 'wrong');
    await page.waitForTimeout(1000);
    const error = await page.locator('[class*="red"]').textContent();
    expect(error).toBeTruthy();
  });

  test('should redirect admin to /admin/dashboard', async ({ adminPage }) => {
    expect(adminPage.url()).toContain('/admin/dashboard');
  });

  test('should redirect technician to /tech', async ({ techPage }) => {
    expect(techPage.url()).toContain('/tech');
  });

  test('should redirect seller to /seller', async ({ sellerPage }) => {
    expect(sellerPage.url()).toContain('/seller');
  });

  test('should show loading state during login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('admin@test.com', 'admin123');
    const btn = page.locator('button[type="submit"]');
    await expect(btn).toBeDisabled();
  });
});
