import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let showToastSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigateSpy = vi.fn();
    showToastSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: navigateSpy } },
        {
          provide: AuthService,
          useValue: {
            getToken: vi.fn().mockReturnValue(null),
            logout: vi.fn(),
          },
        },
        {
          provide: ToastService,
          useValue: { show: showToastSpy },
        },
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
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue(null);

      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should pass request through unchanged', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue(null);

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

  describe('401 error handling', () => {
    it('should call authService.logout on 401 error', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('expired-token');

      httpClient.get('/api/test').subscribe({
        error: (err) => expect(err.status).toBe(401),
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should show toast on 401 error', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('expired-token');

      httpClient.get('/api/test').subscribe({
        error: () => undefined,
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(showToastSpy).toHaveBeenCalledWith(
        'Sesión expirada o cuenta desactivada. Iniciá sesión nuevamente.',
        'error',
      );
    });

    it('should propagate the error after handling 401', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('expired-token');

      httpClient.get('/api/test').subscribe({
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(401);
          expect(err.statusText).toBe('Unauthorized');
        },
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
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
    });

    it('should not logout on 500 error', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      httpClient.get('/api/test').subscribe({
        error: (err) => expect(err.status).toBe(500),
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });

      expect(authService.logout).not.toHaveBeenCalled();
    });

    it('should propagate 400 errors without logout', () => {
      (authService.getToken as ReturnType<typeof vi.fn>).mockReturnValue('valid-token');

      httpClient.get('/api/test').subscribe({
        error: (err) => expect(err.status).toBe(400),
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      expect(authService.logout).not.toHaveBeenCalled();
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
    });
  });
});
