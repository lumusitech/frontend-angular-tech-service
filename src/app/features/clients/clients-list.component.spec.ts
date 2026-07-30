import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { ClientsListComponent } from './clients-list.component';
import { ClientsService } from '../../core/services/clients.service';
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

describe('ClientsListComponent', () => {
  let component: ClientsListComponent;
  let fixture: ComponentFixture<ClientsListComponent>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let deleteSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigateSpy = vi.fn();
    deleteSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [ClientsListComponent],
      providers: [
        { provide: ClientsService, useValue: { delete: deleteSpy } },
        { provide: Router, useValue: { navigate: navigateSpy } },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock() },
        { provide: ToastService, useValue: { show: vi.fn() } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(ClientsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have default filter values', () => {
      expect(component.currentPage()).toBe(1);
      expect(component.pageSize()).toBe(10);
      expect(component.sortBy()).toBe('createdAt');
      expect(component.sortOrder()).toBe('desc');
      expect(component.searchFilter()).toBe('');
      expect(component.isActiveFilter()).toBe('');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });

    it('should have highlightedId as null', () => {
      expect(component.highlightedId()).toBeNull();
    });

    it('should have correct displayed columns', () => {
      expect(component.displayedColumns).toEqual([
        'name', 'email', 'phone', 'address', 'isActive', 'createdAt', 'actions',
      ]);
    });
  });

  describe('viewDetail()', () => {
    it('should navigate to client detail', () => {
      const client = { id: 'c-1', name: 'Test' } as never;
      component.viewDetail(client);
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/clients', 'c-1']);
    });
  });

  describe('onPageChange()', () => {
    it('should update currentPage and pageSize', () => {
      const event = { pageIndex: 2, pageSize: 25 } as PageEvent;
      component.onPageChange(event);
      expect(component.currentPage()).toBe(3);
      expect(component.pageSize()).toBe(25);
    });

    it('should reset to page 1 when changing page size', () => {
      component.currentPage.set(5);
      const event = { pageIndex: 0, pageSize: 50 } as PageEvent;
      component.onPageChange(event);
      expect(component.currentPage()).toBe(1);
      expect(component.pageSize()).toBe(50);
    });
  });

  describe('onSortChange()', () => {
    it('should update sort parameters', () => {
      const sort = { active: 'name', direction: 'asc' } as Sort;
      component.onSortChange(sort);
      expect(component.sortBy()).toBe('name');
      expect(component.sortOrder()).toBe('asc');
    });

    it('should default to asc when direction is empty', () => {
      const sort = { active: 'name', direction: '' } as Sort;
      component.onSortChange(sort);
      expect(component.sortOrder()).toBe('asc');
    });

    it('should handle desc direction', () => {
      const sort = { active: 'email', direction: 'desc' } as Sort;
      component.onSortChange(sort);
      expect(component.sortBy()).toBe('email');
      expect(component.sortOrder()).toBe('desc');
    });
  });

  describe('hasActiveFilters', () => {
    it('should be false when no filters are set', () => {
      expect(component.hasActiveFilters()).toBe(false);
    });

    it('should be true when searchFilter is set', () => {
      component.searchFilter.set('test');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when isActiveFilter is set', () => {
      component.isActiveFilter.set('true');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when dateFrom is set', () => {
      component.dateFrom.set('2026-01-01');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when dateTo is set', () => {
      component.dateTo.set('2026-12-31');
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should be true when multiple filters are set', () => {
      component.searchFilter.set('test');
      component.isActiveFilter.set('true');
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('clearFilters()', () => {
    it('should reset all filters to empty', () => {
      component.searchFilter.set('test');
      component.isActiveFilter.set('true');
      component.dateFrom.set('2026-01-01');
      component.dateTo.set('2026-12-31');

      component.clearFilters();

      expect(component.searchFilter()).toBe('');
      expect(component.isActiveFilter()).toBe('');
      expect(component.dateFrom()).toBe('');
      expect(component.dateTo()).toBe('');
    });
  });

  describe('getClientFields()', () => {
    it('should return correct field array', () => {
      const client = {
        id: 'c-1',
        email: 'test@example.com',
        phone: '123456',
        address: 'Calle 123',
        createdAt: '2026-01-15T10:00:00.000Z',
      } as never;

      const fields = component.getClientFields(client);

      expect(fields).toHaveLength(4);
      expect(fields[0].value).toBe('test@example.com');
      expect(fields[0].type).toBe('email');
      expect(fields[1].value).toBe('123456');
      expect(fields[1].type).toBe('phone');
      expect(fields[2].value).toBe('Calle 123');
      expect(fields[3].value).toBe('2026-01-15T10:00:00.000Z');
      expect(fields[3].type).toBe('date');
    });

    it('should handle missing phone', () => {
      const client = {
        id: 'c-1', email: 'test@example.com', phone: '', address: 'Addr', createdAt: '2026-01-15T10:00:00.000Z',
      } as never;
      const fields = component.getClientFields(client);
      expect(fields[1].value).toBe('-');
    });

    it('should handle missing address', () => {
      const client = {
        id: 'c-1', email: 'test@example.com', phone: '123', address: '', createdAt: '2026-01-15T10:00:00.000Z',
      } as never;
      const fields = component.getClientFields(client);
      expect(fields[2].value).toBe('-');
    });
  });

  describe('onEditSwipe()', () => {
    it('should return a function', () => {
      const client = { id: 'c-1', name: 'Test' } as never;
      const swipeFn = component.onEditSwipe(client);
      expect(typeof swipeFn).toBe('function');
    });
  });

  describe('onDeleteSwipe()', () => {
    it('should return a function', () => {
      const client = { id: 'c-1', name: 'Test' } as never;
      const swipeFn = component.onDeleteSwipe(client);
      expect(typeof swipeFn).toBe('function');
    });
  });

  describe('ngOnInit - route query params', () => {
    it('should set highlight and search from query params', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ClientsListComponent],
        providers: [
          { provide: ClientsService, useValue: { delete: deleteSpy } },
          { provide: Router, useValue: { navigate: navigateSpy } },
          { provide: ActivatedRoute, useValue: createActivatedRouteMock({ highlight: 'c-1', search: 'test' }) },
          { provide: ToastService, useValue: { show: vi.fn() } },
          { provide: TranslationService, useValue: { instant: vi.fn().mockImplementation((key: string) => key) } },
        ],
      });

      const freshFixture = TestBed.createComponent(ClientsListComponent);
      const freshComponent = freshFixture.componentInstance;
      freshFixture.detectChanges();

      expect(freshComponent.highlightedId()).toBe('c-1');
      expect(freshComponent.searchFilter()).toBe('test');
    });
  });
});
