import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SuppliersService } from './suppliers.service';

describe('SuppliersService', () => {
  let service: SuppliersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SuppliersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkUpdateStatus()', () => {
    it('should PATCH /api/suppliers/bulk-status with ids and isActive', () => {
      const result = {
        succeeded: [{ id: 's-1', isActive: false }],
        failed: [],
      };
      service.bulkUpdateStatus(['s-1'], false).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/suppliers/bulk-status');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ ids: ['s-1'], isActive: false });
      req.flush(result);
    });
  });

  describe('bulkDelete()', () => {
    it('should POST /api/suppliers/bulk-delete with ids', () => {
      const result = {
        succeeded: [{ id: 's-1' }],
        failed: [],
      };
      service.bulkDelete(['s-1']).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/suppliers/bulk-delete');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: ['s-1'] });
      req.flush(result);
    });
  });
});
