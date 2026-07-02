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
import { Component, inject, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';
@Component({
  selector: 'app-seller-work-orders',
  imports: [MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">Órdenes</h1>
      </div>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
        </div>
      } @else if (resource.value(); as result) {
        @let orders = result.data;

        @if (orders.length === 0) {
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No hay órdenes asignadas</p>
          </div>
        }

        <div class="space-y-3">
          @for (order of orders; track order.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">{{ order.trackingCode }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                      [class]="statusClass(order.status)">{{ order.status }}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ order.client.name }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ order.serviceType.name }}</p>
              @if (order.commissionPercent != null) {
                <p class="text-xs text-green-600 dark:text-green-400 mt-1">
                  Comisión: {{ order.commissionPercent }}%
                </p>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SellerWorkOrdersComponent {
  private readonly authService = inject(AuthService);
  private readonly sellerId = computed(stryMutAct_9fa48("4137") ? () => undefined : (stryCov_9fa48("4137"), () => stryMutAct_9fa48("4138") ? this.authService.user().id : (stryCov_9fa48("4138"), this.authService.user()?.id)));
  readonly resource = httpResource<PaginatedResponse<WorkOrder>>(stryMutAct_9fa48("4139") ? () => undefined : (stryCov_9fa48("4139"), () => this.sellerId() ? stryMutAct_9fa48("4140") ? `` : (stryCov_9fa48("4140"), `/api/work-orders?sellerId=${this.sellerId()}&limit=50`) : undefined));
  statusClass(status: string): string {
    if (stryMutAct_9fa48("4141")) {
      {}
    } else {
      stryCov_9fa48("4141");
      const map: Record<string, string> = stryMutAct_9fa48("4142") ? {} : (stryCov_9fa48("4142"), {
        pending: stryMutAct_9fa48("4143") ? "" : (stryCov_9fa48("4143"), 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'),
        assigned: stryMutAct_9fa48("4144") ? "" : (stryCov_9fa48("4144"), 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'),
        in_progress: stryMutAct_9fa48("4145") ? "" : (stryCov_9fa48("4145"), 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'),
        completed: stryMutAct_9fa48("4146") ? "" : (stryCov_9fa48("4146"), 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'),
        delivered: stryMutAct_9fa48("4147") ? "" : (stryCov_9fa48("4147"), 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'),
        cancelled: stryMutAct_9fa48("4148") ? "" : (stryCov_9fa48("4148"), 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'),
        postponed: stryMutAct_9fa48("4149") ? "" : (stryCov_9fa48("4149"), 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300')
      });
      return stryMutAct_9fa48("4152") ? map[status] && 'bg-gray-100 text-gray-800' : stryMutAct_9fa48("4151") ? false : stryMutAct_9fa48("4150") ? true : (stryCov_9fa48("4150", "4151", "4152"), map[status] || (stryMutAct_9fa48("4153") ? "" : (stryCov_9fa48("4153"), 'bg-gray-100 text-gray-800')));
    }
  }
}