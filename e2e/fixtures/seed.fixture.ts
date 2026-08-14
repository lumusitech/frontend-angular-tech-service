import { request as apiRequest } from '@playwright/test';
import { TEST_CREDENTIALS } from './auth.fixture';

const BASE = process.env.BASE_URL || 'http://localhost:4200';

async function getAdminToken(): Promise<string | null> {
  const ctx = await apiRequest.newContext();
  const res = await ctx.post(`${BASE}/api/auth/login`, {
    data: { email: TEST_CREDENTIALS.admin.email, password: TEST_CREDENTIALS.admin.password },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok()) return null;
  const body = await res.json();
  return body?.data?.token || body?.token || null;
}

async function ensureExists(token: string, url: string, data: Record<string, unknown>) {
  const ctx = await apiRequest.newContext({
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
  });
  await ctx.post(`${BASE}${url}`, { data }).catch(() => undefined);
}

async function ensureTestUsers(token: string) {
  const users = [
    {
      email: TEST_CREDENTIALS.technician.email,
      password: TEST_CREDENTIALS.technician.password,
      name: 'Técnico de Prueba',
      role: 'technician',
    },
    {
      email: TEST_CREDENTIALS.seller.email,
      password: TEST_CREDENTIALS.seller.password,
      name: 'Vendedor de Prueba',
      role: 'seller',
    },
  ];
  for (const user of users) {
    await ensureExists(token, '/api/users', user);
  }
}

async function ensureTestClient(token: string) {
  await ensureExists(token, '/api/clients', {
    name: 'Cliente E2E Test',
    email: 'e2e@test.com',
    phone: '123456789',
    address: 'Calle E2E 123',
  });
}

async function ensureTestSupplier(token: string) {
  await ensureExists(token, '/api/suppliers', {
    name: 'Proveedor E2E Test',
    contact: 'Contacto E2E',
    email: 'supplier-e2e@test.com',
    phone: '987654321',
  });
}

async function ensureTestExpense(token: string) {
  await ensureExists(token, '/api/expenses', {
    description: 'Gasto E2E Test',
    amount: 1000,
    date: new Date().toISOString().split('T')[0],
    category: 'tools',
  });
}

export async function seed(): Promise<void> {
  const token = await getAdminToken();
  if (!token) {
    console.warn(
      'Seed: no se pudo obtener token admin. Asegurate de que el backend tenga admin@test.com/admin123',
    );
    return;
  }

  await ensureTestUsers(token);
  await ensureTestClient(token);
  await ensureTestSupplier(token);
  await ensureTestExpense(token);

  console.log('Seed: datos de prueba creados correctamente');
}
