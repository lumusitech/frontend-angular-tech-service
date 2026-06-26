import { Service, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/auth.interfaces';
import { LoginPreferencesResponse } from '../models/user-preferences.interfaces';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const PREFS_KEY = 'auth_preferences';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly userSignal = signal<User | null>(this.getStoredUser());
  private readonly preferencesSignal = signal<LoginPreferencesResponse | null>(
    this.getStoredPreferences(),
  );

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly preferences = this.preferencesSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');
  readonly isTechnician = computed(() => this.userSignal()?.role === 'technician');
  readonly isSeller = computed(() => this.userSignal()?.role === 'seller');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap((response: LoginResponse) => {
        const { accessToken, user, preferences } = response;
        this.tokenSignal.set(accessToken);
        this.userSignal.set(user);
        this.preferencesSignal.set(preferences || null);
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          if (preferences) {
            localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
          }
        }
      }),
      catchError((error: unknown) => {
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.preferencesSignal.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PREFS_KEY);
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
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
