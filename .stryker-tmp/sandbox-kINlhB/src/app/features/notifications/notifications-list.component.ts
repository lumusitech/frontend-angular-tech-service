// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, computed, inject, output, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { NotificationsService } from '../../core/services/notifications.service';
import { AppNotification, NotificationType, PaginatedNotifications } from '../../core/models/notification.interfaces';
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
const TYPE_ICONS: Record<string, string> = stryMutAct_9fa48("2830") ? {} : (stryCov_9fa48("2830"), {
  'work_order.created': stryMutAct_9fa48("2831") ? "" : (stryCov_9fa48("2831"), 'assignment'),
  'work_order.status_changed': stryMutAct_9fa48("2832") ? "" : (stryCov_9fa48("2832"), 'sync'),
  'work_order.technician_assigned': stryMutAct_9fa48("2833") ? "" : (stryCov_9fa48("2833"), 'person_add'),
  'task.created': stryMutAct_9fa48("2834") ? "" : (stryCov_9fa48("2834"), 'task'),
  'task.completed': stryMutAct_9fa48("2835") ? "" : (stryCov_9fa48("2835"), 'task_alt'),
  'payment.created': stryMutAct_9fa48("2836") ? "" : (stryCov_9fa48("2836"), 'payment'),
  'payment.approved': stryMutAct_9fa48("2837") ? "" : (stryCov_9fa48("2837"), 'check_circle'),
  'payment.rejected': stryMutAct_9fa48("2838") ? "" : (stryCov_9fa48("2838"), 'cancel'),
  'pending_item.created': stryMutAct_9fa48("2839") ? "" : (stryCov_9fa48("2839"), 'pending_actions'),
  'pending_item.due_today': stryMutAct_9fa48("2840") ? "" : (stryCov_9fa48("2840"), 'alarm'),
  'pending_item.overdue': stryMutAct_9fa48("2841") ? "" : (stryCov_9fa48("2841"), 'warning'),
  'inquiry.created': stryMutAct_9fa48("2842") ? "" : (stryCov_9fa48("2842"), 'help_outline'),
  'inquiry.assigned': stryMutAct_9fa48("2843") ? "" : (stryCov_9fa48("2843"), 'person_add'),
  'inquiry.contacted': stryMutAct_9fa48("2844") ? "" : (stryCov_9fa48("2844"), 'phone'),
  'inquiry.reviewed': stryMutAct_9fa48("2845") ? "" : (stryCov_9fa48("2845"), 'rate_review')
});
const TYPE_COLORS: Record<string, string> = stryMutAct_9fa48("2846") ? {} : (stryCov_9fa48("2846"), {
  'work_order.created': stryMutAct_9fa48("2847") ? "" : (stryCov_9fa48("2847"), 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'),
  'work_order.status_changed': stryMutAct_9fa48("2848") ? "" : (stryCov_9fa48("2848"), 'text-purple-500 bg-purple-100 dark:bg-purple-900/30'),
  'work_order.technician_assigned': stryMutAct_9fa48("2849") ? "" : (stryCov_9fa48("2849"), 'text-green-500 bg-green-100 dark:bg-green-900/30'),
  'task.created': stryMutAct_9fa48("2850") ? "" : (stryCov_9fa48("2850"), 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'),
  'task.completed': stryMutAct_9fa48("2851") ? "" : (stryCov_9fa48("2851"), 'text-green-500 bg-green-100 dark:bg-green-900/30'),
  'payment.created': stryMutAct_9fa48("2852") ? "" : (stryCov_9fa48("2852"), 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'),
  'payment.approved': stryMutAct_9fa48("2853") ? "" : (stryCov_9fa48("2853"), 'text-green-500 bg-green-100 dark:bg-green-900/30'),
  'payment.rejected': stryMutAct_9fa48("2854") ? "" : (stryCov_9fa48("2854"), 'text-red-500 bg-red-100 dark:bg-red-900/30'),
  'pending_item.created': stryMutAct_9fa48("2855") ? "" : (stryCov_9fa48("2855"), 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'),
  'pending_item.due_today': stryMutAct_9fa48("2856") ? "" : (stryCov_9fa48("2856"), 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'),
  'pending_item.overdue': stryMutAct_9fa48("2857") ? "" : (stryCov_9fa48("2857"), 'text-red-500 bg-red-100 dark:bg-red-900/30'),
  'inquiry.created': stryMutAct_9fa48("2858") ? "" : (stryCov_9fa48("2858"), 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'),
  'inquiry.assigned': stryMutAct_9fa48("2859") ? "" : (stryCov_9fa48("2859"), 'text-green-500 bg-green-100 dark:bg-green-900/30'),
  'inquiry.contacted': stryMutAct_9fa48("2860") ? "" : (stryCov_9fa48("2860"), 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'),
  'inquiry.reviewed': stryMutAct_9fa48("2861") ? "" : (stryCov_9fa48("2861"), 'text-purple-500 bg-purple-100 dark:bg-purple-900/30')
});
@Component({
  selector: 'app-notifications-list',
  imports: [MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatPaginatorModule, MatButtonToggleModule, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, TranslatePipe, RelativeDatePipe],
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
  `
})
export class NotificationsListComponent {
  readonly notificationsService = inject(NotificationsService);
  readonly notificationClick = output<AppNotification>();
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly readFilter = signal<string>(stryMutAct_9fa48("2862") ? "" : (stryCov_9fa48("2862"), 'all'));
  readonly typeFilter = signal(stryMutAct_9fa48("2863") ? "Stryker was here!" : (stryCov_9fa48("2863"), ''));
  readonly searchFilter = signal(stryMutAct_9fa48("2864") ? "Stryker was here!" : (stryCov_9fa48("2864"), ''));
  readonly resource = httpResource<PaginatedNotifications>(stryMutAct_9fa48("2865") ? () => undefined : (stryCov_9fa48("2865"), () => stryMutAct_9fa48("2866") ? {} : (stryCov_9fa48("2866"), {
    url: stryMutAct_9fa48("2867") ? "" : (stryCov_9fa48("2867"), '/api/notifications'),
    params: stryMutAct_9fa48("2868") ? {} : (stryCov_9fa48("2868"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: stryMutAct_9fa48("2869") ? "" : (stryCov_9fa48("2869"), 'createdAt'),
      order: stryMutAct_9fa48("2870") ? "" : (stryCov_9fa48("2870"), 'DESC'),
      ...((stryMutAct_9fa48("2873") ? this.readFilter() !== 'unread' : stryMutAct_9fa48("2872") ? false : stryMutAct_9fa48("2871") ? true : (stryCov_9fa48("2871", "2872", "2873"), this.readFilter() === (stryMutAct_9fa48("2874") ? "" : (stryCov_9fa48("2874"), 'unread')))) ? stryMutAct_9fa48("2875") ? {} : (stryCov_9fa48("2875"), {
        isRead: stryMutAct_9fa48("2876") ? "" : (stryCov_9fa48("2876"), 'false')
      }) : {}),
      ...(this.typeFilter() ? stryMutAct_9fa48("2877") ? {} : (stryCov_9fa48("2877"), {
        type: this.typeFilter()
      }) : {}),
      ...(this.searchFilter() ? stryMutAct_9fa48("2878") ? {} : (stryCov_9fa48("2878"), {
        search: this.searchFilter()
      }) : {})
    })
  })));
  getTypeIcon(type: string): string {
    if (stryMutAct_9fa48("2879")) {
      {}
    } else {
      stryCov_9fa48("2879");
      return stryMutAct_9fa48("2882") ? TYPE_ICONS[type] && 'notifications' : stryMutAct_9fa48("2881") ? false : stryMutAct_9fa48("2880") ? true : (stryCov_9fa48("2880", "2881", "2882"), TYPE_ICONS[type] || (stryMutAct_9fa48("2883") ? "" : (stryCov_9fa48("2883"), 'notifications')));
    }
  }
  getTypeColor(type: string): string {
    if (stryMutAct_9fa48("2884")) {
      {}
    } else {
      stryCov_9fa48("2884");
      return stryMutAct_9fa48("2887") ? TYPE_COLORS[type] && 'text-gray-500 bg-gray-100 dark:bg-gray-700' : stryMutAct_9fa48("2886") ? false : stryMutAct_9fa48("2885") ? true : (stryCov_9fa48("2885", "2886", "2887"), TYPE_COLORS[type] || (stryMutAct_9fa48("2888") ? "" : (stryCov_9fa48("2888"), 'text-gray-500 bg-gray-100 dark:bg-gray-700')));
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("2889")) {
      {}
    } else {
      stryCov_9fa48("2889");
      return stryMutAct_9fa48("2892") ? (this.readFilter() !== 'all' || this.typeFilter() !== '') && this.searchFilter() !== '' : stryMutAct_9fa48("2891") ? false : stryMutAct_9fa48("2890") ? true : (stryCov_9fa48("2890", "2891", "2892"), (stryMutAct_9fa48("2894") ? this.readFilter() !== 'all' && this.typeFilter() !== '' : stryMutAct_9fa48("2893") ? false : (stryCov_9fa48("2893", "2894"), (stryMutAct_9fa48("2896") ? this.readFilter() === 'all' : stryMutAct_9fa48("2895") ? false : (stryCov_9fa48("2895", "2896"), this.readFilter() !== (stryMutAct_9fa48("2897") ? "" : (stryCov_9fa48("2897"), 'all')))) || (stryMutAct_9fa48("2899") ? this.typeFilter() === '' : stryMutAct_9fa48("2898") ? false : (stryCov_9fa48("2898", "2899"), this.typeFilter() !== (stryMutAct_9fa48("2900") ? "Stryker was here!" : (stryCov_9fa48("2900"), '')))))) || (stryMutAct_9fa48("2902") ? this.searchFilter() === '' : stryMutAct_9fa48("2901") ? false : (stryCov_9fa48("2901", "2902"), this.searchFilter() !== (stryMutAct_9fa48("2903") ? "Stryker was here!" : (stryCov_9fa48("2903"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("2904")) {
      {}
    } else {
      stryCov_9fa48("2904");
      this.readFilter.set(stryMutAct_9fa48("2905") ? "" : (stryCov_9fa48("2905"), 'all'));
      this.typeFilter.set(stryMutAct_9fa48("2906") ? "Stryker was here!" : (stryCov_9fa48("2906"), ''));
      this.searchFilter.set(stryMutAct_9fa48("2907") ? "Stryker was here!" : (stryCov_9fa48("2907"), ''));
    }
  }
  onFilterChange(value: string): void {
    if (stryMutAct_9fa48("2908")) {
      {}
    } else {
      stryCov_9fa48("2908");
      this.readFilter.set(value);
      this.currentPage.set(1);
      this.resource.reload();
    }
  }
  onTypeFilterChange(value: string): void {
    if (stryMutAct_9fa48("2909")) {
      {}
    } else {
      stryCov_9fa48("2909");
      this.typeFilter.set(value);
      this.currentPage.set(1);
      this.resource.reload();
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("2910")) {
      {}
    } else {
      stryCov_9fa48("2910");
      return (event.target as HTMLInputElement).value;
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("2911")) {
      {}
    } else {
      stryCov_9fa48("2911");
      this.currentPage.set(stryMutAct_9fa48("2912") ? event.pageIndex - 1 : (stryCov_9fa48("2912"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  markAsRead(notification: AppNotification, event: Event): void {
    if (stryMutAct_9fa48("2913")) {
      {}
    } else {
      stryCov_9fa48("2913");
      event.stopPropagation();
      this.notificationsService.markAsRead(notification.id).subscribe(stryMutAct_9fa48("2914") ? {} : (stryCov_9fa48("2914"), {
        next: () => {
          if (stryMutAct_9fa48("2915")) {
            {}
          } else {
            stryCov_9fa48("2915");
            this.notificationsService.unreadCount.update(stryMutAct_9fa48("2916") ? () => undefined : (stryCov_9fa48("2916"), c => stryMutAct_9fa48("2917") ? Math.min(0, c - 1) : (stryCov_9fa48("2917"), Math.max(0, stryMutAct_9fa48("2918") ? c + 1 : (stryCov_9fa48("2918"), c - 1)))));
            this.resource.reload();
          }
        }
      }));
    }
  }
  markAllAsRead(): void {
    if (stryMutAct_9fa48("2919")) {
      {}
    } else {
      stryCov_9fa48("2919");
      this.notificationsService.markAllAsRead().subscribe(stryMutAct_9fa48("2920") ? {} : (stryCov_9fa48("2920"), {
        next: () => {
          if (stryMutAct_9fa48("2921")) {
            {}
          } else {
            stryCov_9fa48("2921");
            this.notificationsService.unreadCount.set(0);
            this.resource.reload();
          }
        }
      }));
    }
  }
  handleItemClick(notification: AppNotification): void {
    if (stryMutAct_9fa48("2922")) {
      {}
    } else {
      stryCov_9fa48("2922");
      if (stryMutAct_9fa48("2925") ? false : stryMutAct_9fa48("2924") ? true : stryMutAct_9fa48("2923") ? notification.isRead : (stryCov_9fa48("2923", "2924", "2925"), !notification.isRead)) {
        if (stryMutAct_9fa48("2926")) {
          {}
        } else {
          stryCov_9fa48("2926");
          this.notificationsService.markAsRead(notification.id).subscribe(stryMutAct_9fa48("2927") ? {} : (stryCov_9fa48("2927"), {
            next: stryMutAct_9fa48("2928") ? () => undefined : (stryCov_9fa48("2928"), () => this.notificationsService.unreadCount.update(stryMutAct_9fa48("2929") ? () => undefined : (stryCov_9fa48("2929"), c => stryMutAct_9fa48("2930") ? Math.min(0, c - 1) : (stryCov_9fa48("2930"), Math.max(0, stryMutAct_9fa48("2931") ? c + 1 : (stryCov_9fa48("2931"), c - 1))))))
          }));
        }
      }
      this.notificationClick.emit(notification);
    }
  }
}