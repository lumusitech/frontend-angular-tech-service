import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PaymentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkUpdateStatus()', () => {
    it('should PATCH /api/payments/bulk-status with ids and status', () => {
      const result = {
        succeeded: [{ id: 'p-1', status: 'approved' }],
        failed: [],
      };
      service.bulkUpdateStatus(['p-1'], 'approved').subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/payments/bulk-status');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ ids: ['p-1'], status: 'approved' });
      req.flush(result);
    });
  });

  describe('bulkDelete()', () => {
    it('should POST /api/payments/bulk-delete with ids', () => {
      const result = {
        succeeded: [{ id: 'p-1' }],
        failed: [],
      };
      service.bulkDelete(['p-1']).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/payments/bulk-delete');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: ['p-1'] });
      req.flush(result);
    });
  });
});
