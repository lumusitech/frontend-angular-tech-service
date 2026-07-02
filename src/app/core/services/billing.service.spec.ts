import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  let service: BillingService;
  let httpMock: HttpTestingController;

  const mockInvoice = {
    id: 'inv-1',
    invoiceNumber: '0001-00000001',
    invoiceType: 'B' as const,
    pointOfSale: 1,
    concept: 'services' as const,
    status: 'draft' as const,
    clientName: 'Juan Perez',
    clientAddress: 'Calle 123',
    clientIvaCondition: 'consumidor_final' as const,
    subtotal: 1000,
    ivaAmount: 210,
    total: 1210,
    workOrderId: 'wo-1',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  };

  const mockPaginated = {
    data: [mockInvoice],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BillingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll()', () => {
    it('should GET /api/billing/invoices without params', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockPaginated);
    });

    it('should send status filter', () => {
      service.getAll({ status: 'issued' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.params.get('status')).toBe('issued');
      req.flush(mockPaginated);
    });

    it('should send invoiceType filter', () => {
      service.getAll({ invoiceType: 'A' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.params.get('invoiceType')).toBe('A');
      req.flush(mockPaginated);
    });

    it('should send date range filters', () => {
      service.getAll({ dateFrom: '2026-01-01', dateTo: '2026-06-30' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.params.get('dateFrom')).toBe('2026-01-01');
      expect(req.request.params.get('dateTo')).toBe('2026-06-30');
      req.flush(mockPaginated);
    });

    it('should send clientName filter', () => {
      service.getAll({ clientName: 'Juan' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.params.get('clientName')).toBe('Juan');
      req.flush(mockPaginated);
    });

    it('should send pagination params', () => {
      service.getAll({ page: 3, limit: 25 }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.params.get('page')).toBe('3');
      expect(req.request.params.get('limit')).toBe('25');
      req.flush(mockPaginated);
    });

    it('should send sorting params', () => {
      service.getAll({ sortBy: 'total', order: 'DESC' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.params.get('sortBy')).toBe('total');
      expect(req.request.params.get('order')).toBe('DESC');
      req.flush(mockPaginated);
    });

    it('should send all filters combined', () => {
      service.getAll({
        status: 'draft',
        invoiceType: 'B',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
        clientName: 'Perez',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        order: 'ASC',
      }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/billing/invoices');
      expect(req.request.params.keys().length).toBe(9);
      req.flush(mockPaginated);
    });
  });

  describe('getById()', () => {
    it('should GET /api/billing/invoices/:id', () => {
      service.getById('inv-1').subscribe((inv) => {
        expect(inv.invoiceNumber).toBe('0001-00000001');
      });

      const req = httpMock.expectOne('/api/billing/invoices/inv-1');
      expect(req.request.method).toBe('GET');
      req.flush(mockInvoice);
    });

    it('should propagate 404 error', () => {
      service.getById('nonexistent').subscribe({
        error: (err) => expect(err.status).toBe(404),
      });

      httpMock.expectOne('/api/billing/invoices/nonexistent').flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create()', () => {
    it('should POST /api/billing/invoices with body', () => {
      const dto = {
        invoiceType: 'B' as const,
        clientName: 'Juan',
        clientAddress: 'Calle 123',
        subtotal: 1000,
        total: 1210,
        workOrderId: 'wo-1',
      };

      service.create(dto).subscribe((inv) => {
        expect(inv).toEqual(mockInvoice);
      });

      const req = httpMock.expectOne('/api/billing/invoices');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockInvoice);
    });

    it('should handle optional fields', () => {
      const dto = {
        invoiceType: 'C' as const,
        clientName: 'Corp',
        clientAddress: 'Av 456',
        clientCuit: '20-12345678-9',
        clientIvaCondition: 'responsable_inscripto',
        concept: 'both',
        subtotal: 500,
        ivaAmount: 105,
        total: 605,
        workOrderId: 'wo-2',
        paymentId: 'pay-1',
      };

      service.create(dto).subscribe();

      const req = httpMock.expectOne('/api/billing/invoices');
      expect(req.request.body.clientCuit).toBe('20-12345678-9');
      expect(req.request.body.ivaAmount).toBe(105);
      expect(req.request.body.paymentId).toBe('pay-1');
      req.flush(mockInvoice);
    });
  });

  describe('issue()', () => {
    it('should POST /api/billing/invoices/:id/issue with empty body', () => {
      service.issue('inv-1').subscribe((inv) => {
        expect(inv.status).toBeDefined();
      });

      const req = httpMock.expectOne('/api/billing/invoices/inv-1/issue');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({ ...mockInvoice, status: 'issued', cae: '12345678901234' });
    });

    it('should propagate error if invoice already issued', () => {
      service.issue('inv-1').subscribe({
        error: (err) => expect(err.status).toBe(400),
      });

      httpMock
        .expectOne('/api/billing/invoices/inv-1/issue')
        .flush({ message: 'Invoice already issued' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('cancel()', () => {
    it('should POST /api/billing/invoices/:id/cancel with empty body', () => {
      service.cancel('inv-1').subscribe((inv) => {
        expect(inv.status).toBeDefined();
      });

      const req = httpMock.expectOne('/api/billing/invoices/inv-1/cancel');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({ ...mockInvoice, status: 'cancelled' });
    });

    it('should propagate error if invoice already cancelled', () => {
      service.cancel('inv-1').subscribe({
        error: (err) => expect(err.status).toBe(400),
      });

      httpMock
        .expectOne('/api/billing/invoices/inv-1/cancel')
        .flush({ message: 'Invoice already cancelled' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('downloadPdf()', () => {
    it('should GET /api/billing/invoices/:id/pdf with responseType blob', () => {
      const blob = new Blob(['pdf content'], { type: 'application/pdf' });

      service.downloadPdf('inv-1').subscribe((result) => {
        expect(result).toEqual(blob);
      });

      const req = httpMock.expectOne('/api/billing/invoices/inv-1/pdf');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(blob);
    });

    it('should propagate 404 for nonexistent invoice', () => {
      service.downloadPdf('nonexistent').subscribe({
        error: (err) => expect(err.status).toBe(404),
      });

      const errorBlob = new Blob([JSON.stringify({ message: 'Not Found' })], { type: 'application/json' });
      httpMock.expectOne('/api/billing/invoices/nonexistent/pdf').flush(errorBlob, {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });
});
