import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { InquiriesListComponent } from './inquiries-list.component';
import { InquiriesService } from '../../core/services/inquiries.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: { queryParamMap: convertToParamMap(queryParams) },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('InquiriesListComponent', () => {
  let component: InquiriesListComponent;
  let fixture: ComponentFixture<InquiriesListComponent>;
  let bulkDeleteSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    bulkDeleteSpy = vi.fn();
    toastSpy = vi.fn();
    dialogSpy = vi.fn();
    TestBed.configureTestingModule({
      imports: [InquiriesListComponent],
      providers: [
        { provide: InquiriesService, useValue: { delete: vi.fn(), bulkDelete: bulkDeleteSpy } },
        { provide: Router, useValue: { navigate: vi.fn(), events: of() } },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    TestBed.overrideComponent(InquiriesListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(InquiriesListComponent);
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
      component.toggleSelection('iq-1', true);
      expect(component.isSelected('iq-1')).toBe(true);
      component.toggleSelection('iq-1', false);
      expect(component.isSelected('iq-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('iq-1', true);
      component.toggleSelection('iq-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'iq-1' }, { id: 'iq-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('iq-1')).toBe(true);
      expect(component.isSelected('iq-2')).toBe(true);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });
  });

  describe('bulkDeleteInquiries()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkDeleteInquiries();
      expect(bulkDeleteSpy).not.toHaveBeenCalled();
    });

    it('should call bulkDelete and show success toast when confirmed', () => {
      component.toggleSelection('iq-1', true);
      bulkDeleteSpy.mockReturnValue(of({ succeeded: [{ id: 'iq-1' }], failed: [] }));
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteInquiries();

      expect(bulkDeleteSpy).toHaveBeenCalledWith(['iq-1']);
      expect(toastSpy).toHaveBeenCalledWith('common.toast.deleted', 'success');
    });

    it('should not call bulkDelete when dialog is cancelled', () => {
      component.toggleSelection('iq-1', true);
      dialogSpy.mockReturnValue({ afterClosed: () => of(false) });

      component.bulkDeleteInquiries();

      expect(bulkDeleteSpy).not.toHaveBeenCalled();
    });
  });
});
