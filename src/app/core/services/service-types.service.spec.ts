import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ServiceTypesService } from './service-types.service';

describe('ServiceTypesService', () => {
  let service: ServiceTypesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ServiceTypesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkUpdateStatus()', () => {
    it('should PATCH /api/service-types/bulk-status with ids and isActive', () => {
      const result = {
        succeeded: [{ id: 'st-1', isActive: false }],
        failed: [],
      };
      service.bulkUpdateStatus(['st-1'], false).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/service-types/bulk-status');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ ids: ['st-1'], isActive: false });
      req.flush(result);
    });
  });

  describe('bulkDelete()', () => {
    it('should POST /api/service-types/bulk-delete with ids', () => {
      const result = {
        succeeded: [{ id: 'st-1' }],
        failed: [],
      };
      service.bulkDelete(['st-1']).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/service-types/bulk-delete');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: ['st-1'] });
      req.flush(result);
    });
  });
});
