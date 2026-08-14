import { test, expect } from '../fixtures/auth.fixture';
import { SkillsPage } from '../pages/skills.page';

test.describe('Skills', () => {
  test('should display skills list', async ({ adminPage }) => {
    const page = new SkillsPage(adminPage);
    await page.goto();
    await adminPage.waitForSelector('h1', { timeout: 10000 });
    const title = await adminPage.locator('h1').textContent();
    expect(title?.toLowerCase()).toContain('skill');
  });

  test('should open create skill dialog', async ({ adminPage }) => {
    const page = new SkillsPage(adminPage);
    await page.goto();
    await page.clickCreate();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();
  });

  test('should search skills', async ({ adminPage }) => {
    const page = new SkillsPage(adminPage);
    await page.goto();
    await page.search('instalacion');
    const input = adminPage
      .locator('input[placeholder*="Buscar"], input[placeholder*="Search"]')
      .first();
    await expect(input).toHaveValue('instalacion');
  });
});
