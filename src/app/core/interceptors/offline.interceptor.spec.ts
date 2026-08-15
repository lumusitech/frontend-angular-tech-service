import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { offlineInterceptor } from './offline.interceptor';
import { ConnectivityService } from '../services/connectivity.service';
import { OfflineService } from '../services/offline.service';

describe('offlineInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let online: ReturnType<typeof signal<boolean>>;
  let queueRequestSpy: ReturnType<typeof vi.fn>;
  let cacheGetSpy: ReturnType<typeof vi.fn>;
  let getCachedSpy: ReturnType<typeof vi.fn>;

  function flushMicrotasks(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  beforeEach(() => {
    online = signal(true);
    queueRequestSpy = vi.fn();
    cacheGetSpy = vi.fn();
    getCachedSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([offlineInterceptor])),
        provideHttpClientTesting(),
        { provide: ConnectivityService, useValue: { online } },
        {
          provide: OfflineService,
          useValue: {
            queueRequest: queueRequestSpy,
            cacheGet: cacheGetSpy,
            getCached: getCachedSpy,
          },
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('online', () => {
    it('adds an Idempotency-Key to mutations', () => {
      httpClient.post('/api/work-orders', { clientId: 'c' }).subscribe();

      const req = httpMock.expectOne('/api/work-orders');
      expect(req.request.headers.has('Idempotency-Key')).toBe(true);
      req.flush({});
    });

    it('keeps an existing Idempotency-Key when present', () => {
      httpClient
        .post('/api/work-orders', { clientId: 'c' }, { headers: { 'Idempotency-Key': 'my-key' } })
        .subscribe();

      const req = httpMock.expectOne('/api/work-orders');
      expect(req.request.headers.get('Idempotency-Key')).toBe('my-key');
      req.flush({});
    });

    it('caches successful JSON GET responses', () => {
      httpClient.get('/api/work-orders?page=1').subscribe();

      const req = httpMock.expectOne('/api/work-orders?page=1');
      req.flush({ data: [{ id: 'wo-1' }] });

      expect(cacheGetSpy).toHaveBeenCalledWith('/api/work-orders?page=1', {
        data: [{ id: 'wo-1' }],
      });
    });

    it('does not queue mutations while online', () => {
      httpClient.post('/api/work-orders', {}).subscribe();
      httpMock.expectOne('/api/work-orders').flush({});

      expect(queueRequestSpy).not.toHaveBeenCalled();
    });
  });

  describe('offline', () => {
    beforeEach(() => {
      online.set(false);
    });

    it('queues mutations and returns a synthetic response', () => {
      let result: unknown;
      httpClient.post('/api/work-orders', { clientId: 'c' }).subscribe((r) => (result = r));

      expect(result).toBeNull();
      expect(queueRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/work-orders',
          body: { clientId: 'c' },
          idempotencyKey: expect.any(String),
        }),
      );
    });

    it('does not queue auth endpoints while offline', () => {
      httpClient.post('/api/auth/login', {}).subscribe({ error: () => undefined });

      const req = httpMock.expectOne('/api/auth/login');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Offline' });

      expect(queueRequestSpy).not.toHaveBeenCalled();
    });

    it('serves cached GET responses when offline', async () => {
      getCachedSpy.mockResolvedValue({
        key: '/api/work-orders?page=1',
        url: '/api/work-orders?page=1',
        body: { data: [{ id: 'wo-1' }] },
        fetchedAt: Date.now(),
      });

      let result: unknown;
      httpClient.get('/api/work-orders?page=1').subscribe((r) => (result = r));

      const req = httpMock.expectOne('/api/work-orders?page=1');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Network Error' });

      await flushMicrotasks();

      expect(result).toEqual({ data: [{ id: 'wo-1' }] });
    });

    it('propagates an offline error when no cache exists', async () => {
      getCachedSpy.mockResolvedValue(undefined);

      let errorStatus = 0;
      httpClient.get('/api/work-orders?page=1').subscribe({
        error: (err) => (errorStatus = err.status),
      });

      const req = httpMock.expectOne('/api/work-orders?page=1');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Network Error' });

      await flushMicrotasks();

      expect(errorStatus).toBe(0);
    });
  });
});
