import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, User } from '../models/auth.interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let navigateSpy: ReturnType<typeof vi.fn>;

  const mockUser: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
  };

  const mockLoginResponse: LoginResponse = {
    accessToken: 'jwt-token-abc123',
    user: mockUser,
  };

  const mockLoginResponseWithPrefs: LoginResponse = {
    ...mockLoginResponse,
    preferences: { theme: 'dark', language: 'es', dashboardLayout: [] },
  };

  beforeEach(() => {
    navigateSpy = vi.fn();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: navigateSpy } }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login()', () => {
    it('should POST to /api/auth/login with credentials', () => {
      const credentials: LoginRequest = { email: 'a@b.com', password: 'pass' };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });

    it('should set token signal on successful login', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(service.token()).toBe('jwt-token-abc123');
    });

    it('should set user signal on successful login', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(service.user()).toEqual(mockUser);
    });

    it('should set preferences signal when preferences are present', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponseWithPrefs);

      expect(service.preferences()).toEqual(mockLoginResponseWithPrefs.preferences);
    });

    it('should set preferences signal to null when preferences are absent', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(service.preferences()).toBeNull();
    });

    it('should store token in localStorage', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(localStorage.getItem('auth_token')).toBe('jwt-token-abc123');
    });

    it('should store user in localStorage', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(JSON.parse(localStorage.getItem('auth_user')!)).toEqual(mockUser);
    });

    it('should store preferences in localStorage when present', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponseWithPrefs);

      expect(JSON.parse(localStorage.getItem('auth_preferences')!)).toEqual(mockLoginResponseWithPrefs.preferences);
    });

    it('should not store preferences in localStorage when absent', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();

      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(localStorage.getItem('auth_preferences')).toBeNull();
    });

    it('should propagate HTTP errors without modifying state', () => {
      service.login({ email: 'a@b.com', password: 'wrong' }).subscribe({
        error: (err) => {
          expect(err.status).toBe(401);
        },
      });

      httpMock.expectOne('/api/auth/login').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(service.token()).toBeNull();
      expect(service.user()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should propagate 500 errors', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
        },
      });

      httpMock.expectOne('/api/auth/login').flush('Server Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('logout()', () => {
    it('should clear token signal', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.logout();

      expect(service.token()).toBeNull();
    });

    it('should clear user signal', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.logout();

      expect(service.user()).toBeNull();
    });

    it('should clear preferences signal', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponseWithPrefs);

      service.logout();

      expect(service.preferences()).toBeNull();
    });

    it('should remove token from localStorage', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should remove user from localStorage', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.logout();

      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should remove preferences from localStorage', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponseWithPrefs);

      service.logout();

      expect(localStorage.getItem('auth_preferences')).toBeNull();
    });

    it('should navigate to /login', () => {
      service.logout();

      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should be safe to call when nothing is stored', () => {
      expect(() => service.logout()).not.toThrow();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken()', () => {
    it('should return null when not authenticated', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return token after login', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(service.getToken()).toBe('jwt-token-abc123');
    });
  });

  describe('isAuthenticated', () => {
    it('should be false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should be true after login', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should be false after logout', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.logout();

      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('role-based computed signals', () => {
    it('isAdmin should be true when role is admin', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(service.isAdmin()).toBe(true);
      expect(service.isTechnician()).toBe(false);
      expect(service.isSeller()).toBe(false);
    });

    it('isTechnician should be true when role is technician', () => {
      const techUser: User = { ...mockUser, role: 'technician' };
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush({ ...mockLoginResponse, user: techUser });

      expect(service.isTechnician()).toBe(true);
      expect(service.isAdmin()).toBe(false);
      expect(service.isSeller()).toBe(false);
    });

    it('isSeller should be true when role is seller', () => {
      const sellerUser: User = { ...mockUser, role: 'seller' };
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush({ ...mockLoginResponse, user: sellerUser });

      expect(service.isSeller()).toBe(true);
      expect(service.isAdmin()).toBe(false);
      expect(service.isTechnician()).toBe(false);
    });

    it('should all be false when no user is set', () => {
      expect(service.isAdmin()).toBe(false);
      expect(service.isTechnician()).toBe(false);
      expect(service.isSeller()).toBe(false);
    });
  });

  describe('updateAvatar()', () => {
    it('should update user signal with new avatar', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.updateAvatar('https://example.com/avatar.png');

      expect(service.user()?.avatar).toBe('https://example.com/avatar.png');
    });

    it('should persist updated avatar in localStorage', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.updateAvatar('https://example.com/avatar.png');

      const stored = JSON.parse(localStorage.getItem('auth_user')!);
      expect(stored.avatar).toBe('https://example.com/avatar.png');
    });

    it('should not throw when user is null', () => {
      expect(() => service.updateAvatar('avatar.png')).not.toThrow();
    });

    it('should preserve other user fields when updating avatar', () => {
      service.login({ email: 'a@b.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      service.updateAvatar('new-avatar.png');

      expect(service.user()?.id).toBe('user-1');
      expect(service.user()?.name).toBe('Test User');
      expect(service.user()?.email).toBe('test@example.com');
      expect(service.user()?.role).toBe('admin');
    });
  });

  describe('constructor - localStorage restoration', () => {
    it('should restore token from localStorage on construction', () => {
      localStorage.setItem('auth_token', 'restored-token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: vi.fn() } }],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.token()).toBe('restored-token');
    });

    it('should restore user from localStorage on construction', () => {
      localStorage.setItem('auth_token', 'restored-token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: vi.fn() } }],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.user()).toEqual(mockUser);
    });

    it('should handle "undefined" string in localStorage gracefully', () => {
      localStorage.setItem('auth_user', 'undefined');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: vi.fn() } }],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.user()).toBeNull();
    });

    it('should handle "null" string in localStorage gracefully', () => {
      localStorage.setItem('auth_user', 'null');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: vi.fn() } }],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.user()).toBeNull();
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorage.setItem('auth_user', '{invalid json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: vi.fn() } }],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.user()).toBeNull();
    });

    it('should restore preferences from localStorage', () => {
      const prefs = { theme: 'dark', language: 'es', dashboardLayout: [] };
      localStorage.setItem('auth_token', 'token');
      localStorage.setItem('auth_preferences', JSON.stringify(prefs));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: vi.fn() } }],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.preferences()).toEqual(prefs);
    });

    it('should handle "undefined" preferences in localStorage', () => {
      localStorage.setItem('auth_preferences', 'undefined');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: { navigate: vi.fn() } }],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.preferences()).toBeNull();
    });
  });
});
