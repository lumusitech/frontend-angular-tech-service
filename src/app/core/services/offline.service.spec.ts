import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { OfflineService } from './offline.service';
import { ConnectivityService } from './connectivity.service';
import { OfflineQueueStore, QueuedRequest } from './offline-queue-store.service';
import { OfflineGetCache } from './offline-get-cache.service';
import { WebsocketService } from './websocket.service';
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';

class FakeQueueStore {
  items: QueuedRequest[] = [];

  async enqueue(request: QueuedRequest): Promise<void> {
    this.items.push(request);
  }

  async getPending(): Promise<QueuedRequest[]> {
    return this.items.filter((i) => i.state === 'pending');
  }

  async getBlocked(): Promise<QueuedRequest[]> {
    return this.items.filter((i) => i.state === 'blocked');
  }

  async getById(id: string): Promise<QueuedRequest | undefined> {
    return this.items.find((i) => i.id === id);
  }

  async update(request: QueuedRequest): Promise<void> {
    const idx = this.items.findIndex((i) => i.id === request.id);
    if (idx >= 0) this.items[idx] = request;
  }

  async remove(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id !== id);
  }

  async clear(): Promise<void> {
    this.items = [];
  }

  async counts(): Promise<{ pending: number; blocked: number }> {
    return {
      pending: this.items.filter((i) => i.state === 'pending').length,
      blocked: this.items.filter((i) => i.state === 'blocked').length,
    };
  }
}

function makeRequest(overrides: Partial<QueuedRequest> = {}): QueuedRequest {
  return {
    id: 'req-1',
    method: 'PATCH',
    url: '/api/work-orders/wo-1',
    body: { status: 'in_progress' },
    idempotencyKey: 'key-1',
    createdAt: Date.now(),
    attempts: 0,
    state: 'pending',
    ...overrides,
  };
}

describe('OfflineService', () => {
  let service: OfflineService;
  let fakeStore: FakeQueueStore;
  let online: ReturnType<typeof signal<boolean>>;
  let httpMock: { request: ReturnType<typeof vi.fn> };
  let workOrderRefreshKey: ReturnType<typeof signal<number>>;
  let toastSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fakeStore = new FakeQueueStore();
    online = signal(true);
    workOrderRefreshKey = signal(0);
    toastSpy = vi.fn();
    httpMock = { request: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        OfflineService,
        { provide: ConnectivityService, useValue: { online } },
        { provide: OfflineQueueStore, useValue: fakeStore },
        { provide: OfflineGetCache, useValue: { set: vi.fn(), get: vi.fn(), clear: vi.fn() } },
        { provide: HttpClient, useValue: httpMock },
        { provide: WebsocketService, useValue: { workOrderRefreshKey } },
        { provide: ToastService, useValue: { show: toastSpy } },
        { provide: TranslationService, useValue: { instant: (key: string) => key } },
      ],
    });

    service = TestBed.inject(OfflineService);
  });

  it('increments pendingCount when queueing a request', async () => {
    await service.queueRequest(makeRequest());

    expect(service.pendingCount()).toBe(1);
    expect(await fakeStore.getPending()).toHaveLength(1);
  });

  it('does not flush while offline', async () => {
    online.set(false);
    await service.queueRequest(makeRequest());

    const result = await service.flush();

    expect(result.synced).toBe(0);
    expect(httpMock.request).not.toHaveBeenCalled();
    expect(service.pendingCount()).toBe(1);
  });

  it('does not flush while already syncing', async () => {
    httpMock.request.mockReturnValue(new Promise(() => undefined));
    await fakeStore.enqueue(makeRequest());

    const first = service.flush();
    const second = await service.flush();

    expect(second.synced).toBe(0);
    await first;
  });

  it('removes synced requests, bumps refresh key and shows success toast', async () => {
    httpMock.request.mockReturnValue(of({ statusCode: 200, data: null }));
    await fakeStore.enqueue(makeRequest());

    const result = await service.flush();

    expect(result).toEqual({ synced: 1, failed: 0, blocked: 0 });
    expect(await fakeStore.getPending()).toHaveLength(0);
    expect(workOrderRefreshKey()).toBe(1);
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('syncSuccess'), 'success');
    expect(service.pendingCount()).toBe(0);
  });

  it('reuses the stored idempotency key when replaying', async () => {
    httpMock.request.mockReturnValue(of({ statusCode: 200, data: null }));
    await fakeStore.enqueue(makeRequest({ idempotencyKey: 'stored-key' }));

    await service.flush();

    expect(httpMock.request).toHaveBeenCalledWith(
      'PATCH',
      '/api/work-orders/wo-1',
      expect.objectContaining({
        headers: expect.anything(),
        body: { status: 'in_progress' },
      }),
    );
    const headersArg = httpMock.request.mock.calls[0][2] as {
      headers: { get: (k: string) => string };
    };
    expect(headersArg.headers.get('Idempotency-Key')).toBe('stored-key');
  });

  it('marks 4xx responses as blocked and keeps them visible', async () => {
    httpMock.request.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 400 })));
    await fakeStore.enqueue(makeRequest());

    const result = await service.flush();

    expect(result.blocked).toBe(1);
    expect(await fakeStore.getBlocked()).toHaveLength(1);
    expect(service.blockedCount()).toBe(1);
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('syncBlocked'), 'warning');
  });

  it('marks 401 responses as blocked (session not recoverable)', async () => {
    httpMock.request.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    await fakeStore.enqueue(makeRequest());

    const result = await service.flush();

    expect(result.blocked).toBe(1);
    expect(await fakeStore.getBlocked()).toHaveLength(1);
  });

  it('keeps pending items and stops the flush on network errors', async () => {
    httpMock.request.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    await fakeStore.enqueue(makeRequest());
    await fakeStore.enqueue(makeRequest({ id: 'req-2' }));

    const result = await service.flush();

    expect(result.failed).toBe(1);
    expect(result.synced).toBe(0);
    expect(await fakeStore.getPending()).toHaveLength(2);
    expect(service.pendingCount()).toBe(2);
  });

  it('retryBlocked moves a blocked item back to pending and flushes', async () => {
    httpMock.request.mockReturnValue(of({ statusCode: 200, data: null }));
    await fakeStore.enqueue(makeRequest({ state: 'blocked', lastError: '400' }));

    await service.retryBlocked('req-1');
    await new Promise((r) => setTimeout(r, 0));

    expect(await fakeStore.getPending()).toHaveLength(0);
    expect(await fakeStore.getBlocked()).toHaveLength(0);
    expect(service.pendingCount()).toBe(0);
  });

  it('retryAllBlocked moves all blocked items to pending', async () => {
    await fakeStore.enqueue(makeRequest({ id: 'a', state: 'blocked' }));
    await fakeStore.enqueue(makeRequest({ id: 'b', state: 'blocked' }));

    await service.retryAllBlocked();

    expect(await fakeStore.getPending()).toHaveLength(2);
    expect(service.pendingCount()).toBe(2);
  });
});
