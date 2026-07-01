import { Component, computed, inject, output, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { NotificationsService } from '../../core/services/notifications.service';
import {
  AppNotification,
  NotificationType,
  PaginatedNotifications,
} from '../../core/models/notification.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

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
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-6">
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

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-button-toggle-group
            [value]="readFilter()"
            (change)="onFilterChange($event.value)"
            class="!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !rounded-lg"
          >
            <mat-button-toggle value="all">{{ 'notifications.filters.all' | translate }}</mat-button-toggle>
            <mat-button-toggle value="unread">{{ 'notifications.filters.unread' | translate }}</mat-button-toggle>
          </mat-button-toggle-group>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'notifications.type' | translate }}</mat-label>
            <mat-select [value]="typeFilter()" (selectionChange)="onTypeFilterChange($event.value)">
              <mat-option value="">{{ 'notifications.filters.allTypes' | translate }}</mat-option>
              <mat-option value="work_order.created">{{ 'notifications.types.workOrderCreated' | translate }}</mat-option>
              <mat-option value="work_order.status_changed">{{ 'notifications.types.workOrderStatusChanged' | translate }}</mat-option>
              <mat-option value="work_order.technician_assigned">{{ 'notifications.types.workOrderTechnicianAssigned' | translate }}</mat-option>
              <mat-option value="task.created">{{ 'notifications.types.taskCreated' | translate }}</mat-option>
              <mat-option value="task.completed">{{ 'notifications.types.taskCompleted' | translate }}</mat-option>
              <mat-option value="payment.created">{{ 'notifications.types.paymentCreated' | translate }}</mat-option>
              <mat-option value="payment.approved">{{ 'notifications.types.paymentApproved' | translate }}</mat-option>
              <mat-option value="payment.rejected">{{ 'notifications.types.paymentRejected' | translate }}</mat-option>
              <mat-option value="pending_item.created">{{ 'notifications.types.pendingItemCreated' | translate }}</mat-option>
              <mat-option value="pending_item.due_today">{{ 'notifications.types.pendingItemDueToday' | translate }}</mat-option>
              <mat-option value="pending_item.overdue">{{ 'notifications.types.pendingItemOverdue' | translate }}</mat-option>
              <mat-option value="inquiry.created">{{ 'notifications.types.inquiryCreated' | translate }}</mat-option>
              <mat-option value="inquiry.assigned">{{ 'notifications.types.inquiryAssigned' | translate }}</mat-option>
              <mat-option value="inquiry.contacted">{{ 'notifications.types.inquiryContacted' | translate }}</mat-option>
              <mat-option value="inquiry.reviewed">{{ 'notifications.types.inquiryReviewed' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.search' | translate }}</mat-label>
            <input matInput [value]="searchFilter()" (input)="searchFilter.set(getInputValue($event))" [placeholder]="'common.search' | translate" />
          </mat-form-field>

          @if (hasActiveFilters()) {
            <button mat-stroked-button (click)="clearFilters()" class="!text-gray-500 dark:!text-gray-400">
              <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
              {{ 'common.clearFilters' | translate }}
            </button>
          }
        </div>
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
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4 cursor-pointer hover:shadow-md transition-shadow flex items-start gap-3"
              [style.border-left-color]="!notification.isRead ? 'var(--color-primary)' : 'var(--color-secondary)'"
              (click)="handleItemClick(notification)"
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
                    {{ notification.createdAt | relativeDate }}
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
  readonly notificationClick = output<AppNotification>();

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly readFilter = signal<string>('all');
  readonly typeFilter = signal('');
  readonly searchFilter = signal('');

  readonly resource = httpResource<PaginatedNotifications>(() => ({
    url: '/api/notifications',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: 'createdAt',
      order: 'DESC',
      ...(this.readFilter() === 'unread' ? { isRead: 'false' } : {}),
      ...(this.typeFilter() ? { type: this.typeFilter() } : {}),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
    },
  }));

  getTypeIcon(type: string): string {
    return TYPE_ICONS[type] || 'notifications';
  }

  getTypeColor(type: string): string {
    return TYPE_COLORS[type] || 'text-gray-500 bg-gray-100 dark:bg-gray-700';
  }

  readonly hasActiveFilters = computed(() => {
    return this.readFilter() !== 'all' || this.typeFilter() !== '' || this.searchFilter() !== '';
  });

  clearFilters(): void {
    this.readFilter.set('all');
    this.typeFilter.set('');
    this.searchFilter.set('');
  }

  onFilterChange(value: string): void {
    this.readFilter.set(value);
    this.currentPage.set(1);
    this.resource.reload();
  }

  onTypeFilterChange(value: string): void {
    this.typeFilter.set(value);
    this.currentPage.set(1);
    this.resource.reload();
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  markAsRead(notification: AppNotification, event: Event): void {
    event.stopPropagation();
    this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => {
        this.notificationsService.unreadCount.update((c) => Math.max(0, c - 1));
        this.resource.reload();
      },
    });
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notificationsService.unreadCount.set(0);
        this.resource.reload();
      },
    });
  }

  handleItemClick(notification: AppNotification): void {
    if (!notification.isRead) {
      this.notificationsService.markAsRead(notification.id).subscribe({
        next: () => this.notificationsService.unreadCount.update((c) => Math.max(0, c - 1)),
      });
    }

    this.notificationClick.emit(notification);
  }
}
