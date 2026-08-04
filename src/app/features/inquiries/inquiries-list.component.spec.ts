import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InquiriesListComponent],
      providers: [
        { provide: InquiriesService, useValue: { delete: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn(), events: of() } },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: vi.fn() } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
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
});
