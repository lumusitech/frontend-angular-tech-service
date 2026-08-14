import { test as base, Page } from '@playwright/test';
import { seed } from './seed.fixture';

export const TEST_CREDENTIALS = {
  admin: { email: 'admin@test.com', password: 'admin123' },
  technician: { email: 'tech@test.com', password: 'tech123' },
  seller: { email: 'seller@test.com', password: 'seller123' },
};

async function loginAs(page: Page, role: 'admin' | 'technician' | 'seller') {
  const creds = TEST_CREDENTIALS[role];
  await page.goto('/login');
  await page.fill('input[type="email"]', creds.email);
  await page.fill('input[type="password"]', creds.password);
  await page.click('button[type="submit"]');

  if (role === 'admin') {
    await page.waitForURL('/admin/dashboard');
  } else if (role === 'technician') {
    await page.waitForURL('/tech');
  } else {
    await page.waitForURL('/seller');
  }
}

export const test = base.extend<{
  adminPage: Page;
  techPage: Page;
  sellerPage: Page;
  seed: void;
}>({
  seed: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await seed();
      await use();
    },
    { auto: true, scope: 'worker' },
  ],
  adminPage: async ({ page }, use) => {
    await loginAs(page, 'admin');
    await use(page);
  },
  techPage: async ({ page }, use) => {
    await loginAs(page, 'technician');
    await use(page);
  },
  sellerPage: async ({ page }, use) => {
    await loginAs(page, 'seller');
    await use(page);
  },
});

export { expect } from '@playwright/test';
