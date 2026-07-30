import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrdersListComponent } from './work-orders-list.component';
import { WorkOrdersService } from '../../core/services/work-orders.service';
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

describe('WorkOrdersListComponent - Date Filtering', () => {
  let component: WorkOrdersListComponent;
  let fixture: ComponentFixture<WorkOrdersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkOrdersListComponent],
      providers: [
        { provide: WorkOrdersService, useValue: {} },
        { provide: TranslationService, useValue: { instant: vi.fn().mockImplementation((k: string) => k) } },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
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
});
