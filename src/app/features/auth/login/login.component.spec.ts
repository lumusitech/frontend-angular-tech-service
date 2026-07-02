import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginSpy: ReturnType<typeof vi.fn>;
  let navigateSpy: ReturnType<typeof vi.fn>;

  const userSignal = signal<{ id: string; name: string; role: string } | null>(null);
  const tokenSignal = signal<string | null>(null);

  beforeEach(() => {
    navigateSpy = vi.fn();
    loginSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: loginSpy,
            user: userSignal,
            token: tokenSignal,
          },
        },
        {
          provide: Router,
          useValue: { navigate: navigateSpy },
        },
        {
          provide: TranslationService,
          useValue: {
            instant: vi.fn().mockImplementation((key: string) => key),
          },
        },
      ],
    });

    userSignal.set(null);
    tokenSignal.set(null);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    userSignal.set(null);
    tokenSignal.set(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty email and password', () => {
      expect(component.email()).toBe('');
      expect(component.password()).toBe('');
    });

    it('should have no error', () => {
      expect(component.error()).toBe('');
    });

    it('should not be loading', () => {
      expect(component.loading()).toBe(false);
    });
  });

  describe('getInputValue()', () => {
    it('should extract value from input event', () => {
      const event = { target: { value: 'test@example.com' } } as unknown as Event;
      expect(component.getInputValue(event)).toBe('test@example.com');
    });
  });

  describe('onSubmit()', () => {
    it('should prevent default form submission', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(of({}));

      component.onSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should call authService.login with email and password', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(of({}));

      component.email.set('user@test.com');
      component.password.set('pass123');
      component.onSubmit(event);

      expect(loginSpy).toHaveBeenCalledWith({ email: 'user@test.com', password: 'pass123' });
    });

    it('should set loading to true during login', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(of({}));

      component.onSubmit(event);

      expect(component.loading()).toBe(true);
    });

    it('should redirect to /admin/dashboard for admin role', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(
        of({}).pipe(
          tap(() => {
            tokenSignal.set('jwt-token');
            userSignal.set({ id: '1', name: 'Admin', role: 'admin' });
          }),
        ),
      );

      component.onSubmit(event);

      expect(navigateSpy).toHaveBeenCalledWith(['/admin/dashboard']);
    });

    it('should redirect to /tech for technician role', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(
        of({}).pipe(
          tap(() => {
            tokenSignal.set('jwt-token');
            userSignal.set({ id: '1', name: 'Tech', role: 'technician' });
          }),
        ),
      );

      component.onSubmit(event);

      expect(navigateSpy).toHaveBeenCalledWith(['/tech']);
    });

    it('should redirect to /seller for seller role', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(
        of({}).pipe(
          tap(() => {
            tokenSignal.set('jwt-token');
            userSignal.set({ id: '1', name: 'Seller', role: 'seller' });
          }),
        ),
      );

      component.onSubmit(event);

      expect(navigateSpy).toHaveBeenCalledWith(['/seller']);
    });

    it('should set error message on login failure', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(
        throwError(() => ({
          error: { message: 'Invalid credentials' },
        })),
      );

      component.onSubmit(event);

      expect(component.error()).toBe('Invalid credentials');
      expect(component.loading()).toBe(false);
    });

    it('should set default error message when no message in response', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      loginSpy.mockReturnValue(throwError(() => ({})));

      component.onSubmit(event);

      expect(component.error()).toBeTruthy();
      expect(component.loading()).toBe(false);
    });

    it('should clear previous error on new submission', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      component.error.set('Previous error');
      loginSpy.mockReturnValue(throwError(() => ({})));

      component.onSubmit(event);

      expect(component.error()).not.toBe('Previous error');
    });
  });

  describe('template', () => {
    it('should render email input', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[type="email"]');
      expect(input).toBeTruthy();
    });

    it('should render password input', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[type="password"]');
      expect(input).toBeTruthy();
    });

    it('should render submit button', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
    });

    it('should show error message when error is set', () => {
      component.error.set('Test error');
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('[class*="red"]');
      expect(errorDiv).toBeTruthy();
    });

    it('should disable button when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(true);
    });
  });
});
