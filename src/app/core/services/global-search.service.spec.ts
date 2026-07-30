import { TestBed } from '@angular/core/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { GlobalSearchService } from './global-search.service';
import { UsersService } from './users.service';
import { ClientsService } from './clients.service';
import { WorkOrdersService } from './work-orders.service';
import { SuppliersService } from './suppliers.service';
import { ServiceTypesService } from './service-types.service';
import { SkillsService } from './skills.service';
import { InquiriesService } from './inquiries.service';
import { ExpensesService } from './expenses.service';
import { PendingItemsService } from './pending-items.service';
import { NotificationsService } from './notifications.service';

interface Mocks {
  usersGetAll: ReturnType<typeof vi.fn>;
  clientsGetAll: ReturnType<typeof vi.fn>;
  workOrdersGetAll: ReturnType<typeof vi.fn>;
  suppliersGetAll: ReturnType<typeof vi.fn>;
  serviceTypesGetAll: ReturnType<typeof vi.fn>;
  skillsGetAll: ReturnType<typeof vi.fn>;
  inquiriesGetAll: ReturnType<typeof vi.fn>;
  expensesGetAll: ReturnType<typeof vi.fn>;
  pendingItemsGetAll: ReturnType<typeof vi.fn>;
  notificationsGetAll: ReturnType<typeof vi.fn>;
}

function paginatedResponse<T>(data: T[]) {
  return of({ data, total: data.length, page: 1, limit: 3, totalPages: 1 });
}

