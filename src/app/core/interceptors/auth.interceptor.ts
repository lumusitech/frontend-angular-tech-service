import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];
const SESSION_EXPIRED_MESSAGE = 'Sesión expirada. Iniciá sesión nuevamente.';

// Single-flight: si dos requests reciben 401 en paralelo, solo se hace un refresh.
let refreshInFlight: Promise<boolean> | null = null;

function refreshAccessToken(authService: AuthService): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = new Promise<boolean>((resolve) => {
      authService.refresh().subscribe({
        next: () => resolve(true),
        error: () => resolve(false),
      });
    }).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  const token = authService.getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  const withToken = (request: typeof req, accessToken: string | null) =>
    accessToken
      ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : request;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      return from(refreshAccessToken(authService)).pipe(
        switchMap((refreshed) => {
          if (!refreshed) {
            toastService.show(SESSION_EXPIRED_MESSAGE, 'error');
            authService.logout();
            return throwError(() => error);
          }

          const retryReq = withToken(req, authService.getToken());
          return next(retryReq).pipe(
            catchError((retryError: HttpErrorResponse) => {
              if (retryError.status === 401) {
                toastService.show(SESSION_EXPIRED_MESSAGE, 'error');
                authService.logout();
              }
              return throwError(() => retryError);
            }),
          );
        }),
      );
    }),
  );
};
