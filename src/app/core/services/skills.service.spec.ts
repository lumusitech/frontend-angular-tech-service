import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SkillsService } from './skills.service';

describe('SkillsService', () => {
  let service: SkillsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SkillsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('bulkUpdateStatus()', () => {
    it('should PATCH /api/skills/bulk-status with ids and isActive', () => {
      const result = {
        succeeded: [{ id: 'sk-1', isActive: false }],
        failed: [],
      };
      service.bulkUpdateStatus(['sk-1'], false).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/skills/bulk-status');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ ids: ['sk-1'], isActive: false });
      req.flush(result);
    });
  });

  describe('bulkDelete()', () => {
    it('should POST /api/skills/bulk-delete with ids', () => {
      const result = {
        succeeded: [{ id: 'sk-1' }],
        failed: [],
      };
      service.bulkDelete(['sk-1']).subscribe((res) => {
        expect(res).toEqual(result);
      });

      const req = httpMock.expectOne('/api/skills/bulk-delete');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ids: ['sk-1'] });
      req.flush(result);
    });
  });
});
