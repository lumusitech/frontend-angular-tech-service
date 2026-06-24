import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationsService } from '../../core/services/notifications.service';
import {
  AppNotification,
  NotificationType,
  PaginatedNotifications,
} from '../../core/models/notification.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const TYPE_ICONS: Record<string, string> = {
  'work_order.created': 'assignment',
  'work_order.status_changed': 'sync',
  'work_order.technician_assigned': 'person_add',
  'task.created': 'task',
  'task.completed': 'task_alt',
  'payment.created': 'payment',
  'payment.approved': 'check_circle',
  'payment.rejected': 'cancel',
  'pending_item.created': 'pending_actions',
  'pending_item.due_today': 'alarm',
  'pending_item.overdue': 'warning',
  'inquiry.created': 'help_outline',
  'inquiry.assigned': 'person_add',
  'inquiry.contacted': 'phone',
  'inquiry.reviewed': 'rate_review',
};

const TYPE_COLORS: Record<string, string> = {
  'work_order.created': 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  'work_order.status_changed': 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  'work_order.technician_assigned': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'task.created': 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  'task.completed': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'payment.created': 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
  'payment.approved': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'payment.rejected': 'text-red-500 bg-red-100 dark:bg-red-900/30',
  'pending_item.created': 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  'pending_item.due_today': 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
  'pending_item.overdue': 'text-red-500 bg-red-100 dark:bg-red-900/30',
  'inquiry.created': 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  'inquiry.assigned': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'inquiry.contacted': 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
  'inquiry.reviewed': 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
};

@Component({
  selector: 'app-notifications-list',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    DatePipe,
    TranslatePipe,
  ],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <app-page-header
          [title]="'notifications.title' | translate"
          [subtitle]="'notifications.subtitle' | translate"
        />
        @if (notificationsService.unreadCount() > 0) {
          <button mat-flat-button color="primary" (click)="markAllAsRead()">
            <mat-icon>done_all</mat-icon>
            {{ 'notifications.markAllRead' | translate }}
          </button>
        }
      </div>

      <!-- Filter -->
      <div class="flex items-center gap-3">
        <mat-button-toggle-group
          [value]="readFilter()"
          (change)="onFilterChange($event.value)"
          class="!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !rounded-lg"
        >
          <mat-button-toggle value="all">{{ 'notifications.filters.all' | translate }}</mat-button-toggle>
          <mat-button-toggle value="unread">{{ 'notifications.filters.unread' | translate }}</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      @if (resource.status() === 'loading' && !resource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40" />
        </div>
      } @else if (resource.error()) {
        <app-error-state (retry)="resource.reload()" />
      } @else if (resource.hasValue() && resource.value().data.length === 0) {
        <app-empty-state
          [title]="'notifications.noNotifications' | translate"
          [message]="'notifications.noNotificationsMessage' | translate"
        />
      } @else if (resource.hasValue()) {
        <div class="space-y-2">
          @for (notification of resource.value().data; track notification.id) {
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow flex items-start gap-3"
              [class.border-l-4]="!notification.isRead"
              [class.border-l-blue-500]="!notification.isRead"
              (click)="onNotificationClick(notification)"
            >
              <!-- Icon -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                [class]="getTypeColor(notification.type)"
              >
                <mat-icon class="!w-5 !h-5">{{ getTypeIcon(notification.type) }}</mat-icon>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {{ notification.title }}
                  </p>
                  <span class="text-xs text-gray-400 dark:text-gray-500 ml-2 shrink-0">
                    {{ notification.createdAt | date: 'dd/MM HH:mm' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ notification.message }}
                </p>
                @if (!notification.isRead) {
                  <button
                    mat-button
                    color="primary"
                    class="!mt-1 !p-0 !min-h-0"
                    (click)="markAsRead(notification, $event)"
                  >
                    {{ 'notifications.markRead' | translate }}
                  </button>
                }
              </div>

              <!-- Unread dot -->
              @if (!notification.isRead) {
                <div class="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1"></div>
              }
            </div>
          }
        </div>

        <mat-paginator
          [length]="resource.value().total"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        />
      }
    </div>
  `,
})
export class NotificationsListComponent {
  readonly notificationsService = inject(NotificationsService);
  private readonly router = inject(Router);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly readFilter = signal<string>('all');

  readonly resource = httpResource<PaginatedNotifications>(() => ({
    url: '/api/notifications',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: 'createdAt',
      order: 'DESC',
      ...(this.readFilter() === 'unread' ? { isRead: 'false' } : {}),
    },
  }));

  getTypeIcon(type: string): string {
    return TYPE_ICONS[type] || 'notifications';
  }

  getTypeColor(type: string): string {
    return TYPE_COLORS[type] || 'text-gray-500 bg-gray-100 dark:bg-gray-700';
  }

  onFilterChange(value: string): void {
    this.readFilter.set(value);
    this.currentPage.set(1);
    this.resource.reload();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  markAsRead(notification: AppNotification, event: Event): void {
    event.stopPropagation();
    this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => this.resource.reload(),
    });
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => this.resource.reload(),
    });
  }

  onNotificationClick(notification: AppNotification): void {
    if (!notification.isRead) {
      this.notificationsService.markAsRead(notification.id).subscribe();
    }

    if (notification.referenceType) {
      const routes: Record<string, string> = {
        work_order: '/admin/work-orders',
        task: '/admin/work-orders',
        payment: '/admin/payments',
        pending_item: '/admin/pending-items',
        inquiry: '/admin/inquiries',
      };
      const baseRoute = routes[notification.referenceType];
      if (baseRoute) {
        this.router.navigate([baseRoute], {
          queryParams: notification.referenceId ? { highlight: notification.referenceId } : {},
        });
      }
    }
  }
}
