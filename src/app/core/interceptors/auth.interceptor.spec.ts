import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { User } from '../models/auth.interfaces';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let showToastSpy: ReturnType<typeof vi.fn>;

  const mockUser: User = { id: 'user-1', name: 'Test', email: 'test@example.com', role: 'admin' };
  const refreshedSession = {
    accessToken: 'new-token',
    refreshToken: 'new-refresh',
    user: mockUser,
  };

  function flushMicrotasks(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  function mockAuthService() {
    return {
      getToken: vi.fn().mockReturnValue(null),
      getRefreshToken: vi.fn().mockReturnValue(null),
      refresh: vi.fn(),
      logout: vi.fn(),
    };
  }

  let authServiceMock: ReturnType<typeof mockAuthService>;

  beforeEach(() => {
    navigateSpy = vi.fn();
    showToastSpy = vi.fn();
    authServiceMock = mockAuthService();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: navigateSpy } },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: { show: showToastSpy } },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpClient).toBeTruthy();
  });

  describe('without token', () => {
    it('should not add Authorization header when no token', () => {
      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should pass request through unchanged', () => {
      httpClient.get('/api/test').subscribe((response) => {
        expect(response).toEqual({ data: 'ok' });
      });

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('GET');
      req.flush({ data: 'ok' });
    });
  });

  describe('with token', () => {
    it('should add Bearer token to Authorization header', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('jwt-token-123');

      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token-123');
      req.flush({});
    });

    it('should not modify other headers', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('jwt-token-123');

      httpClient.get('/api/test', { headers: { 'X-Custom': 'value' } }).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('X-Custom')).toBe('value');
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token-123');
      req.flush({});
    });
  });

  describe('401 error handling with refresh', () => {
    it('should retry the request with a new token after successful refresh', async () => {
      (authService.getToken as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce('expired-token')
        .mockReturnValue('new-token');
      (authService.refresh as ReturnType<typeof vi.fn>).mockReturnValue(of(refreshedSession));

      let result: unknown;
      httpClient.get('/api/test').subscribe((r) => (result = r));

      const req1 = httpMock.expectOne('/api/test');
      expect(req1.request.headers.get('Authorization')).toBe('Bearer expired-token');
      req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      await flushMicrotasks();

      const req2 = httpMock.expectOne('/api/test');
      expect(req2.request.headers.get('Authorization')).toBe('Bearer new-token');
      req2.flush({ data: 'ok' });

      expect(result).toEqual({ data: 'ok' });
      expect(authService.logout).not.toHaveBeenCalled();
    });

    it('should logout and show toast when refresh fails', async () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('expired-token');
      (authService.refresh as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
      );

      httpClient.get('/api/test').subscribe({
        error: (err) => expect(err.status).toBe(401),
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      await flushMicrotasks();

      expect(authService.logout).toHaveBeenCalled();
      expect(showToastSpy).toHaveBeenCalledWith(
        'Sesión expirada. Iniciá sesión nuevamente.',
        'error',
      );
    });

    it('should not attempt refresh on 401 from /api/auth/login', () => {
      httpClient.post('/api/auth/login', {}).subscribe({ error: () => undefined });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authService.refresh).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
    });

    it('should not attempt refresh on 401 from /api/auth/refresh', () => {
      httpClient.post('/api/auth/refresh', {}).subscribe({ error: () => undefined });

      const req = httpMock.expectOne('/api/auth/refresh');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authService.refresh).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
    });

    it('should not attempt refresh on 401 from /api/auth/logout', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      httpClient.post('/api/auth/logout', {}).subscribe({ error: () => undefined });

      const req = httpMock.expectOne('/api/auth/logout');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authService.refresh).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
    });

    it('should logout when the retried request also returns 401', async () => {
      (authService.getToken as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce('expired-token')
        .mockReturnValue('still-expired');
      (authService.refresh as ReturnType<typeof vi.fn>).mockReturnValue(of(refreshedSession));

      httpClient.get('/api/test').subscribe({ error: () => undefined });

      const req1 = httpMock.expectOne('/api/test');
      req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      await flushMicrotasks();

      const req2 = httpMock.expectOne('/api/test');
      req2.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authService.logout).toHaveBeenCalled();
      expect(showToastSpy).toHaveBeenCalledWith(
        'Sesión expirada. Iniciá sesión nuevamente.',
        'error',
      );
    });
  });

  describe('non-401 error handling', () => {
    it('should not logout on 403 error', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      httpClient.get('/api/test').subscribe({
        error: (err) => expect(err.status).toBe(403),
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

      expect(authService.logout).not.toHaveBeenCalled();
      expect(authService.refresh).not.toHaveBeenCalled();
    });

    it('should not logout on 500 error', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      httpClient.get('/api/test').subscribe({
        error: (err) => expect(err.status).toBe(500),
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });

      expect(authService.logout).not.toHaveBeenCalled();
      expect(authService.refresh).not.toHaveBeenCalled();
    });

    it('should propagate 400 errors without logout', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      httpClient.get('/api/test').subscribe({
        error: (err) => expect(err.status).toBe(400),
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      expect(authService.logout).not.toHaveBeenCalled();
      expect(authService.refresh).not.toHaveBeenCalled();
    });

    it('should handle network error (status 0 / offline) without logging out user', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      httpClient.get('/api/test').subscribe({
        error: (err) => {
          expect(err.status).toBe(0);
        },
      });

      const req = httpMock.expectOne('/api/test');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

      expect(authService.logout).not.toHaveBeenCalled();
      expect(authService.refresh).not.toHaveBeenCalled();
    });
  });
});
