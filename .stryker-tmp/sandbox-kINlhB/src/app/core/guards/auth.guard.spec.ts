// @ts-nocheck
import { signal, computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard, adminGuard, technicianGuard, sellerGuard } from './auth.guard';

describe('Route Guards', () => {
  let mockAuthService: Record<string, unknown>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let createUrlTreeSpy: ReturnType<typeof vi.fn>;

  const tokenSignal = signal<string | null>(null);
  const userSignal = signal<{ id: string; name: string; role: string } | null>(null);

  beforeEach(() => {
    navigateSpy = vi.fn();
    createUrlTreeSpy = vi.fn().mockReturnValue({ toString: () => 'UrlTree' } as UrlTree);

    mockAuthService = {
      token: tokenSignal,
      user: userSignal,
      isAuthenticated: computed(() => !!tokenSignal()),
      isAdmin: computed(() => userSignal()?.role === 'admin'),
      isTechnician: computed(() => userSignal()?.role === 'technician'),
      isSeller: computed(() => userSignal()?.role === 'seller'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Router,
          useValue: { navigate: navigateSpy, createUrlTree: createUrlTreeSpy },
        },
      ],
    });

    tokenSignal.set(null);
    userSignal.set(null);
  });

  function runGuard(guard: Function): boolean | UrlTree {
    return TestBed.runInInjectionContext(() => guard() as boolean | UrlTree);
  }

  describe('authGuard', () => {
    it('should return true when authenticated', () => {
      tokenSignal.set('jwt-token');

      expect(runGuard(authGuard)).toBe(true);
    });

    it('should return UrlTree to /login when not authenticated', () => {
      runGuard(authGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('adminGuard', () => {
    it('should return true when authenticated and admin', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });

      expect(runGuard(adminGuard)).toBe(true);
    });

    it('should return UrlTree to /login when not authenticated', () => {
      runGuard(adminGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to home when authenticated but not admin', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'User', role: 'technician' });

      runGuard(adminGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/tech']);
    });

    it('should redirect to /seller when seller tries admin routes', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Seller', role: 'seller' });

      runGuard(adminGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/seller']);
    });

    it('should redirect to /admin/dashboard when role is unknown', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'User', role: 'unknown' });

      runGuard(adminGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/admin/dashboard']);
    });
  });

  describe('technicianGuard', () => {
    it('should return true when authenticated and technician', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Tech', role: 'technician' });

      expect(runGuard(technicianGuard)).toBe(true);
    });

    it('should return UrlTree to /login when not authenticated', () => {
      runGuard(technicianGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to home when authenticated but not technician', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });

      runGuard(technicianGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/admin/dashboard']);
    });

    it('should redirect to /seller when seller tries technician routes', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Seller', role: 'seller' });

      runGuard(technicianGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/seller']);
    });
  });

  describe('sellerGuard', () => {
    it('should return true when authenticated and seller', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Seller', role: 'seller' });

      expect(runGuard(sellerGuard)).toBe(true);
    });

    it('should return UrlTree to /login when not authenticated', () => {
      runGuard(sellerGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to home when authenticated but not seller', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });

      runGuard(sellerGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/admin/dashboard']);
    });

    it('should redirect to /tech when technician tries seller routes', () => {
      tokenSignal.set('jwt-token');
      userSignal.set({ id: '1', name: 'Tech', role: 'technician' });

      runGuard(sellerGuard);
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/tech']);
    });
  });
});
