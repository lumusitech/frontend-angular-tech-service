import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ClientsListComponent } from './clients-list.component';
import { ClientsService } from '../../core/services/clients.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable, of } from 'rxjs';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: {
      queryParamMap: convertToParamMap(queryParams),
    },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('ClientsListComponent', () => {
  let component: ClientsListComponent;
  let fixture: ComponentFixture<ClientsListComponent>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let deleteSpy: ReturnType<typeof vi.fn>;
  let bulkUpdateStatusSpy: ReturnType<typeof vi.fn>;
  let bulkDeleteSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigateSpy = vi.fn();
    deleteSpy = vi.fn();
    bulkUpdateStatusSpy = vi.fn();
    bulkDeleteSpy = vi.fn();
    toastSpy = vi.fn();
    dialogSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [ClientsListComponent],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            delete: deleteSpy,
            bulkUpdateStatus: bulkUpdateStatusSpy,
            bulkDelete: bulkDeleteSpy,
          },
        },
        { provide: Router, useValue: { navigate: navigateSpy } },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    TestBed.overrideComponent(ClientsListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(ClientsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have default filter values', () => {
      expect(component.currentPage()).toBe(1);
      expect(component.pageSize()).toBe(10);
      expect(component.sortBy()).toBe('createdAt');
      expect(component.sortOrder()).toBe('desc');
      expect(component.searchFilter()).toBe('');
      expect(component.isActiveFilter()).toBe('');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });

    it('should have highlightedId as null', () => {
      expect(component.highlightedId()).toBeNull();
    });

    it('should have correct displayed columns', () => {
      expect(component.displayedColumns).toEqual([
        'select',
        'name',
        'email',
        'phone',
        'address',
        'isActive',
        'createdAt',
        'actions',
      ]);
    });
  });

  describe('viewDetail()', () => {
    it('should navigate to client detail', () => {
      const client = { id: 'c-1', name: 'Test' } as never;
      component.viewDetail(client);
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/clients', 'c-1']);
    });
  });

  describe('onPageChange()', () => {
    it('should update currentPage and pageSize', () => {
      const event = { pageIndex: 2, pageSize: 25 } as PageEvent;
      component.onPageChange(event);
      expect(component.currentPage()).toBe(3);
      expect(component.pageSize()).toBe(25);
    });

    it('should reset to page 1 when changing page size', () => {
      component.currentPage.set(5);
      const event = { pageIndex: 0, pageSize: 50 } as PageEvent;
      component.onPageChange(event);
      expect(component.currentPage()).toBe(1);
      expect(component.pageSize()).toBe(50);
    });
  });

  describe('onSortChange()', () => {
    it('should update sort parameters', () => {
      const sort = { active: 'name', direction: 'asc' } as Sort;
      component.onSortChange(sort);
      expect(component.sortBy()).toBe('name');
      expect(component.sortOrder()).toBe('asc');
    });

    it('should default to asc when direction is empty', () => {
      const sort = { active: 'name', direction: '' } as Sort;
      component.onSortChange(sort);
      expect(component.sortOrder()).toBe('asc');
    });

    it('should handle desc direction', () => {
      const sort = { active: 'email', direction: 'desc' } as Sort;
      component.onSortChange(sort);
      expect(component.sortBy()).toBe('email');
      expect(component.sortOrder()).toBe('desc');
    });
  });

  describe('hasActiveFilters', () => {
    it('should be false when no filters are set', () => {
      expect(component.hasActiveFilters()).toBe(false);
    });

    it('should be true when searchFilter is set', () => {
      component.searchFilter.set('test');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when isActiveFilter is set', () => {
      component.isActiveFilter.set('true');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when dateFrom is set', () => {
      component.dateFrom.set('2026-01-01');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when dateTo is set', () => {
      component.dateTo.set('2026-12-31');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when multiple filters are set', () => {
      component.searchFilter.set('test');
      component.isActiveFilter.set('true');
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('date filter validation', () => {
    it('should update dateFrom via onDateFromChange', () => {
      const date = new Date(2026, 4, 15);
      const event = { value: date } as never;
      component.onDateFromChange(event);
      expect(component.dateFrom()).toMatch(/2026-05-15/);
      expect(component.dateError()).toBe('');
    });

    it('should clear dateFrom when value is null', () => {
      component.dateFrom.set('2026-05-15');
      const event = { value: null } as never;
      component.onDateFromChange(event);
      expect(component.dateFrom()).toBe('');
    });

    it('should update dateTo via onDateToChange', () => {
      const date = new Date(2026, 5, 30);
      const event = { value: date } as never;
      component.onDateToChange(event);
      expect(component.dateTo()).toMatch(/2026-06-30/);
      expect(component.dateError()).toBe('');
    });

    it('should clear dateTo when value is null', () => {
      component.dateTo.set('2026-06-30');
      const event = { value: null } as never;
      component.onDateToChange(event);
      expect(component.dateTo()).toBe('');
    });

    it('should not set dateFrom when it is after dateTo', () => {
      component.dateTo.set('2026-05-15');
      const event = { value: new Date(2026, 5, 30) } as never;
      component.onDateFromChange(event);
      expect(component.dateFrom()).toBe('');
      expect(component.dateError()).toBe('common.invalidDateTo');
    });

    it('should not set dateTo when it is before dateFrom', () => {
      component.dateFrom.set('2026-05-15');
      const event = { value: new Date(2026, 4, 10) } as never;
      component.onDateToChange(event);
      expect(component.dateTo()).toBe('');
      expect(component.dateError()).toBe('common.invalidDateFrom');
    });

    it('should clear dateError when clearing filters', () => {
      component.dateError.set('common.invalidDateTo');
      component.clearFilters();
      expect(component.dateError()).toBe('');
    });
  });

  describe('clearFilters()', () => {
    it('should reset all filters to empty and reset page to 1', () => {
      component.currentPage.set(5);
      component.searchFilter.set('test');
      component.isActiveFilter.set('true');
      component.dateFrom.set('2026-01-01');
      component.dateTo.set('2026-12-31');

      component.clearFilters();

      expect(component.searchFilter()).toBe('');
      expect(component.isActiveFilter()).toBe('');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('getClientFields()', () => {
    it('should return correct field array', () => {
      const client = {
        id: 'c-1',
        email: 'test@example.com',
        phone: '123456',
        address: 'Calle 123',
        createdAt: '2026-01-15T10:00:00.000Z',
      } as never;

      const fields = component.getClientFields(client);

      expect(fields).toHaveLength(4);
      expect(fields[0].value).toBe('test@example.com');
      expect(fields[0].type).toBe('email');
      expect(fields[1].value).toBe('123456');
      expect(fields[1].type).toBe('phone');
      expect(fields[2].value).toBe('Calle 123');
      expect(fields[3].value).toBe('2026-01-15T10:00:00.000Z');
      expect(fields[3].type).toBe('date');
    });

    it('should handle missing phone', () => {
      const client = {
        id: 'c-1',
        email: 'test@example.com',
        phone: '',
        address: 'Addr',
        createdAt: '2026-01-15T10:00:00.000Z',
      } as never;
      const fields = component.getClientFields(client);
      expect(fields[1].value).toBe('-');
    });

    it('should handle missing address', () => {
      const client = {
        id: 'c-1',
        email: 'test@example.com',
        phone: '123',
        address: '',
        createdAt: '2026-01-15T10:00:00.000Z',
      } as never;
      const fields = component.getClientFields(client);
      expect(fields[2].value).toBe('-');
    });
  });

  describe('onEditSwipe()', () => {
    it('should return a function', () => {
      const client = { id: 'c-1', name: 'Test' } as never;
      const swipeFn = component.onEditSwipe(client);
      expect(typeof swipeFn).toBe('function');
    });
  });

  describe('onDeleteSwipe()', () => {
    it('should return a function', () => {
      const client = { id: 'c-1', name: 'Test' } as never;
      const swipeFn = component.onDeleteSwipe(client);
      expect(typeof swipeFn).toBe('function');
    });
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      expect(component.isSelected('c-1')).toBe(false);
      component.toggleSelection('c-1', true);
      expect(component.isSelected('c-1')).toBe(true);
      component.toggleSelection('c-1', false);
      expect(component.isSelected('c-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.selectedIds.set(new Set(['c-1', 'c-2']));
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should do nothing on select-all when there is no page data', () => {
      component.onSelectAllPage(true);
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' },
      ];
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);
      expect(component.selectedIds()).toEqual(new Set(['a', 'b']));
      expect(component.allPageSelected()).toBe(true);
      expect(component.somePageSelected()).toBe(false);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });

    it('should compute somePageSelected when only part is selected', () => {
      const pageData = [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' },
      ];
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);
      component.selectedIds.set(new Set(['a']));
      expect(component.allPageSelected()).toBe(false);
      expect(component.somePageSelected()).toBe(true);
    });
  });

  describe('exportSelectedCsv()', () => {
    it('should do nothing when nothing is selected', () => {
      expect(() => component.exportSelectedCsv()).not.toThrow();
    });
  });

  describe('bulkSetActive()', () => {
    it('should do nothing when no ids are selected', () => {
      component.bulkSetActive(true);
      expect(bulkUpdateStatusSpy).not.toHaveBeenCalled();
    });

    it('should call bulkUpdateStatus and show success toast', () => {
      bulkUpdateStatusSpy.mockReturnValue(
        of({ succeeded: [{ id: 'a', isActive: false }], failed: [] }),
      );
      component.selectedIds.set(new Set(['a']));
      const reloadSpy = vi
        .spyOn(component.clientsResource, 'reload')
        .mockImplementation(() => true);

      component.bulkSetActive(false);

      expect(bulkUpdateStatusSpy).toHaveBeenCalledWith(['a'], false);
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.deactivated', 'success');
      expect(component.selectedIds().size).toBe(0);
      expect(component.bulkLoading()).toBe(false);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should show partial toast when some fail', () => {
      bulkUpdateStatusSpy.mockReturnValue(
        of({
          succeeded: [{ id: 'a', isActive: true }],
          failed: [{ id: 'b', reason: 'error' }],
        }),
      );
      component.selectedIds.set(new Set(['a', 'b']));
      vi.spyOn(component.clientsResource, 'reload').mockImplementation(() => true);

      component.bulkSetActive(true);

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });

    it('should show error toast on request error', () => {
      bulkUpdateStatusSpy.mockReturnValue(
        new Observable((subscriber) => subscriber.error({ error: { message: 'boom' } })),
      );
      component.selectedIds.set(new Set(['a']));
      vi.spyOn(component.clientsResource, 'reload').mockImplementation(() => true);

      component.bulkSetActive(false);

      expect(toastSpy).toHaveBeenCalledWith('boom', 'error');
      expect(component.bulkLoading()).toBe(false);
    });
  });

  describe('bulkDeleteClients()', () => {
    it('should open confirm dialog and delete when confirmed', () => {
      dialogSpy.mockReturnValue({ afterClosed: vi.fn().mockReturnValue(of(true)) });
      bulkDeleteSpy.mockReturnValue(of({ succeeded: [{ id: 'a' }], failed: [] }));
      component.selectedIds.set(new Set(['a']));
      const reloadSpy = vi
        .spyOn(component.clientsResource, 'reload')
        .mockImplementation(() => true);

      component.bulkDeleteClients();

      expect(dialogSpy).toHaveBeenCalled();
      expect(bulkDeleteSpy).toHaveBeenCalledWith(['a']);
      expect(toastSpy).toHaveBeenCalledWith('common.toast.deleted', 'success');
      expect(component.selectedIds().size).toBe(0);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should not delete when dialog is cancelled', () => {
      dialogSpy.mockReturnValue({ afterClosed: vi.fn().mockReturnValue(of(false)) });
      component.selectedIds.set(new Set(['a']));

      component.bulkDeleteClients();

      expect(bulkDeleteSpy).not.toHaveBeenCalled();
    });

    it('should show partial toast when some fail', () => {
      dialogSpy.mockReturnValue({ afterClosed: vi.fn().mockReturnValue(of(true)) });
      bulkDeleteSpy.mockReturnValue(
        of({
          succeeded: [{ id: 'a' }],
          failed: [{ id: 'b', reason: 'error' }],
        }),
      );
      component.selectedIds.set(new Set(['a', 'b']));
      vi.spyOn(component.clientsResource, 'reload').mockImplementation(() => true);

      component.bulkDeleteClients();

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });

  describe('ngOnInit - route query params', () => {
    it('should set highlight and search from query params', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ClientsListComponent],
        providers: [
          {
            provide: ClientsService,
            useValue: {
              delete: deleteSpy,
              bulkUpdateStatus: bulkUpdateStatusSpy,
              bulkDelete: bulkDeleteSpy,
            },
          },
          { provide: Router, useValue: { navigate: navigateSpy } },
          {
            provide: ActivatedRoute,
            useValue: createActivatedRouteMock({ highlight: 'c-1', search: 'test' }),
          },
          { provide: ToastService, useValue: { show: toastSpy } },
          { provide: MatDialog, useValue: { open: dialogSpy } },
          {
            provide: TranslationService,
            useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
          },
        ],
      });

      const freshFixture = TestBed.createComponent(ClientsListComponent);
      const freshComponent = freshFixture.componentInstance;
      freshFixture.detectChanges();

      expect(freshComponent.highlightedId()).toBe('c-1');
      expect(freshComponent.searchFilter()).toBe('test');
    });
  });
});
