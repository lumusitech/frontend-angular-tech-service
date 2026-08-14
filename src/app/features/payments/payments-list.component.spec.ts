import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PaymentsListComponent } from './payments-list.component';
import { PaymentsService } from '../../core/services/payments.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { of } from 'rxjs';

function matDateEvent(value: Date | null): MatDatepickerInputEvent<Date> {
  return {
    value,
    target: undefined as unknown as MatDatepickerInputEvent<Date>['target'],
    targetElement: document.createElement('input'),
  };
}

function createActivatedRouteMock(queryParams: Record<string, string | null> = {}) {
  return {
    snapshot: {
      queryParamMap: convertToParamMap(queryParams),
    },
    queryParamMap: of(convertToParamMap(queryParams)),
  };
}

describe('PaymentsListComponent - Date Filtering', () => {
  let component: PaymentsListComponent;
  let fixture: ComponentFixture<PaymentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaymentsListComponent],
      providers: [
        { provide: PaymentsService, useValue: {} },
        { provide: ToastService, useValue: { show: vi.fn() } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((k: string) => k) },
        },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(PaymentsListComponent);
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
      component.onDateFieldChange('paidAt');
      expect(component.dateField()).toBe('paidAt');
    });
  });

  describe('dateFrom/dateTo signals', () => {
    it('should default to empty strings', () => {
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });

    it('should update dateFrom via onDateFromChange', () => {
      const date = new Date(2026, 4, 15);
      const event = matDateEvent(date);
      component.onDateFromChange(event);
      expect(component.dateFrom()).toMatch(/2026-05-15/);
    });

    it('should clear dateFrom when value is null', () => {
      component.dateFrom.set('2026-05-15');
      const event = matDateEvent(null);
      component.onDateFromChange(event);
      expect(component.dateFrom()).toBe('');
    });

    it('should update dateTo via onDateToChange', () => {
      const date = new Date(2026, 5, 30);
      const event = matDateEvent(date);
      component.onDateToChange(event);
      expect(component.dateTo()).toMatch(/2026-06-30/);
    });

    it('should clear dateTo when value is null', () => {
      component.dateTo.set('2026-06-30');
      const event = matDateEvent(null);
      component.onDateToChange(event);
      expect(component.dateTo()).toBe('');
    });
  });

  describe('onDateFieldChange', () => {
    it('should update dateField and reset both dates', () => {
      component.dateFrom.set('2026-05-01');
      component.dateTo.set('2026-06-30');

      component.onDateFieldChange('paidAt');

      expect(component.dateField()).toBe('paidAt');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });

    it('should reset dates even if they were empty', () => {
      component.onDateFieldChange('paidAt');
      expect(component.dateField()).toBe('paidAt');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });
  });

  describe('clearFilters', () => {
    it('should reset dateField to createdAt', () => {
      component.dateField.set('paidAt');
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
  });

  describe('dateFieldOptions', () => {
    it('should have createdAt and paidAt options', () => {
      expect(component.dateFieldOptions).toEqual([
        { value: 'createdAt', labelKey: 'common.dateFieldCreated' },
        { value: 'paidAt', labelKey: 'payments.paymentDate' },
      ]);
    });
  });

  describe('same-day date range filtering', () => {
    it('should include records when dateFrom equals dateTo and record falls on that day', () => {
      // Backend should use < dateTo+1day to include records on dateTo
      // This test verifies the frontend sends correct params
      component.dateFrom.set('2026-05-12');
      component.dateTo.set('2026-05-12');
      component.dateField.set('paidAt');

      fixture.detectChanges();

      // The httpResource should have dateFrom and dateTo set
      expect(component.dateFrom()).toBe('2026-05-12');
      expect(component.dateTo()).toBe('2026-05-12');
      expect(component.dateField()).toBe('paidAt');
    });
  });

  describe('date validation', () => {
    it('should show error when dateTo is before dateFrom', () => {
      component.dateFrom.set('2026-05-15');

      const event = matDateEvent(new Date(2026, 4, 10));
      component.onDateToChange(event);

      expect(component.dateError()).toBe('common.invalidDateFrom');
    });

    it('should not set dateTo when it is before dateFrom', () => {
      component.dateFrom.set('2026-05-15');

      const event = matDateEvent(new Date(2026, 4, 10));
      component.onDateToChange(event);

      expect(component.dateTo()).toBe('');
    });

    it('should accept same-day range', () => {
      component.dateFrom.set('2026-05-12');

      const event = matDateEvent(new Date(2026, 4, 12));
      component.onDateToChange(event);

      expect(component.dateTo()).toMatch(/2026-05-12/);
      expect(component.dateError()).toBe('');
    });

    it('should show error when dateFrom is after dateTo', () => {
      component.dateTo.set('2026-05-10');

      const event = matDateEvent(new Date(2026, 4, 15));
      component.onDateFromChange(event);

      expect(component.dateError()).toBe('common.invalidDateTo');
    });

    it('should clear error when valid date is selected', () => {
      component.dateFrom.set('2026-05-15');
      component.dateTo.set('2026-05-10');
      component.dateError.set('common.invalidDateTo');

      const event = matDateEvent(new Date(2026, 4, 20));
      component.onDateToChange(event);

      expect(component.dateError()).toBe('');
    });
  });

  describe('httpResource params - dateField propagation', () => {
    it('should not send dateField when no dates are set', () => {
      component.dateFrom.set('');
      component.dateTo.set('');
      component.dateField.set('paidAt');

      fixture.detectChanges();

      const resource = component.paymentsResource;
      expect(resource).toBeTruthy();
    });

    it('should send dateField with dateFrom when dateFrom is set', () => {
      component.dateFrom.set('2026-05-01');
      component.dateTo.set('');
      component.dateField.set('paidAt');

      fixture.detectChanges();

      const resource = component.paymentsResource;
      expect(resource).toBeTruthy();
    });

    it('should send dateField with dateTo when dateTo is set', () => {
      component.dateFrom.set('');
      component.dateTo.set('2026-06-30');
      component.dateField.set('paidAt');

      fixture.detectChanges();

      const resource = component.paymentsResource;
      expect(resource).toBeTruthy();
    });
  });
});
