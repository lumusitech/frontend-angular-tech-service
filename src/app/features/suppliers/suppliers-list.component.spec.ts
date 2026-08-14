import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuppliersListComponent } from './suppliers-list.component';
import { SuppliersService } from '../../core/services/suppliers.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { of } from 'rxjs';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: {
      queryParamMap: convertToParamMap(queryParams),
    },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('SuppliersListComponent', () => {
  let component: SuppliersListComponent;
  let fixture: ComponentFixture<SuppliersListComponent>;
  let bulkUpdateStatusSpy: ReturnType<typeof vi.fn>;
  let bulkDeleteSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    bulkUpdateStatusSpy = vi.fn();
    bulkDeleteSpy = vi.fn();
    toastSpy = vi.fn();
    dialogSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [SuppliersListComponent],
      providers: [
        {
          provide: SuppliersService,
          useValue: {
            delete: vi.fn(),
            bulkUpdateStatus: bulkUpdateStatusSpy,
            bulkDelete: bulkDeleteSpy,
          },
        },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    TestBed.overrideComponent(SuppliersListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(SuppliersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      component.toggleSelection('s-1', true);
      expect(component.isSelected('s-1')).toBe(true);
      component.toggleSelection('s-1', false);
      expect(component.isSelected('s-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('s-1', true);
      component.toggleSelection('s-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 's-1' }, { id: 's-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('s-1')).toBe(true);
      expect(component.isSelected('s-2')).toBe(true);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });
  });

  describe('exportSelectedCsv()', () => {
    it('should do nothing when nothing is selected', () => {
      const spy = vi.spyOn(component, 'exportSelectedCsv');
      component.exportSelectedCsv();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('bulkSetActive()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkSetActive(true);
      expect(bulkUpdateStatusSpy).not.toHaveBeenCalled();
    });

    it('should call bulkUpdateStatus and show success toast when confirmed', () => {
      component.toggleSelection('s-1', true);
      bulkUpdateStatusSpy.mockReturnValue(
        of({ succeeded: [{ id: 's-1', isActive: false }], failed: [] }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkSetActive(false);

      expect(bulkUpdateStatusSpy).toHaveBeenCalledWith(['s-1'], false);
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.deactivated', 'success');
    });

    it('should not call bulkUpdateStatus when dialog is cancelled', () => {
      component.toggleSelection('s-1', true);
      dialogSpy.mockReturnValue({ afterClosed: () => of(false) });

      component.bulkSetActive(false);

      expect(bulkUpdateStatusSpy).not.toHaveBeenCalled();
    });

    it('should show partial toast when some fail', () => {
      component.toggleSelection('s-1', true);
      component.toggleSelection('s-2', true);
      bulkUpdateStatusSpy.mockReturnValue(
        of({
          succeeded: [{ id: 's-1', isActive: false }],
          failed: [{ id: 's-2', reason: 'x' }],
        }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkSetActive(false);

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });

  describe('bulkDeleteSuppliers()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkDeleteSuppliers();
      expect(bulkDeleteSpy).not.toHaveBeenCalled();
    });

    it('should call bulkDelete and show success toast when confirmed', () => {
      component.toggleSelection('s-1', true);
      bulkDeleteSpy.mockReturnValue(of({ succeeded: [{ id: 's-1' }], failed: [] }));
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteSuppliers();

      expect(bulkDeleteSpy).toHaveBeenCalledWith(['s-1']);
      expect(toastSpy).toHaveBeenCalledWith('common.toast.deleted', 'success');
    });

    it('should show partial toast when some fail', () => {
      component.toggleSelection('s-1', true);
      component.toggleSelection('s-2', true);
      bulkDeleteSpy.mockReturnValue(
        of({
          succeeded: [],
          failed: [{ id: 's-1', reason: 'x' }],
        }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteSuppliers();

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });

  describe('filters', () => {
    it('should reset filters on clearFilters', () => {
      component.searchFilter.set('x');
      component.isActiveFilter.set('true');
      component.dateFrom.set('2026-01-01');
      component.dateTo.set('2026-01-02');
      component.clearFilters();
      expect(component.searchFilter()).toBe('');
      expect(component.isActiveFilter()).toBe('');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });

    it('should compute hasActiveFilters', () => {
      expect(component.hasActiveFilters()).toBe(false);
      component.searchFilter.set('x');
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('onPageChange()', () => {
    it('should update currentPage and pageSize', () => {
      const event = { pageIndex: 1, pageSize: 25 } as PageEvent;
      component.onPageChange(event);
      expect(component.currentPage()).toBe(2);
      expect(component.pageSize()).toBe(25);
    });
  });

  describe('onSortChange()', () => {
    it('should update sort parameters', () => {
      const event = { active: 'name', direction: 'desc' } as Sort;
      component.onSortChange(event);
      expect(component.sortBy()).toBe('name');
      expect(component.sortOrder()).toBe('desc');
    });
  });
});
