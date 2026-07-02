import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/services/auth.service';
import { RoleDirective } from './role.directive';
import { Component } from '@angular/core';

@Component({
  template: `<div *role="'admin'">Admin Content</div>`,
  imports: [RoleDirective],
})
class TestAdminComponent {}

@Component({
  template: `<div *role="'technician'">Tech Content</div>`,
  imports: [RoleDirective],
})
class TestTechComponent {}

@Component({
  template: `<div *role="'admin,technician'">Admin or Tech Content</div>`,
  imports: [RoleDirective],
})
class TestMultiRoleComponent {}

@Component({
  template: `<div *role="'seller'">Seller Content</div>`,
  imports: [RoleDirective],
})
class TestSellerComponent {}

describe('RoleDirective', () => {
  const userSignal = signal<{ id: string; name: string; role: string } | null>(null);

  function configureTestBed(component: unknown) {
    TestBed.configureTestingModule({
      imports: [component as never],
      providers: [
        {
          provide: AuthService,
          useValue: {
            user: userSignal,
          },
        },
      ],
    });
  }

  beforeEach(() => {
    userSignal.set(null);
  });

  describe('single role', () => {
    it('should show content when user has matching role', () => {
      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });
      configureTestBed(TestAdminComponent);

      const fixture = TestBed.createComponent(TestAdminComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Admin Content');
    });

    it('should hide content when user has different role', () => {
      userSignal.set({ id: '1', name: 'Tech', role: 'technician' });
      configureTestBed(TestAdminComponent);

      const fixture = TestBed.createComponent(TestAdminComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Admin Content');
    });

    it('should hide content when user is null', () => {
      userSignal.set(null);
      configureTestBed(TestAdminComponent);

      const fixture = TestBed.createComponent(TestAdminComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Admin Content');
    });

    it('should show tech content for technician role', () => {
      userSignal.set({ id: '1', name: 'Tech', role: 'technician' });
      configureTestBed(TestTechComponent);

      const fixture = TestBed.createComponent(TestTechComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Tech Content');
    });

    it('should show seller content for seller role', () => {
      userSignal.set({ id: '1', name: 'Seller', role: 'seller' });
      configureTestBed(TestSellerComponent);

      const fixture = TestBed.createComponent(TestSellerComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Seller Content');
    });
  });

  describe('multiple roles (comma-separated)', () => {
    it('should show content when user has one of the allowed roles', () => {
      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });
      configureTestBed(TestMultiRoleComponent);

      const fixture = TestBed.createComponent(TestMultiRoleComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Admin or Tech Content');
    });

    it('should show content for technician in multi-role', () => {
      userSignal.set({ id: '1', name: 'Tech', role: 'technician' });
      configureTestBed(TestMultiRoleComponent);

      const fixture = TestBed.createComponent(TestMultiRoleComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Admin or Tech Content');
    });

    it('should hide content when role is not in the list', () => {
      userSignal.set({ id: '1', name: 'Seller', role: 'seller' });
      configureTestBed(TestMultiRoleComponent);

      const fixture = TestBed.createComponent(TestMultiRoleComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Admin or Tech Content');
    });
  });

  describe('dynamic role changes', () => {
    it('should show content when user role changes to matching', () => {
      userSignal.set(null);
      configureTestBed(TestAdminComponent);

      const fixture = TestBed.createComponent(TestAdminComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Admin Content');

      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Admin Content');
    });

    it('should hide content when user role changes away', () => {
      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });
      configureTestBed(TestAdminComponent);

      const fixture = TestBed.createComponent(TestAdminComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Admin Content');

      userSignal.set(null);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Admin Content');
    });
  });

  describe('edge cases', () => {
    it('should handle role with spaces around comma', () => {
      userSignal.set({ id: '1', name: 'Admin', role: 'admin' });
      configureTestBed(TestMultiRoleComponent);

      const fixture = TestBed.createComponent(TestMultiRoleComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Admin or Tech Content');
    });

    it('should handle empty user role', () => {
      userSignal.set({ id: '1', name: 'User', role: '' });
      configureTestBed(TestAdminComponent);

      const fixture = TestBed.createComponent(TestAdminComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Admin Content');
    });
  });
});
