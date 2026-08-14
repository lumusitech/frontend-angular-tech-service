import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InvoicesListComponent } from './invoices-list.component';
import { BillingService } from '../../core/services/billing.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';
import { of } from 'rxjs';

describe('InvoicesListComponent - Date Filtering', () => {
  let component: InvoicesListComponent;
  let fixture: ComponentFixture<InvoicesListComponent>;
  let bulkIssueSpy: ReturnType<typeof vi.fn>;
  let bulkCancelSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    bulkIssueSpy = vi.fn();
    bulkCancelSpy = vi.fn();
    toastSpy = vi.fn();
    dialogSpy = vi.fn();
    TestBed.configureTestingModule({
      imports: [InvoicesListComponent],
      providers: [
        {
          provide: BillingService,
          useValue: {
            bulkIssue: bulkIssueSpy,
            bulkCancel: bulkCancelSpy,
          },
        },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((k: string) => k) },
        },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ToastService, useValue: { show: toastSpy } },
      ],
    });

    TestBed.overrideComponent(InvoicesListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
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

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      component.toggleSelection('inv-1', true);
      expect(component.isSelected('inv-1')).toBe(true);
      component.toggleSelection('inv-1', false);
      expect(component.isSelected('inv-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('inv-1', true);
      component.toggleSelection('inv-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'inv-1' }, { id: 'inv-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('inv-1')).toBe(true);
      expect(component.isSelected('inv-2')).toBe(true);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });
  });

  describe('bulkIssueInvoices()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkIssueInvoices();
      expect(bulkIssueSpy).not.toHaveBeenCalled();
    });

    it('should call bulkIssue and show success toast when confirmed', () => {
      component.toggleSelection('inv-1', true);
      bulkIssueSpy.mockReturnValue(
        of({ succeeded: [{ id: 'inv-1', status: 'issued' }], failed: [] }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkIssueInvoices();

      expect(bulkIssueSpy).toHaveBeenCalledWith(['inv-1']);
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.issued', 'success');
    });

    it('should not call bulkIssue when dialog is cancelled', () => {
      component.toggleSelection('inv-1', true);
      dialogSpy.mockReturnValue({ afterClosed: () => of(false) });

      component.bulkIssueInvoices();

      expect(bulkIssueSpy).not.toHaveBeenCalled();
    });
  });

  describe('bulkCancelInvoices()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkCancelInvoices();
      expect(bulkCancelSpy).not.toHaveBeenCalled();
    });

    it('should call bulkCancel and show success toast when confirmed', () => {
      component.toggleSelection('inv-1', true);
      bulkCancelSpy.mockReturnValue(
        of({ succeeded: [{ id: 'inv-1', status: 'cancelled' }], failed: [] }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkCancelInvoices();

      expect(bulkCancelSpy).toHaveBeenCalledWith(['inv-1']);
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.cancelled', 'success');
    });

    it('should not call bulkCancel when dialog is cancelled', () => {
      component.toggleSelection('inv-1', true);
      dialogSpy.mockReturnValue({ afterClosed: () => of(false) });

      component.bulkCancelInvoices();

      expect(bulkCancelSpy).not.toHaveBeenCalled();
    });
  });
});
