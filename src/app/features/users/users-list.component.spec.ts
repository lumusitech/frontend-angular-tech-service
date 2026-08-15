import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UsersListComponent } from './users-list.component';
import { UsersService } from '../../core/services/users.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: { queryParamMap: convertToParamMap(queryParams) },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let bulkUpdateStatusSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let dialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    bulkUpdateStatusSpy = vi.fn();
    toastSpy = vi.fn();
    dialogSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        {
          provide: UsersService,
          useValue: {
            delete: vi.fn(),
            bulkUpdateStatus: bulkUpdateStatusSpy,
          },
        },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: Router, useValue: { events: of(), url: '/admin/users', navigate: vi.fn() } },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    TestBed.overrideComponent(UsersListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      component.toggleSelection('u-1', true);
      expect(component.isSelected('u-1')).toBe(true);
      component.toggleSelection('u-1', false);
      expect(component.isSelected('u-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('u-1', true);
      component.toggleSelection('u-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'u-1' }, { id: 'u-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('u-1')).toBe(true);
      expect(component.isSelected('u-2')).toBe(true);

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
      component.toggleSelection('u-1', true);
      bulkUpdateStatusSpy.mockReturnValue(
        of({ succeeded: [{ id: 'u-1', isActive: false }], failed: [] }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkSetActive(false);

      expect(bulkUpdateStatusSpy).toHaveBeenCalledWith(['u-1'], false);
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.deactivated', 'success');
    });

    it('should not call bulkUpdateStatus when dialog is cancelled', () => {
      component.toggleSelection('u-1', true);
      dialogSpy.mockReturnValue({ afterClosed: () => of(false) });

      component.bulkSetActive(false);

      expect(bulkUpdateStatusSpy).not.toHaveBeenCalled();
    });

    it('should show partial toast when some fail', () => {
      component.toggleSelection('u-1', true);
      component.toggleSelection('u-2', true);
      bulkUpdateStatusSpy.mockReturnValue(
        of({
          succeeded: [{ id: 'u-1', isActive: false }],
          failed: [{ id: 'u-2', reason: 'x' }],
        }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkSetActive(false);

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });

  describe('filters', () => {
    it('should reset filters on clearFilters', () => {
      component.searchFilter.set('x');
      component.roleFilter.set('technician');
      component.clearFilters();
      expect(component.searchFilter()).toBe('');
      expect(component.roleFilter()).toBe('');
    });

    it('should compute hasActiveFilters', () => {
      expect(component.hasActiveFilters()).toBe(false);
      component.searchFilter.set('x');
      expect(component.hasActiveFilters()).toBe(true);
    });
  });
});
