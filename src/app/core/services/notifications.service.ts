import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  AppNotification,
  NotificationFilters,
  PaginatedNotifications,
} from '../models/notification.interfaces';

@Service()
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/notifications';

  readonly unreadCount = signal(0);

  getAll(filters?: NotificationFilters): Observable<PaginatedNotifications> {
    let params = new HttpParams();
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.order) params = params.set('order', filters.order);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.isRead !== undefined) params = params.set('isRead', filters.isRead.toString());

    return this.http.get<PaginatedNotifications>(this.apiUrl, { params });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`).pipe(
      map((count) => {
        this.unreadCount.set(count);
        return count;
      }),
    );
  }

  markAsRead(id: string): Observable<AppNotification> {
    return this.http.patch<AppNotification>(`${this.apiUrl}/${id}/read`, {}).pipe(
      map((notification) => {
        this.unreadCount.update((c) => Math.max(0, c - 1));
        return notification;
      }),
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/read-all`, {}).pipe(
      map(() => {
        this.unreadCount.set(0);
      }),
    );
  }

  incrementUnread(): void {
    this.unreadCount.update((c) => c + 1);
  }
}
