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
import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WorkOrder, WorkOrderStatus } from '../../core/models/work-order.interfaces';
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
const STATUS_COLORS: Record<string, string> = stryMutAct_9fa48("4964") ? {} : (stryCov_9fa48("4964"), {
  pending: stryMutAct_9fa48("4965") ? "" : (stryCov_9fa48("4965"), 'bg-yellow-500/15 text-yellow-400'),
  assigned: stryMutAct_9fa48("4966") ? "" : (stryCov_9fa48("4966"), 'bg-blue-500/15 text-blue-400'),
  in_progress: stryMutAct_9fa48("4967") ? "" : (stryCov_9fa48("4967"), 'bg-purple-500/15 text-purple-400'),
  completed: stryMutAct_9fa48("4968") ? "" : (stryCov_9fa48("4968"), 'bg-green-500/15 text-green-400'),
  delivered: stryMutAct_9fa48("4969") ? "" : (stryCov_9fa48("4969"), 'bg-gray-500/15 text-gray-400'),
  cancelled: stryMutAct_9fa48("4970") ? "" : (stryCov_9fa48("4970"), 'bg-red-500/15 text-red-400'),
  postponed: stryMutAct_9fa48("4971") ? "" : (stryCov_9fa48("4971"), 'bg-orange-500/15 text-orange-400')
});
@Component({
  selector: 'app-tech-work-orders',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatChipsModule, UrgencyIndicatorComponent, EmptyStateComponent, ErrorStateComponent, TranslatePipe, StatusLabelPipe, RelativeDatePipe],
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
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow"
              (click)="viewDetail(order)"
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
                    <div class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
  `
})
export class TechWorkOrdersComponent {
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly router = inject(Router);
  readonly activeFilter = signal<string | null>(null);
  readonly statusFilters = stryMutAct_9fa48("4972") ? [] : (stryCov_9fa48("4972"), [stryMutAct_9fa48("4973") ? {} : (stryCov_9fa48("4973"), {
    value: null,
    label: stryMutAct_9fa48("4974") ? "" : (stryCov_9fa48("4974"), 'workOrders.filters.all')
  }), stryMutAct_9fa48("4975") ? {} : (stryCov_9fa48("4975"), {
    value: stryMutAct_9fa48("4976") ? "" : (stryCov_9fa48("4976"), 'assigned'),
    label: stryMutAct_9fa48("4977") ? "" : (stryCov_9fa48("4977"), 'workOrders.statuses.assigned')
  }), stryMutAct_9fa48("4978") ? {} : (stryCov_9fa48("4978"), {
    value: stryMutAct_9fa48("4979") ? "" : (stryCov_9fa48("4979"), 'in_progress'),
    label: stryMutAct_9fa48("4980") ? "" : (stryCov_9fa48("4980"), 'workOrders.statuses.inProgress')
  }), stryMutAct_9fa48("4981") ? {} : (stryCov_9fa48("4981"), {
    value: stryMutAct_9fa48("4982") ? "" : (stryCov_9fa48("4982"), 'completed'),
    label: stryMutAct_9fa48("4983") ? "" : (stryCov_9fa48("4983"), 'workOrders.statuses.completed')
  })]);
  readonly resource = httpResource<PaginatedResponse<WorkOrder>>(stryMutAct_9fa48("4984") ? () => undefined : (stryCov_9fa48("4984"), () => stryMutAct_9fa48("4985") ? {} : (stryCov_9fa48("4985"), {
    url: stryMutAct_9fa48("4986") ? "" : (stryCov_9fa48("4986"), '/api/work-orders'),
    params: stryMutAct_9fa48("4987") ? {} : (stryCov_9fa48("4987"), {
      page: 1,
      limit: 50,
      sortBy: stryMutAct_9fa48("4988") ? "" : (stryCov_9fa48("4988"), 'scheduledDate'),
      order: stryMutAct_9fa48("4989") ? "" : (stryCov_9fa48("4989"), 'ASC'),
      ...(this.activeFilter() ? stryMutAct_9fa48("4990") ? {} : (stryCov_9fa48("4990"), {
        status: this.activeFilter()!
      }) : {})
    })
  })));
  getStatusColor(status: string): string {
    if (stryMutAct_9fa48("4991")) {
      {}
    } else {
      stryCov_9fa48("4991");
      return stryMutAct_9fa48("4994") ? STATUS_COLORS[status] && 'bg-gray-500/15 text-gray-400' : stryMutAct_9fa48("4993") ? false : stryMutAct_9fa48("4992") ? true : (stryCov_9fa48("4992", "4993", "4994"), STATUS_COLORS[status] || (stryMutAct_9fa48("4995") ? "" : (stryCov_9fa48("4995"), 'bg-gray-500/15 text-gray-400')));
    }
  }
  setFilter(value: string | null): void {
    if (stryMutAct_9fa48("4996")) {
      {}
    } else {
      stryCov_9fa48("4996");
      this.activeFilter.set(value);
      this.resource.reload();
    }
  }
  getCompletedTasks(order: WorkOrder): number {
    if (stryMutAct_9fa48("4997")) {
      {}
    } else {
      stryCov_9fa48("4997");
      return stryMutAct_9fa48("5000") ? order.tasks?.filter(t => t.isCompleted).length && 0 : stryMutAct_9fa48("4999") ? false : stryMutAct_9fa48("4998") ? true : (stryCov_9fa48("4998", "4999", "5000"), (stryMutAct_9fa48("5002") ? order.tasks.filter(t => t.isCompleted).length : stryMutAct_9fa48("5001") ? order.tasks.length : (stryCov_9fa48("5001", "5002"), order.tasks?.filter(stryMutAct_9fa48("5003") ? () => undefined : (stryCov_9fa48("5003"), t => t.isCompleted)).length)) || 0);
    }
  }
  getTaskProgress(order: WorkOrder): number {
    if (stryMutAct_9fa48("5004")) {
      {}
    } else {
      stryCov_9fa48("5004");
      if (stryMutAct_9fa48("5007") ? !order.tasks && order.tasks.length === 0 : stryMutAct_9fa48("5006") ? false : stryMutAct_9fa48("5005") ? true : (stryCov_9fa48("5005", "5006", "5007"), (stryMutAct_9fa48("5008") ? order.tasks : (stryCov_9fa48("5008"), !order.tasks)) || (stryMutAct_9fa48("5010") ? order.tasks.length !== 0 : stryMutAct_9fa48("5009") ? false : (stryCov_9fa48("5009", "5010"), order.tasks.length === 0)))) return 0;
      return stryMutAct_9fa48("5011") ? this.getCompletedTasks(order) / order.tasks.length / 100 : (stryCov_9fa48("5011"), (stryMutAct_9fa48("5012") ? this.getCompletedTasks(order) * order.tasks.length : (stryCov_9fa48("5012"), this.getCompletedTasks(order) / order.tasks.length)) * 100);
    }
  }
  viewDetail(order: WorkOrder): void {
    if (stryMutAct_9fa48("5013")) {
      {}
    } else {
      stryCov_9fa48("5013");
      this.router.navigate(stryMutAct_9fa48("5014") ? [] : (stryCov_9fa48("5014"), [stryMutAct_9fa48("5015") ? "" : (stryCov_9fa48("5015"), '/tech'), order.id]));
    }
  }
}