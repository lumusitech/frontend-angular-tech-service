import { test, expect } from '../fixtures/auth.fixture';
import { request as apiRequest } from '@playwright/test';
import { TEST_CREDENTIALS } from '../fixtures/auth.fixture';

const BASE = process.env.BASE_URL || 'http://localhost:4200';

test.describe('Offline mode', () => {
  test('queues a client creation offline and syncs it once back online', async ({ adminPage }) => {
    const uniqueName = `Offline E2E ${Date.now()}`;
    const uniqueEmail = `offline-${Date.now()}@test.com`;

    // 1. Navegar online para que la lista quede cacheada (fallback offline).
    await adminPage.goto('/admin/clients');
    await adminPage.waitForSelector('h1');

    // 2. Cortar la red del contexto del browser.
    const context = adminPage.context();
    await context.setOffline(true);

    // 3. Crear un cliente estando offline → la mutación se encola.
    await adminPage
      .locator('button:has-text("Nuevo Cliente"), button:has-text("Create")')
      .first()
      .click();
    await expect(adminPage.locator('mat-dialog-container')).toBeVisible();

    const dialog = adminPage.locator('mat-dialog-container');
    const inputs = dialog.locator('input');
    await inputs.nth(0).fill(uniqueName);
    await inputs.nth(1).fill(uniqueEmail);
    await inputs.nth(2).fill('123456789');
    await inputs.nth(4).fill('Calle Offline 123');
    await dialog.locator('button:has-text("Guardar")').click();

    // El diálogo se cierra con éxito sintético y el banner offline aparece.
    await expect(adminPage.locator('mat-dialog-container')).toBeHidden({ timeout: 10000 });
    await expect(adminPage.locator('app-offline-banner')).toBeVisible();

    // 4. Reconectar → el sync automático replica la mutación.
    await context.setOffline(false);

    // 5. Verificar vía API que el cliente se creó exactamente una vez (sin duplicados).
    const api = await apiRequest.newContext();
    const loginRes = await api.post(`${BASE}/api/auth/login`, {
      data: {
        email: TEST_CREDENTIALS.admin.email,
        password: TEST_CREDENTIALS.admin.password,
      },
    });
    const loginBody = await loginRes.json();
    const token: string = loginBody?.data?.accessToken;

    const authed = await apiRequest.newContext({
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    });

    await expect
      .poll(
        async () => {
          const res = await authed.get(
            `${BASE}/api/clients?search=${encodeURIComponent(uniqueName)}`,
          );
          const body = await res.json();
          const matches = (body?.data?.data ?? []).filter(
            (client: { name: string }) => client.name === uniqueName,
          );
          return matches.length;
        },
        { timeout: 20000, intervals: [500, 1000] },
      )
      .toBe(1);

    await api.dispose();
    await authed.dispose();
  });
});
