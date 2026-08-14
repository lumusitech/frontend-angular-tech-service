import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PendingItemsListComponent } from './pending-items-list.component';
import { PendingItemsService } from '../../core/services/pending-items.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { of } from 'rxjs';

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: {
      queryParamMap: convertToParamMap(queryParams),
    },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('PendingItemsListComponent', () => {
  let component: PendingItemsListComponent;
  let fixture: ComponentFixture<PendingItemsListComponent>;
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
      imports: [PendingItemsListComponent],
      providers: [
        {
          provide: PendingItemsService,
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

    TestBed.overrideComponent(PendingItemsListComponent, {
      add: { providers: [{ provide: MatDialog, useValue: { open: dialogSpy } }] },
    });

    fixture = TestBed.createComponent(PendingItemsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      component.toggleSelection('pi-1', true);
      expect(component.isSelected('pi-1')).toBe(true);
      component.toggleSelection('pi-1', false);
      expect(component.isSelected('pi-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('pi-1', true);
      component.toggleSelection('pi-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'pi-1' }, { id: 'pi-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('pi-1')).toBe(true);
      expect(component.isSelected('pi-2')).toBe(true);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });
  });

  describe('openBulkStatusDialog()', () => {
    it('should do nothing when no ids are selected', () => {
      component.openBulkStatusDialog();
      expect(bulkUpdateStatusSpy).not.toHaveBeenCalled();
    });

    it('should open dialog and call bulkUpdateStatus when confirmed', () => {
      component.toggleSelection('pi-1', true);
      dialogSpy.mockReturnValue({
        afterClosed: () => of({ confirmed: true, status: 'completed', detail: '' }),
      });
      bulkUpdateStatusSpy.mockReturnValue(
        of({ succeeded: [{ id: 'pi-1', status: 'completed' }], failed: [] }),
      );

      component.openBulkStatusDialog();

      expect(bulkUpdateStatusSpy).toHaveBeenCalledWith(['pi-1'], 'completed');
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.statusChanged', 'success');
    });

    it('should not call bulkUpdateStatus when dialog is cancelled', () => {
      component.toggleSelection('pi-1', true);
      dialogSpy.mockReturnValue({
        afterClosed: () => of({ confirmed: false, status: '', detail: '' }),
      });

      component.openBulkStatusDialog();

      expect(bulkUpdateStatusSpy).not.toHaveBeenCalled();
    });
  });

  describe('bulkDeleteItems()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkDeleteItems();
      expect(bulkDeleteSpy).not.toHaveBeenCalled();
    });

    it('should call bulkDelete and show success toast when confirmed', () => {
      component.toggleSelection('pi-1', true);
      bulkDeleteSpy.mockReturnValue(of({ succeeded: [{ id: 'pi-1' }], failed: [] }));
      dialogSpy.mockReturnValue({ afterClosed: () => of(true) });

      component.bulkDeleteItems();

      expect(bulkDeleteSpy).toHaveBeenCalledWith(['pi-1']);
      expect(toastSpy).toHaveBeenCalledWith('common.toast.deleted', 'success');
    });
  });

  describe('helpers', () => {
    it('should return label helpers', () => {
      expect(component.getStatusLabel('completed')).toBe('Completado');
      expect(component.getPriorityLabel('urgent')).toBe('Urgente');
      expect(component.getTypeLabel('work_order')).toBe('Orden de trabajo');
    });
  });
});
