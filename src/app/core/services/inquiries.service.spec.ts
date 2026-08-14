import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { InquiriesService } from './inquiries.service';

describe('InquiriesService', () => {
  let service: InquiriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InquiriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkDelete()', () => {
    it('should POST /api/inquiries/bulk-delete with ids', () => {
      const result = {
        succeeded: [{ id: 'iq-1' }],
        failed: [],
      };
      service.bulkDelete(['iq-1']).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/inquiries/bulk-delete');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: ['iq-1'] });
      req.flush(result);
    });
  });
});
