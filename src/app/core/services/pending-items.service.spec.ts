import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PendingItemsService } from './pending-items.service';
import { PendingItemStatus } from '../models/pending-item.interfaces';

describe('PendingItemsService', () => {
  let service: PendingItemsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PendingItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkUpdateStatus()', () => {
    it('should PATCH /api/pending-items/bulk-status with ids and status', () => {
      const result = {
        succeeded: [{ id: 'pi-1', status: PendingItemStatus.COMPLETED }],
        failed: [],
      };
      service.bulkUpdateStatus(['pi-1'], PendingItemStatus.COMPLETED).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/pending-items/bulk-status');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ ids: ['pi-1'], status: 'completed' });
      req.flush(result);
    });
  });

  describe('bulkDelete()', () => {
    it('should POST /api/pending-items/bulk-delete with ids', () => {
      const result = {
        succeeded: [{ id: 'pi-1' }],
        failed: [],
      };
      service.bulkDelete(['pi-1']).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/pending-items/bulk-delete');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: ['pi-1'] });
      req.flush(result);
    });
  });
});
