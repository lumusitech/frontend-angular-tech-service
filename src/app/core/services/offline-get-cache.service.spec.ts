import 'fake-indexeddb/auto';
import { TestBed } from '@angular/core/testing';
import { OfflineGetCache } from './offline-get-cache.service';

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

describe('OfflineGetCache', () => {
  let cache: OfflineGetCache;
  let nowSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [OfflineGetCache] });
    cache = TestBed.inject(OfflineGetCache);
    await cache.clear();
    nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000_000);
  });

  afterEach(async () => {
    nowSpy.mockRestore();
    await cache.clear();
  });

  it('stores and retrieves a GET response', async () => {
    await cache.set('/api/work-orders?page=1', { data: [{ id: '1' }] });

    const cached = await cache.get('/api/work-orders?page=1');
    expect(cached?.body).toEqual({ data: [{ id: '1' }] });
  });

  it('returns undefined for a missing key', async () => {
    expect(await cache.get('/api/unknown')).toBeUndefined();
  });

  it('evicts entries older than the 7-day TTL', async () => {
    await cache.set('/api/orders', { ok: true });
    expect((await cache.get('/api/orders'))?.body).toEqual({ ok: true });

    nowSpy.mockReturnValue(1_000_000 + TTL_MS + 1);

    expect(await cache.get('/api/orders')).toBeUndefined();
  });

  it('keeps entries within the TTL', async () => {
    await cache.set('/api/orders', { ok: true });

    nowSpy.mockReturnValue(1_000_000 + TTL_MS - 1);

    expect((await cache.get('/api/orders'))?.body).toEqual({ ok: true });
  });

  it('overwrites a key on subsequent set', async () => {
    await cache.set('/api/orders', { v: 1 });
    await cache.set('/api/orders', { v: 2 });

    expect((await cache.get('/api/orders'))?.body).toEqual({ v: 2 });
  });
});
