import { Service, inject, signal, computed, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/auth.interfaces';
import { LoginPreferencesResponse } from '../models/user-preferences.interfaces';
import { WebsocketService } from './websocket.service';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';
const PREFS_KEY = 'auth_preferences';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly refreshTokenSignal = signal<string | null>(this.getStoredRefreshToken());
  private readonly userSignal = signal<User | null>(this.getStoredUser());
  private readonly preferencesSignal = signal<LoginPreferencesResponse | null>(
    this.getStoredPreferences(),
  );

  readonly token = this.tokenSignal.asReadonly();
  readonly refreshToken = this.refreshTokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly preferences = this.preferencesSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');
  readonly isTechnician = computed(() => this.userSignal()?.role === 'technician');
  readonly isSeller = computed(() => this.userSignal()?.role === 'seller');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap((response: LoginResponse) => this.applySession(response)),
      catchError((error: unknown) => {
        return throwError(() => error);
      }),
    );
  }

  /**
   * Refresca la sesión con rotación. Se usa al recibir 401 (interceptor) o
   * al reanudar el sync offline. Devuelve el error al caller si el refresh
   * token es inválido/vencido/revocado (el caller decide logout o blocked).
   */
  refresh(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'No refresh token available',
          }),
      );
    }

    return this.http.post<LoginResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap((response: LoginResponse) => this.applySession(response)),
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    const token = this.getToken();

    // Revocar refresh tokens en el backend (fire-and-forget, no rompe el logout).
    if (token) {
      this.http
        .post<void>(
          '/api/auth/logout',
          {},
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) },
        )
        .subscribe({ error: () => undefined });
    }

    // Lazy get avoids circular DI at construction (WebsocketService → AuthService)
    this.injector.get(WebsocketService).disconnect();
    this.clearSession();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  getRefreshToken(): string | null {
    return this.refreshTokenSignal();
  }

  updateAvatar(avatar: string): void {
    const current = this.userSignal();
    if (current) {
      const updated = { ...current, avatar };
      this.userSignal.set(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      }
    }
  }

  private applySession(response: LoginResponse): void {
    const { accessToken, refreshToken, user, preferences } = response;
    this.tokenSignal.set(accessToken);
    this.refreshTokenSignal.set(refreshToken || null);
    this.userSignal.set(user);
    this.preferencesSignal.set(preferences || null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (preferences) {
        localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
      }
    }
  }

  private clearSession(): void {
    this.tokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.userSignal.set(null);
    this.preferencesSignal.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PREFS_KEY);
    }
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  private getStoredRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_KEY);
      if (!user || user === 'undefined' || user === 'null') {
        return null;
      }
      try {
        return JSON.parse(user) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  private getStoredPreferences(): LoginPreferencesResponse | null {
    if (typeof window !== 'undefined') {
      const prefs = localStorage.getItem(PREFS_KEY);
      if (!prefs || prefs === 'undefined' || prefs === 'null') {
        return null;
      }
      try {
        return JSON.parse(prefs) as LoginPreferencesResponse;
      } catch {
        return null;
      }
    }
    return null;
  }
}
