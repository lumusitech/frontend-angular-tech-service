import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExpensesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkDelete()', () => {
    it('should POST /api/expenses/bulk-delete with ids', () => {
      const result = {
        succeeded: [{ id: 'e-1' }],
        failed: [],
      };
      service.bulkDelete(['e-1']).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/expenses/bulk-delete');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: ['e-1'] });
      req.flush(result);
    });
  });
});
