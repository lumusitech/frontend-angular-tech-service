import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkUpdateStatus()', () => {
    it('should PATCH /api/users/bulk-status with ids and isActive', () => {
      const result = {
        succeeded: [{ id: 'u-1', isActive: false }],
        failed: [],
      };
      service.bulkUpdateStatus(['u-1'], false).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/users/bulk-status');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ ids: ['u-1'], isActive: false });
      req.flush(result);
    });
  });
});
