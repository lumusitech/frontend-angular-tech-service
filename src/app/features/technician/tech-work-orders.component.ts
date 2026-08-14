import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { WorkOrder } from '../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../core/models/dashboard.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { UrgencyIndicatorComponent } from '../../shared/components/urgency-indicator/urgency-indicator.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  assigned: 'bg-blue-500/15 text-blue-400',
  on_the_way: 'bg-cyan-500/15 text-cyan-400',
  in_progress: 'bg-purple-500/15 text-purple-400',
  completed: 'bg-green-500/15 text-green-400',
  delivered: 'bg-gray-500/15 text-gray-400',
  cancelled: 'bg-red-500/15 text-red-400',
  postponed: 'bg-orange-500/15 text-orange-400',
};

@Component({
  selector: 'app-tech-work-orders',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    UrgencyIndicatorComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    TranslatePipe,
    StatusLabelPipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ 'technician.title' | translate }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'technician.subtitle' | translate }}
          </p>
        </div>
      </div>

      <!-- Status filter chips -->
      <div class="flex gap-2 overflow-x-auto pb-2">
        @for (filter of statusFilters; track filter.value) {
          <button
            class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
            [class]="
              activeFilter() === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            "
            (click)="setFilter(filter.value)"
          >
            {{ filter.label | translate }}
          </button>
        }
      </div>

      @if (resource.status() === 'loading' && !resource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40" />
        </div>
      } @else if (resource.error()) {
        <app-error-state (retry)="resource.reload()" />
      } @else if (resource.hasValue() && resource.value().data.length === 0) {
        <app-empty-state
          [title]="'technician.noOrders' | translate"
          [message]="'technician.noOrdersMessage' | translate"
        />
      } @else if (resource.hasValue()) {
        <div class="space-y-3">
          @for (order of resource.value().data; track order.id) {
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              role="button"
              tabindex="0"
              (click)="viewDetail(order)"
              (keydown.enter)="viewDetail(order)"
              (keydown.space.prevent)="viewDetail(order)"
            >
              <!-- Top row: tracking code + status badge -->
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                  {{ order.trackingCode }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class]="getStatusColor(order.status)"
                >
                  {{ order.status | statusLabel: 'workOrderStatus' }}
                </span>
              </div>

              <!-- Client + service -->
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ order.client?.name || '-' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {{ order.serviceType?.name || '-' }}
              </p>

              <!-- Bottom row: urgency + date + progress -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <app-urgency-indicator [scheduledDate]="order.scheduledDate || null" />
                  @if (order.scheduledDate) {
                    <span class="text-xs text-gray-400 dark:text-gray-500">
                      {{ order.scheduledDate | relativeDate }}
                    </span>
                  }
                </div>
                @if (order.tasks && order.tasks.length > 0) {
                  <div class="flex items-center gap-1.5">
                    <div
                      class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-green-500 rounded-full"
                        [style.width.%]="getTaskProgress(order)"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-400 dark:text-gray-500">
                      {{ getCompletedTasks(order) }}/{{ order.tasks.length }}
                    </span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class TechWorkOrdersComponent {
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly router = inject(Router);
  private readonly websocketService = inject(WebsocketService);

  readonly activeFilter = signal<string | null>(null);

  readonly statusFilters = [
    { value: null, label: 'workOrders.filters.all' },
    { value: 'pending', label: 'workOrders.statuses.pending' },
    { value: 'in_progress', label: 'workOrders.statuses.inProgress' },
    { value: 'completed', label: 'workOrders.statuses.completed' },
    { value: 'delivered', label: 'workOrders.statuses.delivered' },
    { value: 'cancelled', label: 'workOrders.statuses.cancelled' },
  ];

  readonly resource = httpResource<PaginatedResponse<WorkOrder>>(() => {
    this.websocketService.workOrderRefreshKey();
    return {
      url: '/api/work-orders',
      params: {
        page: 1,
        limit: 50,
        sortBy: 'updatedAt',
        order: 'DESC',
        ...(this.activeFilter() ? { status: this.activeFilter()! } : {}),
      },
    };
  });

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'bg-gray-500/15 text-gray-400';
  }

  setFilter(value: string | null): void {
    this.activeFilter.set(value);
    this.resource.reload();
  }

  getCompletedTasks(order: WorkOrder): number {
    return order.tasks?.filter((t) => t.isCompleted).length || 0;
  }

  getTaskProgress(order: WorkOrder): number {
    if (!order.tasks || order.tasks.length === 0) return 0;
    return (this.getCompletedTasks(order) / order.tasks.length) * 100;
  }

  viewDetail(order: WorkOrder): void {
    this.router.navigate(['/tech', order.id]);
  }
}
