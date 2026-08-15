import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrdersListComponent } from './work-orders-list.component';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { Observable, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { MobileCardComponent } from '../../shared/components/mobile-card/mobile-card.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import {
  WorkOrder,
  WorkOrderStatus,
  WorkOrderPriority,
  WorkOrderLocation,
} from '../../core/models/work-order.interfaces';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: {
      queryParamMap: convertToParamMap(queryParams),
    },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

function makeOrder(id: string, status: string): WorkOrder {
  return {
    id,
    trackingCode: `TS-${id.toUpperCase()}`,
    status: status as WorkOrderStatus,
    priority: 'medium' as WorkOrderPriority,
    location: 'workshop' as WorkOrderLocation,
    client: { id: 'c-1', name: 'Cliente', email: 'c@x.com', phone: '123' },
    serviceType: { id: 'st-1', name: 'Servicio' },
    technicians: [],
    tasks: [],
    materials: [],
    notes: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function makePaginated(orders: WorkOrder[]): PaginatedResponse<WorkOrder> {
  return { data: orders, total: orders.length, page: 1, limit: 10, totalPages: 1 };
}

describe('WorkOrdersListComponent - Date Filtering', () => {
  let component: WorkOrdersListComponent;
  let fixture: ComponentFixture<WorkOrdersListComponent>;
  let bulkStatusChangeSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;
  let deleteSpy: ReturnType<typeof vi.fn>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    bulkStatusChangeSpy = vi.fn();
    toastSpy = vi.fn();
    dialogSpy = vi.fn();
    deleteSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [WorkOrdersListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: WorkOrdersService,
          useValue: { bulkStatusChange: bulkStatusChangeSpy, delete: deleteSpy },
        },
        {
          provide: WebsocketService,
          useValue: { workOrderStatusChanges: () => ({}) },
        },
        {
          provide: TranslationService,
          useValue: {
            instant: vi.fn().mockImplementation((k: string) => k),
            locale: () => 'es',
          },
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
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((req) => req.flush({}));
    httpMock.verify();
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

  describe('mobile cards swipe actions (regression guard)', () => {
    it('should wire onDelete and onEdit handlers on every mobile card', async () => {
      fixture.detectChanges();
      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      req.flush(makePaginated([makeOrder('wo-1', 'pending'), makeOrder('wo-2', 'in_progress')]));
      await Promise.resolve();
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(By.directive(MobileCardComponent));
      expect(cards.length).toBeGreaterThan(0);

      for (const card of cards) {
        const cardComponent = card.componentInstance as MobileCardComponent;
        expect(typeof cardComponent.onDelete()).toBe('function');
        expect(typeof cardComponent.onEdit()).toBe('function');
      }
    });

    it('should invoke deleteOrder when the onDelete handler is called', async () => {
      fixture.detectChanges();
      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      req.flush(makePaginated([makeOrder('wo-1', 'pending')]));
      await Promise.resolve();
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.directive(MobileCardComponent));
      const onDelete = (card.componentInstance as MobileCardComponent).onDelete();
      expect(typeof onDelete).toBe('function');
      if (!onDelete) return;

      const order = { ...makeOrder('wo-1', 'pending') };
      dialogSpy.mockReturnValue({ afterClosed: vi.fn().mockReturnValue(of(true)) });
      deleteSpy.mockReturnValue(of(undefined));
      const reloadSpy = vi
        .spyOn(component.workOrdersResource, 'reload')
        .mockImplementation(() => true);

      onDelete(new Event('swipe'));

      expect(dialogSpy).toHaveBeenCalledWith(
        ConfirmDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'workOrders.deleteTitle',
            message: 'workOrders.deleteMessage',
            confirmLabel: 'common.delete',
            color: 'warn',
          }),
        }),
      );
      expect(deleteSpy).toHaveBeenCalledWith(order.id);
      expect(toastSpy).toHaveBeenCalledWith('common.toast.deleted', 'success');
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('deleteOrder()', () => {
    it('onDeleteSwipe should return a function that deletes the order', () => {
      const order = makeOrder('wo-1', 'pending');
      const swipeFn = component.onDeleteSwipe(order);
      expect(typeof swipeFn).toBe('function');

      dialogSpy.mockReturnValue({ afterClosed: vi.fn().mockReturnValue(of(true)) });
      deleteSpy.mockReturnValue(of(undefined));
      const reloadSpy = vi
        .spyOn(component.workOrdersResource, 'reload')
        .mockImplementation(() => true);

      swipeFn(new Event('swipe'));

      expect(dialogSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith('wo-1');
      expect(toastSpy).toHaveBeenCalledWith('common.toast.deleted', 'success');
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should not delete when the dialog is cancelled', () => {
      const order = makeOrder('wo-1', 'pending');
      dialogSpy.mockReturnValue({ afterClosed: vi.fn().mockReturnValue(of(false)) });

      component.deleteOrder(order);

      expect(dialogSpy).toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('should show error toast when delete fails', () => {
      const order = makeOrder('wo-1', 'pending');
      dialogSpy.mockReturnValue({ afterClosed: vi.fn().mockReturnValue(of(true)) });
      deleteSpy.mockReturnValue(
        new Observable((subscriber) => subscriber.error({ error: { message: 'boom' } })),
      );
      vi.spyOn(component.workOrdersResource, 'reload').mockImplementation(() => true);

      component.deleteOrder(order);

      expect(toastSpy).toHaveBeenCalledWith('boom', 'error');
    });
  });
});
