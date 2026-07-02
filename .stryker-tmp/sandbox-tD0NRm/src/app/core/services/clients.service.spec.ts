// @ts-nocheck
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClientsService } from './clients.service';
import { Client, ClientFilters } from '../models/client.interfaces';

describe('ClientsService', () => {
  let service: ClientsService;
  let httpMock: HttpTestingController;

  const mockClient: Client = {
    id: 'c-1',
    name: 'Juan Perez',
    email: 'juan@example.com',
    phone: '1234567890',
    address: 'Calle 123',
    isActive: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  };

  const mockPaginatedResponse = {
    data: [mockClient],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClientsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll()', () => {
    it('should GET /api/clients without params when no filters', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockPaginatedResponse);
    });

    it('should send search param', () => {
      service.getAll({ search: 'juan' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.params.get('search')).toBe('juan');
      req.flush(mockPaginatedResponse);
    });

    it('should send isActive param as string', () => {
      service.getAll({ isActive: true }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.params.get('isActive')).toBe('true');
      req.flush(mockPaginatedResponse);
    });

    it('should send isActive=false as string', () => {
      service.getAll({ isActive: false }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.params.get('isActive')).toBe('false');
      req.flush(mockPaginatedResponse);
    });

    it('should send page and limit params', () => {
      service.getAll({ page: 2, limit: 20 }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('limit')).toBe('20');
      req.flush(mockPaginatedResponse);
    });

    it('should send all filters combined', () => {
      service.getAll({ search: 'test', isActive: true, page: 1, limit: 5 }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.params.get('search')).toBe('test');
      expect(req.request.params.get('isActive')).toBe('true');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('5');
      req.flush(mockPaginatedResponse);
    });

    it('should not send undefined filter params', () => {
      service.getAll({ search: 'test' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.params.has('isActive')).toBe(false);
      expect(req.request.params.has('page')).toBe(false);
      expect(req.request.params.has('limit')).toBe(false);
      req.flush(mockPaginatedResponse);
    });

    it('should handle empty filters object', () => {
      service.getAll({}).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/clients');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getById()', () => {
    it('should GET /api/clients/:id', () => {
      service.getById('c-1').subscribe((client) => {
        expect(client).toEqual(mockClient);
      });

      const req = httpMock.expectOne('/api/clients/c-1');
      expect(req.request.method).toBe('GET');
      req.flush(mockClient);
    });

    it('should handle empty id', () => {
      service.getById('').subscribe();

      const req = httpMock.expectOne('/api/clients/');
      expect(req.request.method).toBe('GET');
      req.flush(mockClient);
    });

    it('should propagate 404 error', () => {
      service.getById('nonexistent').subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
        },
      });

      httpMock.expectOne('/api/clients/nonexistent').flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create()', () => {
    it('should POST /api/clients with body', () => {
      const dto = { name: 'New Client', email: 'new@example.com', phone: '000', address: 'Addr' };

      service.create(dto).subscribe((client) => {
        expect(client).toEqual(mockClient);
      });

      const req = httpMock.expectOne('/api/clients');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockClient);
    });

    it('should propagate validation errors', () => {
      service.create({ name: '', email: 'bad', phone: '', address: '' }).subscribe({
        error: (err) => {
          expect(err.status).toBe(400);
        },
      });

      httpMock
        .expectOne('/api/clients')
        .flush({ message: ['name is required'] }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update()', () => {
    it('should PATCH /api/clients/:id with body', () => {
      const dto = { name: 'Updated Name' };

      service.update('c-1', dto).subscribe((client) => {
        expect(client.name).toBe('Updated Name');
      });

      const req = httpMock.expectOne('/api/clients/c-1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush({ ...mockClient, name: 'Updated Name' });
    });

    it('should propagate 404 error on nonexistent client', () => {
      service.update('nonexistent', { name: 'x' }).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
        },
      });

      httpMock.expectOne('/api/clients/nonexistent').flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete()', () => {
    it('should DELETE /api/clients/:id', () => {
      service.delete('c-1').subscribe((result) => {
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne('/api/clients/c-1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should propagate 404 error on nonexistent client', () => {
      service.delete('nonexistent').subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
        },
      });

      httpMock.expectOne('/api/clients/nonexistent').flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should propagate 403 error on forbidden delete', () => {
      service.delete('c-1').subscribe({
        error: (err) => {
          expect(err.status).toBe(403);
        },
      });

      httpMock
        .expectOne('/api/clients/c-1')
        .flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });
});
