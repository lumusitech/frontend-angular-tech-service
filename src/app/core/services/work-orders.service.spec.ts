import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WorkOrdersService } from './work-orders.service';

describe('WorkOrdersService', () => {
  let service: WorkOrdersService;
  let httpMock: HttpTestingController;

  const mockWorkOrder = {
    id: 'wo-1',
    trackingCode: 'TS-00001',
    status: 'pending' as const,
    priority: 'high' as const,
    location: 'on_site' as const,
    client: { id: 'c-1', name: 'Client', email: 'c@x.com', phone: '123' },
    serviceType: { id: 'st-1', name: 'Installation' },
    technicians: [],
    tasks: [],
    materials: [],
    notes: [],
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  };

  const mockPaginated = {
    data: [mockWorkOrder],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WorkOrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll()', () => {
    it('should GET /api/work-orders without params', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockPaginated);
    });

    it('should send search param', () => {
      service.getAll({ search: 'TS-00' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.get('search')).toBe('TS-00');
      req.flush(mockPaginated);
    });

    it('should send status param', () => {
      service.getAll({ status: 'in_progress' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.get('status')).toBe('in_progress');
      req.flush(mockPaginated);
    });

    it('should send priority param', () => {
      service.getAll({ priority: 'urgent' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.get('priority')).toBe('urgent');
      req.flush(mockPaginated);
    });

    it('should send technicianId param', () => {
      service.getAll({ technicianId: 'tech-1' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.get('technicianId')).toBe('tech-1');
      req.flush(mockPaginated);
    });

    it('should send sellerId param', () => {
      service.getAll({ sellerId: 'seller-1' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.get('sellerId')).toBe('seller-1');
      req.flush(mockPaginated);
    });

    it('should send clientId param', () => {
      service.getAll({ clientId: 'c-1' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.get('clientId')).toBe('c-1');
      req.flush(mockPaginated);
    });

    it('should send all filters combined', () => {
      service
        .getAll({
          search: 'x',
          status: 'pending',
          priority: 'high',
          technicianId: 't-1',
          sellerId: 's-1',
          clientId: 'c-1',
          page: 2,
          limit: 5,
        })
        .subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.get('search')).toBe('x');
      expect(req.request.params.get('status')).toBe('pending');
      expect(req.request.params.get('priority')).toBe('high');
      expect(req.request.params.get('technicianId')).toBe('t-1');
      expect(req.request.params.get('sellerId')).toBe('s-1');
      expect(req.request.params.get('clientId')).toBe('c-1');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('limit')).toBe('5');
      req.flush(mockPaginated);
    });

    it('should not send undefined filter params', () => {
      service.getAll({ status: 'completed' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      expect(req.request.params.has('search')).toBe(false);
      expect(req.request.params.has('priority')).toBe(false);
      expect(req.request.params.has('technicianId')).toBe(false);
      req.flush(mockPaginated);
    });
  });

  describe('getById()', () => {
    it('should GET /api/work-orders/:id', () => {
      service.getById('wo-1').subscribe((wo) => {
        expect(wo.trackingCode).toBe('TS-00001');
      });

      const req = httpMock.expectOne('/api/work-orders/wo-1');
      expect(req.request.method).toBe('GET');
      req.flush(mockWorkOrder);
    });

    it('should propagate 404 error', () => {
      service.getById('nonexistent').subscribe({
        error: (err) => expect(err.status).toBe(404),
      });

      httpMock
        .expectOne('/api/work-orders/nonexistent')
        .flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create()', () => {
    it('should POST /api/work-orders with body', () => {
      const dto = { clientId: 'c-1', serviceTypeId: 'st-1', priority: 'high' as const };

      service.create(dto).subscribe((wo) => {
        expect(wo).toEqual(mockWorkOrder);
      });

      const req = httpMock.expectOne('/api/work-orders');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockWorkOrder);
    });

    it('should propagate validation errors', () => {
      service.create({ clientId: '', serviceTypeId: '' }).subscribe({
        error: (err) => expect(err.status).toBe(400),
      });

      httpMock
        .expectOne('/api/work-orders')
        .flush({ message: 'Validation failed' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update()', () => {
    it('should PATCH /api/work-orders/:id', () => {
      service.update('wo-1', { status: 'in_progress' }).subscribe((wo) => {
        expect(wo.status).toBe('in_progress');
      });

      const req = httpMock.expectOne('/api/work-orders/wo-1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ status: 'in_progress' });
      req.flush({ ...mockWorkOrder, status: 'in_progress' });
    });

    it('should propagate 404 error', () => {
      service.update('nonexistent', { status: 'completed' }).subscribe({
        error: (err) => expect(err.status).toBe(404),
      });

      httpMock
        .expectOne('/api/work-orders/nonexistent')
        .flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addNote()', () => {
    it('should POST /api/work-orders/:id/notes', () => {
      const dto = { type: 'diagnosis' as const, content: 'Broken screen' };

      service.addNote('wo-1', dto).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/notes');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(null);
    });

    it('should handle all note types', () => {
      const types = ['diagnosis', 'issue', 'observation', 'internal'] as const;

      for (const type of types) {
        service.addNote('wo-1', { type, content: `Note ${type}` }).subscribe();

        const req = httpMock.expectOne('/api/work-orders/wo-1/notes');
        expect(req.request.body.type).toBe(type);
        req.flush(null);
      }
    });
  });

  describe('addMaterial()', () => {
    it('should POST /api/work-orders/:id/materials', () => {
      const dto = { description: 'Cable', quantity: 5, unitCost: 10 };

      service.addMaterial('wo-1', dto).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/materials');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(null);
    });

    it('should handle optional supplierId', () => {
      service.addMaterial('wo-1', { description: 'Cable', quantity: 1, unitCost: 5 }).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/materials');
      expect(req.request.body.supplierId).toBeUndefined();
      req.flush(null);
    });

    it('should include supplierId when provided', () => {
      service
        .addMaterial('wo-1', {
          description: 'Cable',
          quantity: 1,
          unitCost: 5,
          supplierId: 'sup-1',
        })
        .subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/materials');
      expect(req.request.body.supplierId).toBe('sup-1');
      req.flush(null);
    });
  });

  describe('addTask()', () => {
    it('should POST /api/work-orders/:id/tasks', () => {
      const dto = { title: 'Check wiring' };

      service.addTask('wo-1', dto).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(null);
    });

    it('should handle optional fields', () => {
      service
        .addTask('wo-1', { title: 'Task', description: 'Desc', assignedToId: 'tech-1' })
        .subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/tasks');
      expect(req.request.body).toEqual({
        title: 'Task',
        description: 'Desc',
        assignedToId: 'tech-1',
      });
      req.flush(null);
    });

    it('should omit undefined optional fields', () => {
      service.addTask('wo-1', { title: 'Task' }).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/tasks');
      expect(req.request.body.description).toBeUndefined();
      expect(req.request.body.assignedToId).toBeUndefined();
      req.flush(null);
    });
  });

  describe('updateTask()', () => {
    it('should PATCH /api/work-orders/:id/tasks/:taskId', () => {
      service.updateTask('wo-1', 'task-1', { isCompleted: true }).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/tasks/task-1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ isCompleted: true });
      req.flush(null);
    });

    it('should send completedAt when provided', () => {
      const now = new Date().toISOString();
      service.updateTask('wo-1', 'task-1', { isCompleted: true, completedAt: now }).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/tasks/task-1');
      expect(req.request.body).toEqual({ isCompleted: true, completedAt: now });
      req.flush(null);
    });
  });

  describe('replaceTechnicians()', () => {
    it('should PUT /api/work-orders/:id/technicians', () => {
      service.replaceTechnicians('wo-1', ['tech-1', 'tech-2']).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/technicians');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ technicianIds: ['tech-1', 'tech-2'] });
      req.flush(null);
    });

    it('should handle empty technician array', () => {
      service.replaceTechnicians('wo-1', []).subscribe();

      const req = httpMock.expectOne('/api/work-orders/wo-1/technicians');
      expect(req.request.body).toEqual({ technicianIds: [] });
      req.flush(null);
    });
  });
});
