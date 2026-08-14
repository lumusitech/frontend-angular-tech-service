import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrdersListComponent } from './work-orders-list.component';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { Observable, of } from 'rxjs';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: {
      queryParamMap: convertToParamMap(queryParams),
    },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('WorkOrdersListComponent - Date Filtering', () => {
  let component: WorkOrdersListComponent;
  let fixture: ComponentFixture<WorkOrdersListComponent>;
  let bulkStatusChangeSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    bulkStatusChangeSpy = vi.fn();
    toastSpy = vi.fn();
    dialogSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [WorkOrdersListComponent],
      providers: [
        {
          provide: WorkOrdersService,
          useValue: { bulkStatusChange: bulkStatusChangeSpy },
        },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((k: string) => k) },
        },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: toastSpy } },
      ],
    });

    TestBed.overrideComponent(WorkOrdersListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(WorkOrdersListComponent);
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
      component.onDateFieldChange('scheduledDate');
      expect(component.dateField()).toBe('scheduledDate');
    });
  });

  describe('dateFieldOptions', () => {
    it('should have createdAt and scheduledDate options', () => {
      expect(component.dateFieldOptions).toEqual([
        { value: 'createdAt', labelKey: 'common.dateFieldCreated' },
        { value: 'scheduledDate', labelKey: 'workOrders.scheduledDate' },
      ]);
    });
  });

  describe('onDateFieldChange', () => {
    it('should update dateField and reset dates', () => {
      component.dateFrom.set('2026-05-01');
      component.dateTo.set('2026-06-30');

      component.onDateFieldChange('scheduledDate');

      expect(component.dateField()).toBe('scheduledDate');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });
  });

  describe('clearFilters', () => {
    it('should reset dateField to createdAt', () => {
      component.dateField.set('scheduledDate');
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

    it('should be true when statusFilter is set', () => {
      component.statusFilter.set('pending');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when priorityFilter is set', () => {
      component.priorityFilter.set('high');
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      expect(component.isSelected('w-1')).toBe(false);
      component.toggleSelection('w-1', true);
      expect(component.isSelected('w-1')).toBe(true);
      component.toggleSelection('w-1', false);
      expect(component.isSelected('w-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.selectedIds.set(new Set(['w-1', 'w-2']));
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'w-1' }, { id: 'w-2' }];
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);
      expect(component.selectedIds()).toEqual(new Set(['w-1', 'w-2']));
      expect(component.allPageSelected()).toBe(true);
      expect(component.somePageSelected()).toBe(false);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });

    it('should compute somePageSelected when only part is selected', () => {
      const pageData = [{ id: 'w-1' }, { id: 'w-2' }];
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);
      component.selectedIds.set(new Set(['w-1']));
      expect(component.allPageSelected()).toBe(false);
      expect(component.somePageSelected()).toBe(true);
    });
  });

  describe('exportSelectedCsv()', () => {
    it('should do nothing when nothing is selected', () => {
      expect(() => component.exportSelectedCsv()).not.toThrow();
    });
  });

  describe('openBulkStatusDialog()', () => {
    it('should do nothing when no ids are selected', () => {
      component.openBulkStatusDialog();
      expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should open dialog and call bulkStatusChange when confirmed', () => {
      dialogSpy.mockReturnValue({
        afterClosed: vi
          .fn()
          .mockReturnValue(of({ confirmed: true, detail: '', status: 'completed' })),
      });
      bulkStatusChangeSpy.mockReturnValue(
        of({ succeeded: [{ id: 'w-1', status: 'completed' }], failed: [] }),
      );
      component.selectedIds.set(new Set(['w-1']));
      const reloadSpy = vi
        .spyOn(component.workOrdersResource, 'reload')
        .mockImplementation(() => true);

      component.openBulkStatusDialog();

      expect(dialogSpy).toHaveBeenCalled();
      expect(bulkStatusChangeSpy).toHaveBeenCalledWith(['w-1'], 'completed');
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.statusChanged', 'success');
      expect(component.selectedIds().size).toBe(0);
      expect(component.bulkLoading()).toBe(false);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should not call bulkStatusChange when dialog is cancelled', () => {
      dialogSpy.mockReturnValue({
        afterClosed: vi.fn().mockReturnValue(of({ confirmed: false, detail: '', status: '' })),
      });
      component.selectedIds.set(new Set(['w-1']));

      component.openBulkStatusDialog();

      expect(bulkStatusChangeSpy).not.toHaveBeenCalled();
    });

    it('should show partial toast when some fail', () => {
      dialogSpy.mockReturnValue({
        afterClosed: vi
          .fn()
          .mockReturnValue(of({ confirmed: true, detail: '', status: 'cancelled' })),
      });
      bulkStatusChangeSpy.mockReturnValue(
        of({
          succeeded: [{ id: 'w-1', status: 'cancelled' }],
          failed: [{ id: 'w-2', reason: 'Invalid status transition' }],
        }),
      );
      component.selectedIds.set(new Set(['w-1', 'w-2']));
      vi.spyOn(component.workOrdersResource, 'reload').mockImplementation(() => true);

      component.openBulkStatusDialog();

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });

    it('should show error toast on request error', () => {
      dialogSpy.mockReturnValue({
        afterClosed: vi
          .fn()
          .mockReturnValue(of({ confirmed: true, detail: '', status: 'pending' })),
      });
      bulkStatusChangeSpy.mockReturnValue(
        new Observable((subscriber) => subscriber.error({ error: { message: 'boom' } })),
      );
      component.selectedIds.set(new Set(['w-1']));
      vi.spyOn(component.workOrdersResource, 'reload').mockImplementation(() => true);

      component.openBulkStatusDialog();

      expect(toastSpy).toHaveBeenCalledWith('boom', 'error');
      expect(component.bulkLoading()).toBe(false);
    });
  });
});
