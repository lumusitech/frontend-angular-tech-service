import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ExpensesListComponent } from './expenses-list.component';
import { ExpensesService } from '../../core/services/expenses.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { MatDialog } from '@angular/material/dialog';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: { queryParamMap: convertToParamMap(queryParams) },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('ExpensesListComponent', () => {
  let component: ExpensesListComponent;
  let fixture: ComponentFixture<ExpensesListComponent>;
  let expensesService: { bulkDelete: ReturnType<typeof vi.fn> };
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    expensesService = { bulkDelete: vi.fn() };
    toastSpy = vi.fn();
    dialogSpy = vi.fn();
    TestBed.configureTestingModule({
      imports: [ExpensesListComponent],
      providers: [
        { provide: ExpensesService, useValue: expensesService },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    TestBed.overrideComponent(ExpensesListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(ExpensesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('date filter validation', () => {
    it('should update dateFrom via onDateFromChange', () => {
      const event = { value: new Date(2026, 4, 15) } as never;
      component.onDateFromChange(event);
      expect(component.dateFrom()).toMatch(/2026-05-15/);
      expect(component.dateError()).toBe('');
    });

    it('should clear dateFrom when value is null', () => {
      component.dateFrom.set('2026-05-15');
      component.onDateFromChange({ value: null } as never);
      expect(component.dateFrom()).toBe('');
    });

    it('should update dateTo via onDateToChange', () => {
      const event = { value: new Date(2026, 5, 30) } as never;
      component.onDateToChange(event);
      expect(component.dateTo()).toMatch(/2026-06-30/);
      expect(component.dateError()).toBe('');
    });

    it('should clear dateTo when value is null', () => {
      component.dateTo.set('2026-06-30');
      component.onDateToChange({ value: null } as never);
      expect(component.dateTo()).toBe('');
    });

    it('should not set dateFrom when it is after dateTo', () => {
      component.dateTo.set('2026-05-15');
      component.onDateFromChange({ value: new Date(2026, 5, 30) } as never);
      expect(component.dateFrom()).toBe('');
      expect(component.dateError()).toBe('common.invalidDateTo');
    });

    it('should not set dateTo when it is before dateFrom', () => {
      component.dateFrom.set('2026-05-15');
      component.onDateToChange({ value: new Date(2026, 4, 10) } as never);
      expect(component.dateTo()).toBe('');
      expect(component.dateError()).toBe('common.invalidDateFrom');
    });

    it('should clear dateError when clearing filters', () => {
      component.dateError.set('common.invalidDateTo');
      component.clearFilters();
      expect(component.dateError()).toBe('');
    });
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      component.toggleSelection('e-1', true);
      expect(component.isSelected('e-1')).toBe(true);
      component.toggleSelection('e-1', false);
      expect(component.isSelected('e-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('e-1', true);
      component.toggleSelection('e-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'e-1' }, { id: 'e-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('e-1')).toBe(true);
      expect(component.isSelected('e-2')).toBe(true);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });
  });

  describe('bulkDeleteExpenses()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkDeleteExpenses();
      expect(expensesService.bulkDelete).not.toHaveBeenCalled();
    });

    it('should call bulkDelete and show success toast on full success', () => {
      component.toggleSelection('e-1', true);
      expensesService.bulkDelete.mockReturnValue(of({ succeeded: [{ id: 'e-1' }], failed: [] }));
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteExpenses();

      expect(expensesService.bulkDelete).toHaveBeenCalledWith(['e-1']);
    });

    it('should show partial toast when some fail', () => {
      component.toggleSelection('e-1', true);
      expensesService.bulkDelete.mockReturnValue(
        of({ succeeded: [], failed: [{ id: 'e-1', reason: 'x' }] }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteExpenses();

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });
});
