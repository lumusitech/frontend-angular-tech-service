import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { of, from, tap, catchError, switchMap, throwError } from 'rxjs';
import { ConnectivityService } from '../services/connectivity.service';
import { OfflineService } from '../services/offline.service';
import type { QueuedRequest } from '../services/offline-queue-store.service';
import { generateUuid } from '../utils/uuid.util';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const AUTH_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/auth/change-password',
];

const PROBE_HEADER = 'X-Connectivity-Probe';
const REPLAY_HEADER = 'X-Offline-Replay';
const QUEUED_HEADER = 'X-Offline-Queued';

function isMutation(method: string): boolean {
  return MUTATING_METHODS.has(method);
}

function isQueueable(url: string): boolean {
  return !AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function isCacheable(req: HttpRequest<unknown>): boolean {
  return req.method === 'GET' && req.responseType === 'json';
}

function isNetworkError(error: unknown): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse && error.status === 0;
}

function queuedResponse(): HttpResponse<null> {
  return new HttpResponse({
    status: 202,
    body: null,
    headers: new HttpHeaders({ [QUEUED_HEADER]: 'true' }),
  });
}

function serveFromCache(req: HttpRequest<unknown>, offlineService: OfflineService) {
  return from(offlineService.getCached(req.urlWithParams)).pipe(
    switchMap((cached) => {
      if (cached) {
        return of(new HttpResponse({ status: 200, body: cached.body }));
      }
      return throwError(() => new HttpErrorResponse({ status: 0, statusText: 'Offline' }));
    }),
  );
}

/**
 * Interceptor de offline — debe registrarse PRIMERO en withInterceptors.
 * - Online: inyecta Idempotency-Key en mutaciones y cachea GETs JSON. Si una
 *   request falla por red (status 0), corrige el estado a offline y aplica la
 *   estrategia offline (encolar mutación / servir cache).
 * - Offline: encola mutaciones (respuesta sintética) y sirve GETs desde cache.
 * - Bypass: X-Connectivity-Probe (sonda) y X-Offline-Replay (replay de sync)
 *   atraviesan sin encolar ni cachear.
 */
export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const connectivity = inject(ConnectivityService);
  const offlineService = inject(OfflineService);

  // Bypass: sonda de conectividad y replay del motor de sync.
  if (req.headers.has(PROBE_HEADER) || req.headers.has(REPLAY_HEADER)) {
    return next(req);
  }

  if (connectivity.online()) {
    if (isMutation(req.method)) {
      const key = req.headers.get('Idempotency-Key') ?? generateUuid();
      return next(req.clone({ setHeaders: { 'Idempotency-Key': key } })).pipe(
        catchError((error: HttpErrorResponse) => {
          if (isNetworkError(error) && isQueueable(req.urlWithParams)) {
            connectivity.reportOffline();
            queueMutation(req, key, offlineService);
            return of(queuedResponse());
          }
          return throwError(() => error);
        }),
      );
    }

    if (isCacheable(req)) {
      return next(req).pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            connectivity.reportOnline();
            void offlineService.cacheGet(req.urlWithParams, event.body);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (isNetworkError(error)) {
            connectivity.reportOffline();
            return serveFromCache(req, offlineService);
          }
          return throwError(() => error);
        }),
      );
    }

    return next(req).pipe(
      tap(() => connectivity.reportOnline()),
      catchError((error: HttpErrorResponse) => {
        if (isNetworkError(error)) {
          connectivity.reportOffline();
        }
        return throwError(() => error);
      }),
    );
  }

  // ---- Offline ----
  const skipLoading = req.clone({ setHeaders: { 'X-Skip-Loading': 'true' } });

  if (isMutation(req.method) && isQueueable(req.urlWithParams)) {
    const idempotencyKey = req.headers.get('Idempotency-Key') ?? generateUuid();
    queueMutation(req, idempotencyKey, offlineService);
    return of(queuedResponse());
  }

  if (req.method === 'GET') {
    return next(skipLoading).pipe(catchError(() => serveFromCache(req, offlineService)));
  }

  return next(skipLoading);
};

function queueMutation(
  req: HttpRequest<unknown>,
  idempotencyKey: string,
  offlineService: OfflineService,
): void {
  void offlineService.queueRequest({
    id: generateUuid(),
    method: req.method as QueuedRequest['method'],
    url: req.urlWithParams,
    body: req.body,
    idempotencyKey,
  });
}
