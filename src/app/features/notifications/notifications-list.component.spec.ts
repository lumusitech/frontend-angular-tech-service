import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsListComponent } from './notifications-list.component';
import { NotificationsService } from '../../core/services/notifications.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { of } from 'rxjs';

describe('NotificationsListComponent', () => {
  let component: NotificationsListComponent;
  let fixture: ComponentFixture<NotificationsListComponent>;
  let bulkMarkAsReadSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let unreadCount: { update: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    bulkMarkAsReadSpy = vi.fn();
    toastSpy = vi.fn();
    unreadCount = { update: vi.fn(), set: vi.fn() };
    TestBed.configureTestingModule({
      imports: [NotificationsListComponent],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            markAsRead: vi.fn(),
            markAllAsRead: vi.fn(),
            bulkMarkAsRead: bulkMarkAsReadSpy,
            unreadCount,
            refreshCounter: vi.fn(),
          },
        },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(NotificationsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('bulk selection', () => {
    it('should toggle selection', () => {
      component.toggleSelection('n-1', true);
      expect(component.isSelected('n-1')).toBe(true);
      component.toggleSelection('n-1', false);
      expect(component.isSelected('n-1')).toBe(false);
    });

    it('should clear selection', () => {
      component.toggleSelection('n-1', true);
      component.toggleSelection('n-2', true);
      component.clearSelection();
      expect(component.selectedIds().size).toBe(0);
    });

    it('should select all visible page data', () => {
      const pageData = [{ id: 'n-1' }, { id: 'n-2' }] as never;
      vi.spyOn(component, 'currentPageData').mockReturnValue(pageData as never);

      component.onSelectAllPage(true);

      expect(component.selectedIds().size).toBe(2);
      expect(component.isSelected('n-1')).toBe(true);
      expect(component.isSelected('n-2')).toBe(true);

      component.onSelectAllPage(false);
      expect(component.selectedIds().size).toBe(0);
    });
  });

  describe('bulkMarkAsRead()', () => {
    it('should do nothing when nothing is selected', () => {
      component.bulkMarkAsRead();
      expect(bulkMarkAsReadSpy).not.toHaveBeenCalled();
    });

    it('should call bulkMarkAsRead and show success toast', () => {
      component.toggleSelection('n-1', true);
      component.toggleSelection('n-2', true);
      bulkMarkAsReadSpy.mockReturnValue(of({ succeeded: ['n-1', 'n-2'], failed: [] }));

      component.bulkMarkAsRead();

      expect(bulkMarkAsReadSpy).toHaveBeenCalledWith(['n-1', 'n-2']);
      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.markedRead', 'success');
      expect(unreadCount.update).toHaveBeenCalled();
    });

    it('should show partial toast when some fail', () => {
      component.toggleSelection('n-1', true);
      bulkMarkAsReadSpy.mockReturnValue(
        of({ succeeded: [], failed: [{ id: 'n-1', reason: 'x' }] }),
      );

      component.bulkMarkAsRead();

      expect(toastSpy).toHaveBeenCalledWith('bulk.toast.partial', 'info');
    });
  });

  describe('helpers', () => {
    it('should return icon and color helpers', () => {
      expect(component.getTypeIcon('work_order.created')).toBe('assignment');
      expect(component.getTypeIcon('unknown')).toBe('notifications');
      expect(component.getTypeColor('unknown')).toContain('gray');
    });
  });
});
