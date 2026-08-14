import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../models/notification.interfaces';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpMock: HttpTestingController;

  const mockNotification = {
    id: 'n-1',
    type: NotificationType.WORK_ORDER_CREATED,
    title: 'New work order',
    message: 'Order TS-00001 created',
    referenceId: 'wo-1',
    referenceType: 'WorkOrder',
    metadata: null,
    isRead: false,
    readAt: null,
    createdAt: '2026-01-15T10:00:00.000Z',
  };

  const mockPaginated = {
    data: [mockNotification],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('unreadCount signal', () => {
    it('should initialize at 0', () => {
      expect(service.unreadCount()).toBe(0);
    });
  });

  describe('getAll()', () => {
    it('should GET /api/notifications without params', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockPaginated);
    });

    it('should send page and limit', () => {
      service.getAll({ page: 2, limit: 25 }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('limit')).toBe('25');
      req.flush(mockPaginated);
    });

    it('should send sortBy and order', () => {
      service.getAll({ sortBy: 'createdAt', order: 'DESC' }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.params.get('sortBy')).toBe('createdAt');
      expect(req.request.params.get('order')).toBe('DESC');
      req.flush(mockPaginated);
    });

    it('should send type filter', () => {
      service.getAll({ type: NotificationType.PAYMENT_APPROVED }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.params.get('type')).toBe('payment.approved');
      req.flush(mockPaginated);
    });

    it('should send isRead=false filter', () => {
      service.getAll({ isRead: false }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.params.get('isRead')).toBe('false');
      req.flush(mockPaginated);
    });

    it('should send isRead=true filter', () => {
      service.getAll({ isRead: true }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.params.get('isRead')).toBe('true');
      req.flush(mockPaginated);
    });

    it('should send all filters combined', () => {
      service
        .getAll({
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          order: 'ASC',
          type: NotificationType.TASK_COMPLETED,
          isRead: false,
        })
        .subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.params.keys().length).toBe(6);
      req.flush(mockPaginated);
    });

    it('should not send undefined params', () => {
      service.getAll({ page: 1 }).subscribe();

      const req = httpMock.expectOne((r) => r.url === '/api/notifications');
      expect(req.request.params.has('type')).toBe(false);
      expect(req.request.params.has('isRead')).toBe(false);
      expect(req.request.params.has('sortBy')).toBe(false);
      req.flush(mockPaginated);
    });
  });

  describe('getUnreadCount()', () => {
    it('should GET /api/notifications/unread-count', () => {
      service.getUnreadCount().subscribe((count) => {
        expect(count).toBe(3);
      });

      const req = httpMock.expectOne('/api/notifications/unread-count');
      expect(req.request.method).toBe('GET');
      req.flush(3);
    });

    it('should return 0 when no unread', () => {
      service.getUnreadCount().subscribe((count) => {
        expect(count).toBe(0);
      });

      httpMock.expectOne('/api/notifications/unread-count').flush(0);
    });
  });

  describe('markAsRead()', () => {
    it('should PATCH /api/notifications/:id/read', () => {
      service.markAsRead('n-1').subscribe((notification) => {
        expect(notification.id).toBe('n-1');
        expect(notification.isRead).toBe(true);
      });

      const req = httpMock.expectOne('/api/notifications/n-1/read');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush({ ...mockNotification, isRead: true, readAt: new Date().toISOString() });
    });

    it('should propagate 404 for nonexistent notification', () => {
      service.markAsRead('nonexistent').subscribe({
        error: (err) => expect(err.status).toBe(404),
      });

      httpMock
        .expectOne('/api/notifications/nonexistent/read')
        .flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('markAllAsRead()', () => {
    it('should PATCH /api/notifications/read-all', () => {
      service.markAllAsRead().subscribe((result) => {
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne('/api/notifications/read-all');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });

    it('should propagate error', () => {
      service.markAllAsRead().subscribe({
        error: (err) => expect(err.status).toBe(500),
      });

      httpMock
        .expectOne('/api/notifications/read-all')
        .flush('Server Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('incrementUnread()', () => {
    it('should increment unreadCount by 1', () => {
      expect(service.unreadCount()).toBe(0);

      service.incrementUnread();

      expect(service.unreadCount()).toBe(1);
    });

    it('should accumulate on multiple calls', () => {
      service.incrementUnread();
      service.incrementUnread();
      service.incrementUnread();

      expect(service.unreadCount()).toBe(3);
    });

    it('should increment from any starting value', () => {
      service.unreadCount.set(5);

      service.incrementUnread();

      expect(service.unreadCount()).toBe(6);
    });
  });

  describe('unreadCount signal manipulation (via component pattern)', () => {
    it('should set to 0 when markAllAsRead is called from component', () => {
      service.unreadCount.set(10);

      // Simulating what notifications-list.component does
      service.markAllAsRead().subscribe({
        next: () => {
          service.unreadCount.set(0);
        },
      });

      httpMock.expectOne('/api/notifications/read-all').flush(null);

      expect(service.unreadCount()).toBe(0);
    });

    it('should decrement by 1 when markAsRead is called from component', () => {
      service.unreadCount.set(5);

      // Simulating what notifications-list.component does
      service.markAsRead('n-1').subscribe({
        next: () => {
          service.unreadCount.update((c) => Math.max(0, c - 1));
        },
      });

      httpMock
        .expectOne('/api/notifications/n-1/read')
        .flush({ ...mockNotification, isRead: true });

      expect(service.unreadCount()).toBe(4);
    });

    it('should not go below 0 when decrementing', () => {
      service.unreadCount.set(0);

      service.unreadCount.update((c) => Math.max(0, c - 1));

      expect(service.unreadCount()).toBe(0);
    });
  });

  describe('offline & network failure edge cases', () => {
    it('should handle network disconnection (status 0) when fetching unread count without breaking signal state', () => {
      service.unreadCount.set(5);

      service.getUnreadCount().subscribe({
        error: (err) => {
          expect(err.status).toBe(0);
        },
      });

      const req = httpMock.expectOne('/api/notifications/unread-count');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

      // Signal state remains preserved
      expect(service.unreadCount()).toBe(5);
    });

    it('should handle network error (status 0) when marking notification as read', () => {
      service.markAsRead('n-1').subscribe({
        error: (err) => {
          expect(err.status).toBe(0);
        },
      });

      const req = httpMock.expectOne('/api/notifications/n-1/read');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });
  });
});
