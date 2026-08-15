import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SkillsListComponent } from './skills-list.component';
import { SkillsService } from '../../core/services/skills.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: { queryParamMap: convertToParamMap(queryParams) },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('SkillsListComponent', () => {
  let component: SkillsListComponent;
  let fixture: ComponentFixture<SkillsListComponent>;
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
      imports: [SkillsListComponent],
      providers: [
        {
          provide: SkillsService,
          useValue: {
            delete: vi.fn(),
            bulkUpdateStatus: bulkUpdateStatusSpy,
            bulkDelete: bulkDeleteSpy,
          },
        },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    TestBed.overrideComponent(SkillsListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(SkillsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      component.toggleSelection('sk-1', true);
      expect(component.isSelected('sk-1')).toBe(true);
      component.toggleSelection('sk-1', false);
      expect(component.isSelected('sk-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('sk-1', true);
      component.toggleSelection('sk-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'sk-1' }, { id: 'sk-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('sk-1')).toBe(true);
      expect(component.isSelected('sk-2')).toBe(true);

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
      component.toggleSelection('sk-1', true);
      bulkUpdateStatusSpy.mockReturnValue(
        of({ succeeded: [{ id: 'sk-1', isActive: false }], failed: [] }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkSetActive(false);

      expect(bulkUpdateStatusSpy).toHaveBeenCalledWith(['sk-1'], false);
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.deactivated', 'success');
    });

    it('should not call bulkUpdateStatus when dialog is cancelled', () => {
      component.toggleSelection('sk-1', true);
      dialogSpy.mockReturnValue({ afterClosed: () => of(false) });

      component.bulkSetActive(false);

      expect(bulkUpdateStatusSpy).not.toHaveBeenCalled();
    });

    it('should show partial toast when some fail', () => {
      component.toggleSelection('sk-1', true);
      component.toggleSelection('sk-2', true);
      bulkUpdateStatusSpy.mockReturnValue(
        of({
          succeeded: [{ id: 'sk-1', isActive: false }],
          failed: [{ id: 'sk-2', reason: 'x' }],
        }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkSetActive(false);

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });

  describe('bulkDeleteSkills()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkDeleteSkills();
      expect(bulkDeleteSpy).not.toHaveBeenCalled();
    });

    it('should call bulkDelete and show success toast when confirmed', () => {
      component.toggleSelection('sk-1', true);
      bulkDeleteSpy.mockReturnValue(of({ succeeded: [{ id: 'sk-1' }], failed: [] }));
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteSkills();

      expect(bulkDeleteSpy).toHaveBeenCalledWith(['sk-1']);
      expect(toastSpy).toHaveBeenCalledWith('common.toast.deleted', 'success');
    });

    it('should show partial toast when some fail', () => {
      component.toggleSelection('sk-1', true);
      component.toggleSelection('sk-2', true);
      bulkDeleteSpy.mockReturnValue(
        of({
          succeeded: [],
          failed: [{ id: 'sk-1', reason: 'x' }],
        }),
      );
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteSkills();

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });

  describe('filters', () => {
    it('should reset filters on clearFilters', () => {
      component.searchFilter.set('x');
      component.categoryFilter.set('Networking');
      component.clearFilters();
      expect(component.searchFilter()).toBe('');
      expect(component.categoryFilter()).toBe('');
    });

    it('should compute hasActiveFilters', () => {
      expect(component.hasActiveFilters()).toBe(false);
      component.searchFilter.set('x');
      expect(component.hasActiveFilters()).toBe(true);
    });
  });
});
