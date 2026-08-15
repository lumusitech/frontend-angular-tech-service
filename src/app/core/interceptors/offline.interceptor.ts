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

function isMutation(method: string): boolean {
  return MUTATING_METHODS.has(method);
}

function isQueueable(url: string): boolean {
  return !AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function isCacheable(req: HttpRequest<unknown>): boolean {
  return req.method === 'GET' && req.responseType === 'json';
}

/**
 * Interceptor de offline — debe registrarse PRIMERO en withInterceptors.
 * - Online: inyecta Idempotency-Key en mutaciones y cachea GETs JSON.
 * - Offline: encola mutaciones (respuesta sintética) y sirve GETs desde cache.
 */
export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const connectivity = inject(ConnectivityService);
  const offlineService = inject(OfflineService);

  if (connectivity.online()) {
    if (isMutation(req.method)) {
      const key = req.headers.get('Idempotency-Key') ?? generateUuid();
      return next(req.clone({ setHeaders: { 'Idempotency-Key': key } }));
    }

    if (isCacheable(req)) {
      return next(req).pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            void offlineService.cacheGet(req.urlWithParams, event.body);
          }
        }),
      );
    }

    return next(req);
  }

  // ---- Offline ----
  const skipLoading = req.clone({ setHeaders: { 'X-Skip-Loading': 'true' } });

  if (isMutation(req.method) && isQueueable(req.urlWithParams)) {
    const idempotencyKey = req.headers.get('Idempotency-Key') ?? generateUuid();

    void offlineService.queueRequest({
      id: generateUuid(),
      method: req.method as QueuedRequest['method'],
      url: req.urlWithParams,
      body: req.body,
      idempotencyKey,
    });

    return of(
      new HttpResponse({
        status: 202,
        body: null,
        headers: new HttpHeaders({ 'X-Offline-Queued': 'true' }),
      }),
    );
  }

  if (req.method === 'GET') {
    return next(skipLoading).pipe(
      catchError(() =>
        from(offlineService.getCached(req.urlWithParams)).pipe(
          switchMap((cached) => {
            if (cached) {
              return of(new HttpResponse({ status: 200, body: cached.body }));
            }
            return throwError(
              () =>
                new HttpErrorResponse({
                  status: 0,
                  statusText: 'Offline',
                  url: req.urlWithParams,
                }),
            );
          }),
        ),
      ),
    );
  }

  return next(skipLoading);
};
