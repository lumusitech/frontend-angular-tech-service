import 'fake-indexeddb/auto';
import { TestBed } from '@angular/core/testing';
import { OfflineQueueStore, QueuedRequest } from './offline-queue-store.service';

function makeRequest(overrides: Partial<QueuedRequest> = {}): QueuedRequest {
  return {
    id: `req-${Math.random()}`,
    method: 'POST',
    url: '/api/work-orders',
    body: { status: 'in_progress' },
    idempotencyKey: `key-${Math.random()}`,
    createdAt: Date.now(),
    attempts: 0,
    state: 'pending',
    ...overrides,
  };
}

describe('OfflineQueueStore', () => {
  let store: OfflineQueueStore;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [OfflineQueueStore] });
    store = TestBed.inject(OfflineQueueStore);
    await store.clear();
  });

  afterEach(async () => {
    await store.clear();
  });

  it('enqueues and retrieves pending requests in order', async () => {
    const a = makeRequest({ createdAt: 10 });
    const b = makeRequest({ createdAt: 20 });
    await store.enqueue(a);
    await store.enqueue(b);

    const pending = await store.getPending();
    expect(pending.map((r) => r.id)).toEqual([a.id, b.id]);
  });

  it('excludes blocked requests from pending', async () => {
    const a = makeRequest({ state: 'pending' });
    const b = makeRequest({ state: 'blocked' });
    await store.enqueue(a);
    await store.enqueue(b);

    const pending = await store.getPending();
    expect(pending.map((r) => r.id)).toEqual([a.id]);
  });

  it('updates a request (state/attempts)', async () => {
    const a = makeRequest();
    await store.enqueue(a);

    await store.update({ ...a, state: 'blocked', attempts: 2, lastError: '400' });

    const blocked = await store.getBlocked();
    expect(blocked).toHaveLength(1);
    expect(blocked[0].attempts).toBe(2);
    expect(blocked[0].lastError).toBe('400');
  });

  it('removes a request by id', async () => {
    const a = makeRequest();
    await store.enqueue(a);

    await store.remove(a.id);

    expect(await store.getPending()).toHaveLength(0);
  });

  it('counts pending and blocked', async () => {
    await store.enqueue(makeRequest({ state: 'pending' }));
    await store.enqueue(makeRequest({ state: 'pending' }));
    await store.enqueue(makeRequest({ state: 'blocked' }));

    const counts = await store.counts();
    expect(counts).toEqual({ pending: 2, blocked: 1 });
  });

  it('gets a request by id', async () => {
    const a = makeRequest();
    await store.enqueue(a);

    expect((await store.getById(a.id))?.id).toBe(a.id);
    expect(await store.getById('missing')).toBeUndefined();
  });

  it('clears all requests', async () => {
    await store.enqueue(makeRequest());
    await store.clear();

    expect(await store.counts()).toEqual({ pending: 0, blocked: 0 });
  });
});
