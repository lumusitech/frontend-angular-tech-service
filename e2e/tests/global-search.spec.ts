import { test, expect } from '../fixtures/auth.fixture';
import { GlobalSearchPage } from '../pages/global-search.page';

test.describe('Global Search', () => {
  test('should not show dropdown for empty query', async ({ adminPage }) => {
    const search = new GlobalSearchPage(adminPage);
    await search.searchInput.click();
    await expect(search.dropdown).not.toBeVisible();
  });

  test('should not show dropdown for query < 2 chars', async ({ adminPage }) => {
    const search = new GlobalSearchPage(adminPage);
    await search.typeQuery('j');
    await expect(search.dropdown).not.toBeVisible();
  });

  test('should show dropdown for query >= 2 chars', async ({ adminPage }) => {
    const search = new GlobalSearchPage(adminPage);
    await search.typeQuery('test');
    await search.waitForResults();
    await expect(search.dropdown).toBeVisible();
  });

  test('should not trigger global loading overlay on search', async ({ adminPage }) => {
    const search = new GlobalSearchPage(adminPage);
    await search.typeQuery('cliente');

    await adminPage
      .waitForResponse((r) => r.url().includes('/api/') && r.url().includes('search='), {
        timeout: 3000,
      })
      .catch(() => null);

    const overlay = adminPage.locator(
      'app-loading-spinner .backdrop-blur-sm, app-loading-spinner .fixed.inset-0',
    );
    await expect(overlay).toHaveCount(0);
  });

  test('should clear query and close dropdown when X clicked', async ({ adminPage }) => {
    const search = new GlobalSearchPage(adminPage);
    await search.typeQuery('test');
    await search.waitForResults();
    await search.clearQuery();

    await expect(search.searchInput).toHaveValue('');
    await expect(search.dropdown).not.toBeVisible();
  });
});
