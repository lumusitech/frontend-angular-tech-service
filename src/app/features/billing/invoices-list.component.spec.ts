import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InvoicesListComponent } from './invoices-list.component';
import { BillingService } from '../../core/services/billing.service';
import { TranslationService } from '../../core/services/translation.service';

describe('InvoicesListComponent - Date Filtering', () => {
  let component: InvoicesListComponent;
  let fixture: ComponentFixture<InvoicesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InvoicesListComponent],
      providers: [
        { provide: BillingService, useValue: {} },
        { provide: TranslationService, useValue: { instant: vi.fn().mockImplementation((k: string) => k) } },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(InvoicesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('dateField signal', () => {
    it('should default to createdAt', () => {
      expect(component.dateField()).toBe('createdAt');
    });

    it('should update when onDateFieldChange is called', () => {
      component.onDateFieldChange('issuedAt');
      expect(component.dateField()).toBe('issuedAt');
    });
  });

  describe('dateFieldOptions', () => {
    it('should have createdAt and issuedAt options', () => {
      expect(component.dateFieldOptions).toEqual([
        { value: 'createdAt', labelKey: 'common.dateFieldCreated' },
        { value: 'issuedAt', labelKey: 'billing.dateFieldIssued' },
      ]);
    });
  });

  describe('onDateFieldChange', () => {
    it('should update dateField and reset dates', () => {
      component.dateFrom.set('2026-05-01');
      component.dateTo.set('2026-06-30');

      component.onDateFieldChange('issuedAt');

      expect(component.dateField()).toBe('issuedAt');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });
  });

  describe('clearFilters', () => {
    it('should reset dateField to createdAt', () => {
      component.dateField.set('issuedAt');
      component.clearFilters();
      expect(component.dateField()).toBe('createdAt');
    });

    it('should reset dateFrom and dateTo', () => {
      component.dateFrom.set('2026-05-01');
      component.dateTo.set('2026-06-30');
      component.clearFilters();
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });
  });

  describe('hasActiveFilters', () => {
    it('should be false when no filters are set', () => {
      expect(component.hasActiveFilters()).toBe(false);
    });

    it('should be true when dateFrom is set', () => {
      component.dateFrom.set('2026-05-01');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when dateTo is set', () => {
      component.dateTo.set('2026-06-30');
      expect(component.hasActiveFilters()).toBe(true);
    });
  });
});
