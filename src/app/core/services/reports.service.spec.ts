import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReportsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getSummary()', () => {
    it('should GET /api/reports/summary without params', () => {
      const mockSummary = { kpis: { activeOrders: 5 } };

      service.getSummary().subscribe((result) => {
        expect(result).toEqual(mockSummary);
      });

      const req = httpMock.expectOne('/api/reports/summary');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockSummary);
    });
  });

  describe('getIncome()', () => {
    it('should GET /api/reports/income without params', () => {
      const mockIncome = { totalIncome: 50000 };

      service.getIncome().subscribe((result) => {
        expect(result).toEqual(mockIncome);
      });

      const req = httpMock.expectOne('/api/reports/income');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockIncome);
    });

    it('should send period param', () => {
      service.getIncome({ period: 'monthly' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/income');
      expect(req.request.params.get('period')).toBe('monthly');
      req.flush({ totalIncome: 0 });
    });

    it('should send dateFrom and dateTo params', () => {
      service.getIncome({ dateFrom: '2026-01-01', dateTo: '2026-06-30' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/income');
      expect(req.request.params.get('dateFrom')).toBe('2026-01-01');
      expect(req.request.params.get('dateTo')).toBe('2026-06-30');
      req.flush({ totalIncome: 0 });
    });

    it('should not send undefined params', () => {
      service.getIncome({ period: 'daily' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/income');
      expect(req.request.params.has('dateFrom')).toBe(false);
      expect(req.request.params.has('dateTo')).toBe(false);
      expect(req.request.params.has('category')).toBe(false);
      req.flush({ totalIncome: 0 });
    });

    it('should handle empty object', () => {
      service.getIncome({}).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/income');
      expect(req.request.params.keys().length).toBe(0);
      req.flush({ totalIncome: 0 });
    });
  });

  describe('getExpenses()', () => {
    it('should GET /api/reports/expenses without params', () => {
      service.getExpenses().subscribe();

      const req = httpMock.expectOne('/api/reports/expenses');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush({ totalExpenses: 0 });
    });

    it('should send period param', () => {
      service.getExpenses({ period: 'weekly' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/expenses');
      expect(req.request.params.get('period')).toBe('weekly');
      req.flush({ totalExpenses: 0 });
    });

    it('should send category param (only expenses method uses this)', () => {
      service.getExpenses({ category: 'tools' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/expenses');
      expect(req.request.params.get('category')).toBe('tools');
      req.flush({ totalExpenses: 0 });
    });

    it('should send all expense-specific filters', () => {
      service.getExpenses({ period: 'yearly', dateFrom: '2026-01-01', dateTo: '2026-12-31', category: 'supplies' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/expenses');
      expect(req.request.params.get('period')).toBe('yearly');
      expect(req.request.params.get('dateFrom')).toBe('2026-01-01');
      expect(req.request.params.get('dateTo')).toBe('2026-12-31');
      expect(req.request.params.get('category')).toBe('supplies');
      req.flush({ totalExpenses: 0 });
    });
  });

  describe('getProfit()', () => {
    it('should GET /api/reports/profit without params', () => {
      service.getProfit().subscribe();

      const req = httpMock.expectOne('/api/reports/profit');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush({ netProfit: 0 });
    });

    it('should send period filter', () => {
      service.getProfit({ period: 'daily' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/profit');
      expect(req.request.params.get('period')).toBe('daily');
      req.flush({ netProfit: 0 });
    });
  });

  describe('getServices()', () => {
    it('should GET /api/reports/services without params', () => {
      service.getServices().subscribe();

      const req = httpMock.expectOne('/api/reports/services');
      expect(req.request.method).toBe('GET');
      req.flush({ services: [] });
    });

    it('should send period filter', () => {
      service.getServices({ period: 'monthly' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/services');
      expect(req.request.params.get('period')).toBe('monthly');
      req.flush({ services: [] });
    });
  });

  describe('getTechnicians()', () => {
    it('should GET /api/reports/technicians', () => {
      service.getTechnicians().subscribe();

      const req = httpMock.expectOne('/api/reports/technicians');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush([]);
    });
  });

  describe('getTechnicianDetail()', () => {
    it('should GET /api/reports/technicians/:id', () => {
      const mockDetail = { technician: { id: 't-1', name: 'Tech' } };

      service.getTechnicianDetail('t-1').subscribe((result) => {
        expect(result).toEqual(mockDetail);
      });

      const req = httpMock.expectOne('/api/reports/technicians/t-1');
      expect(req.request.method).toBe('GET');
      req.flush(mockDetail);
    });

    it('should propagate 404 for nonexistent technician', () => {
      service.getTechnicianDetail('nonexistent').subscribe({
        error: (err) => expect(err.status).toBe(404),
      });

      httpMock.expectOne('/api/reports/technicians/nonexistent').flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getClientReport()', () => {
    it('should GET /api/reports/clients/:id', () => {
      const mockReport = { client: { id: 'c-1', name: 'Client' } };

      service.getClientReport('c-1').subscribe((result) => {
        expect(result).toEqual(mockReport);
      });

      const req = httpMock.expectOne('/api/reports/clients/c-1');
      expect(req.request.method).toBe('GET');
      req.flush(mockReport);
    });

    it('should propagate 404 for nonexistent client', () => {
      service.getClientReport('nonexistent').subscribe({
        error: (err) => expect(err.status).toBe(404),
      });

      httpMock.expectOne('/api/reports/clients/nonexistent').flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('downloadBudgetPdf()', () => {
    it('should GET /api/reports/work-orders/:id/budget with responseType blob', () => {
      const blob = new Blob(['pdf'], { type: 'application/pdf' });

      service.downloadBudgetPdf('wo-1').subscribe((result) => {
        expect(result).toEqual(blob);
      });

      const req = httpMock.expectOne('/api/reports/work-orders/wo-1/budget');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(blob);
    });
  });

  describe('downloadReceiptPdf()', () => {
    it('should GET /api/reports/payments/:id/receipt with responseType blob', () => {
      const blob = new Blob(['pdf'], { type: 'application/pdf' });

      service.downloadReceiptPdf('pay-1').subscribe((result) => {
        expect(result).toEqual(blob);
      });

      const req = httpMock.expectOne('/api/reports/payments/pay-1/receipt');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(blob);
    });
  });

  describe('buildPeriodParams() (tested indirectly)', () => {
    it('should send category param via buildPeriodParams for any method that uses it', () => {
      service.getIncome({ category: 'tools' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/reports/income');
      expect(req.request.params.get('category')).toBe('tools');
      req.flush({ totalIncome: 0 });
    });

    it('should handle all period filter combinations across methods', () => {
      service.getIncome({ period: 'daily', dateFrom: '2026-01-01', dateTo: '2026-01-01' }).subscribe();
      const reqIncome = httpMock.expectOne((r) => r.url === '/api/reports/income');
      expect(reqIncome.request.params.get('period')).toBeTruthy();
      expect(reqIncome.request.params.get('dateFrom')).toBeTruthy();
      expect(reqIncome.request.params.get('dateTo')).toBeTruthy();
      reqIncome.flush({});

      service.getExpenses({ period: 'weekly', dateFrom: '2026-01-06', dateTo: '2026-01-12' }).subscribe();
      const reqExpenses = httpMock.expectOne((r) => r.url === '/api/reports/expenses');
      expect(reqExpenses.request.params.get('period')).toBeTruthy();
      expect(reqExpenses.request.params.get('dateFrom')).toBeTruthy();
      expect(reqExpenses.request.params.get('dateTo')).toBeTruthy();
      reqExpenses.flush({});

      service.getProfit({ period: 'monthly', dateFrom: '2026-06-01', dateTo: '2026-06-30' }).subscribe();
      const reqProfit = httpMock.expectOne((r) => r.url === '/api/reports/profit');
      expect(reqProfit.request.params.get('period')).toBeTruthy();
      expect(reqProfit.request.params.get('dateFrom')).toBeTruthy();
      expect(reqProfit.request.params.get('dateTo')).toBeTruthy();
      reqProfit.flush({});

      service.getServices({ period: 'yearly', dateFrom: '2026-01-01', dateTo: '2026-12-31' }).subscribe();
      const reqServices = httpMock.expectOne((r) => r.url === '/api/reports/services');
      expect(reqServices.request.params.get('period')).toBeTruthy();
      expect(reqServices.request.params.get('dateFrom')).toBeTruthy();
      expect(reqServices.request.params.get('dateTo')).toBeTruthy();
      reqServices.flush({});
    });
  });
});