describe('GlobalSearchService', () => {
  let service: GlobalSearchService;
  const mocks: Mocks = {} as Mocks;

  beforeEach(() => {
    mocks.usersGetAll = vi.fn();
    mocks.clientsGetAll = vi.fn();
    mocks.workOrdersGetAll = vi.fn();
    mocks.suppliersGetAll = vi.fn();
    mocks.serviceTypesGetAll = vi.fn();
    mocks.skillsGetAll = vi.fn();
    mocks.inquiriesGetAll = vi.fn();
    mocks.expensesGetAll = vi.fn();
    mocks.pendingItemsGetAll = vi.fn();
    mocks.notificationsGetAll = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        GlobalSearchService,
        { provide: UsersService, useValue: { getAll: mocks.usersGetAll } },
        { provide: ClientsService, useValue: { getAll: mocks.clientsGetAll } },
        { provide: WorkOrdersService, useValue: { getAll: mocks.workOrdersGetAll } },
        { provide: SuppliersService, useValue: { getAll: mocks.suppliersGetAll } },
        { provide: ServiceTypesService, useValue: { getAll: mocks.serviceTypesGetAll } },
        { provide: SkillsService, useValue: { getAll: mocks.skillsGetAll } },
        { provide: InquiriesService, useValue: { getAll: mocks.inquiriesGetAll } },
        { provide: ExpensesService, useValue: { getAll: mocks.expensesGetAll } },
        { provide: PendingItemsService, useValue: { getAll: mocks.pendingItemsGetAll } },
        { provide: NotificationsService, useValue: { getAll: mocks.notificationsGetAll } },
      ],
    });

    service = TestBed.inject(GlobalSearchService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('search()', () => {
    it('should not search with empty query', () => {
      service.search('');
      expect(service.results()).toEqual([]);
      expect(service.loading()).toBe(false);
    });

    it('should not search with query shorter than 2 chars', () => {
      service.search('a');
      expect(service.results()).toEqual([]);
      expect(service.loading()).toBe(false);
    });

    it('should set loading to true during search', () => {
      mocks.usersGetAll.mockReturnValue(EMPTY);
      mocks.clientsGetAll.mockReturnValue(EMPTY);
      mocks.workOrdersGetAll.mockReturnValue(EMPTY);
      mocks.suppliersGetAll.mockReturnValue(EMPTY);
      mocks.serviceTypesGetAll.mockReturnValue(EMPTY);
      mocks.skillsGetAll.mockReturnValue(EMPTY);
      mocks.inquiriesGetAll.mockReturnValue(EMPTY);
      mocks.expensesGetAll.mockReturnValue(EMPTY);
      mocks.pendingItemsGetAll.mockReturnValue(EMPTY);
      mocks.notificationsGetAll.mockReturnValue(EMPTY);

      service.search('juan');
      expect(service.loading()).toBe(true);
    });

    it('should map a client result correctly', () => {
      const mockClient = { id: 'c1', name: 'Juan Pérez', email: 'juan@test.com', phone: null };
      mocks.usersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.clientsGetAll.mockReturnValue(paginatedResponse([mockClient]));
      mocks.workOrdersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.suppliersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.serviceTypesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.skillsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.inquiriesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.expensesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.pendingItemsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.notificationsGetAll.mockReturnValue(paginatedResponse([]));

      service.search('juan');

      const results = service.results();
      expect(results.length).toBe(1);
      expect(results[0].type).toBe('client');
      expect(results[0].id).toBe('c1');
      expect(results[0].title).toBe('Juan Pérez');
      expect(results[0].subtitle).toBe('juan@test.com');
      expect(results[0].icon).toBe('person');
      expect(results[0].route).toBe('/admin/clients/c1');
    });

    it('should map a work-order result correctly', () => {
      const mockWO = {
        id: 'wo1',
        trackingCode: 'TS-ABC12',
        client: { name: 'Juan' },
        serviceType: { name: 'Reparación' },
      };
      mocks.usersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.clientsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.workOrdersGetAll.mockReturnValue(paginatedResponse([mockWO]));
      mocks.suppliersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.serviceTypesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.skillsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.inquiriesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.expensesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.pendingItemsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.notificationsGetAll.mockReturnValue(paginatedResponse([]));

      service.search('TS');

      const results = service.results();
      expect(results.length).toBe(1);
      expect(results[0].type).toBe('work-order');
      expect(results[0].title).toBe('TS-ABC12');
      expect(results[0].subtitle).toContain('Juan');
      expect(results[0].subtitle).toContain('Reparación');
      expect(results[0].route).toBe('/admin/work-orders/wo1');
    });

    it('should map a supplier result correctly', () => {
      const mockSupplier = { id: 's1', name: 'Proveedor SA', contact: 'Miguel', email: null };
      mocks.usersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.clientsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.workOrdersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.suppliersGetAll.mockReturnValue(paginatedResponse([mockSupplier]));
      mocks.serviceTypesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.skillsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.inquiriesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.expensesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.pendingItemsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.notificationsGetAll.mockReturnValue(paginatedResponse([]));

      service.search('proveedor');

      const results = service.results();
      expect(results[0].type).toBe('supplier');
      expect(results[0].title).toBe('Proveedor SA');
      expect(results[0].subtitle).toBe('Miguel');
      expect(results[0].route).toBe('/admin/suppliers');
    });

    it('should map an expense result with formatted amount', () => {
      const mockExpense = { id: 'e1', description: 'Compra de herramientas', amount: 150.5 };
      mocks.usersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.clientsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.workOrdersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.suppliersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.serviceTypesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.skillsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.inquiriesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.expensesGetAll.mockReturnValue(paginatedResponse([mockExpense]));
      mocks.pendingItemsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.notificationsGetAll.mockReturnValue(paginatedResponse([]));

      service.search('herramientas');

      const results = service.results();
      expect(results[0].type).toBe('expense');
      expect(results[0].title).toBe('Compra de herramientas');
      expect(results[0].subtitle).toBe('$150.50');
    });

    it('should handle error on one entity without breaking others', () => {
      const mockClient = { id: 'c1', name: 'Juan', email: null, phone: null };
      mocks.usersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.clientsGetAll.mockReturnValue(paginatedResponse([mockClient]));
      mocks.workOrdersGetAll.mockReturnValue(throwError(() => new Error('Server error')));
      mocks.suppliersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.serviceTypesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.skillsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.inquiriesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.expensesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.pendingItemsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.notificationsGetAll.mockReturnValue(paginatedResponse([]));

      service.search('juan');

      const results = service.results();
      expect(results.length).toBe(1);
      expect(results[0].type).toBe('client');
      expect(service.loading()).toBe(false);
    });

    it('should handle all entities erroring', () => {
      mocks.usersGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.clientsGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.workOrdersGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.suppliersGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.serviceTypesGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.skillsGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.inquiriesGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.expensesGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.pendingItemsGetAll.mockReturnValue(throwError(() => new Error('fail')));
      mocks.notificationsGetAll.mockReturnValue(throwError(() => new Error('fail')));

      service.search('xyz');

      expect(service.results()).toEqual([]);
      expect(service.loading()).toBe(false);
    });
  });

  describe('clear()', () => {
    it('should clear results and loading', () => {
      const mockClient = { id: 'c1', name: 'A', email: null, phone: null };
      mocks.usersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.clientsGetAll.mockReturnValue(paginatedResponse([mockClient]));
      mocks.workOrdersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.suppliersGetAll.mockReturnValue(paginatedResponse([]));
      mocks.serviceTypesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.skillsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.inquiriesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.expensesGetAll.mockReturnValue(paginatedResponse([]));
      mocks.pendingItemsGetAll.mockReturnValue(paginatedResponse([]));
      mocks.notificationsGetAll.mockReturnValue(paginatedResponse([]));

      service.search('ab');
      expect(service.results().length).toBe(1);

      service.clear();
      expect(service.results()).toEqual([]);
      expect(service.loading()).toBe(false);
    });
  });
});
