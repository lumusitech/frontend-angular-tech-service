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
import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';
@Component({
  selector: 'app-seller-dashboard',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ authService.user()?.name }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Comisión: {{ authService.user()?.commission ?? 5 }}%
        </p>
      </div>

      @if (ordersResource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
        </div>
      } @else if (ordersResource.value(); as result) {
        @let orders = result.data;

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ orders.length }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Órdenes totales</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p class="text-2xl font-bold text-yellow-600">{{ pendingCount() }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Pendientes</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p class="text-2xl font-bold text-blue-600">{{ inProgressCount() }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">En progreso</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p class="text-2xl font-bold text-green-600">{{ completedCount() }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Completadas</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Órdenes recientes</h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            @for (order of orders.slice(0, 5); track order.id) {
              <a [routerLink]="['/seller/orders']"
                 class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ order.trackingCode }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ order.client.name }}</p>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                      [class]="statusClass(order.status)">
                  {{ order.status }}
                </span>
              </a>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class SellerDashboardComponent {
  readonly authService = inject(AuthService);
  private readonly sellerId = computed(stryMutAct_9fa48("4083") ? () => undefined : (stryCov_9fa48("4083"), () => stryMutAct_9fa48("4084") ? this.authService.user().id : (stryCov_9fa48("4084"), this.authService.user()?.id)));
  readonly ordersResource = httpResource<PaginatedResponse<WorkOrder>>(stryMutAct_9fa48("4085") ? () => undefined : (stryCov_9fa48("4085"), () => this.sellerId() ? stryMutAct_9fa48("4086") ? `` : (stryCov_9fa48("4086"), `/api/work-orders?sellerId=${this.sellerId()}&limit=100`) : undefined));
  readonly pendingCount = computed(stryMutAct_9fa48("4087") ? () => undefined : (stryCov_9fa48("4087"), () => stryMutAct_9fa48("4088") ? this.ordersResource.value()?.data.filter(o => o.status === 'pending' || o.status === 'assigned').length && 0 : (stryCov_9fa48("4088"), (stryMutAct_9fa48("4090") ? this.ordersResource.value().data.filter(o => o.status === 'pending' || o.status === 'assigned').length : stryMutAct_9fa48("4089") ? this.ordersResource.value()?.data.length : (stryCov_9fa48("4089", "4090"), this.ordersResource.value()?.data.filter(stryMutAct_9fa48("4091") ? () => undefined : (stryCov_9fa48("4091"), o => stryMutAct_9fa48("4094") ? o.status === 'pending' && o.status === 'assigned' : stryMutAct_9fa48("4093") ? false : stryMutAct_9fa48("4092") ? true : (stryCov_9fa48("4092", "4093", "4094"), (stryMutAct_9fa48("4096") ? o.status !== 'pending' : stryMutAct_9fa48("4095") ? false : (stryCov_9fa48("4095", "4096"), o.status === (stryMutAct_9fa48("4097") ? "" : (stryCov_9fa48("4097"), 'pending')))) || (stryMutAct_9fa48("4099") ? o.status !== 'assigned' : stryMutAct_9fa48("4098") ? false : (stryCov_9fa48("4098", "4099"), o.status === (stryMutAct_9fa48("4100") ? "" : (stryCov_9fa48("4100"), 'assigned'))))))).length)) ?? 0)));
  readonly inProgressCount = computed(stryMutAct_9fa48("4101") ? () => undefined : (stryCov_9fa48("4101"), () => stryMutAct_9fa48("4102") ? this.ordersResource.value()?.data.filter(o => o.status === 'in_progress').length && 0 : (stryCov_9fa48("4102"), (stryMutAct_9fa48("4104") ? this.ordersResource.value().data.filter(o => o.status === 'in_progress').length : stryMutAct_9fa48("4103") ? this.ordersResource.value()?.data.length : (stryCov_9fa48("4103", "4104"), this.ordersResource.value()?.data.filter(stryMutAct_9fa48("4105") ? () => undefined : (stryCov_9fa48("4105"), o => stryMutAct_9fa48("4108") ? o.status !== 'in_progress' : stryMutAct_9fa48("4107") ? false : stryMutAct_9fa48("4106") ? true : (stryCov_9fa48("4106", "4107", "4108"), o.status === (stryMutAct_9fa48("4109") ? "" : (stryCov_9fa48("4109"), 'in_progress'))))).length)) ?? 0)));
  readonly completedCount = computed(stryMutAct_9fa48("4110") ? () => undefined : (stryCov_9fa48("4110"), () => stryMutAct_9fa48("4111") ? this.ordersResource.value()?.data.filter(o => o.status === 'completed' || o.status === 'delivered').length && 0 : (stryCov_9fa48("4111"), (stryMutAct_9fa48("4113") ? this.ordersResource.value().data.filter(o => o.status === 'completed' || o.status === 'delivered').length : stryMutAct_9fa48("4112") ? this.ordersResource.value()?.data.length : (stryCov_9fa48("4112", "4113"), this.ordersResource.value()?.data.filter(stryMutAct_9fa48("4114") ? () => undefined : (stryCov_9fa48("4114"), o => stryMutAct_9fa48("4117") ? o.status === 'completed' && o.status === 'delivered' : stryMutAct_9fa48("4116") ? false : stryMutAct_9fa48("4115") ? true : (stryCov_9fa48("4115", "4116", "4117"), (stryMutAct_9fa48("4119") ? o.status !== 'completed' : stryMutAct_9fa48("4118") ? false : (stryCov_9fa48("4118", "4119"), o.status === (stryMutAct_9fa48("4120") ? "" : (stryCov_9fa48("4120"), 'completed')))) || (stryMutAct_9fa48("4122") ? o.status !== 'delivered' : stryMutAct_9fa48("4121") ? false : (stryCov_9fa48("4121", "4122"), o.status === (stryMutAct_9fa48("4123") ? "" : (stryCov_9fa48("4123"), 'delivered'))))))).length)) ?? 0)));
  statusClass(status: string): string {
    if (stryMutAct_9fa48("4124")) {
      {}
    } else {
      stryCov_9fa48("4124");
      const map: Record<string, string> = stryMutAct_9fa48("4125") ? {} : (stryCov_9fa48("4125"), {
        pending: stryMutAct_9fa48("4126") ? "" : (stryCov_9fa48("4126"), 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'),
        assigned: stryMutAct_9fa48("4127") ? "" : (stryCov_9fa48("4127"), 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'),
        in_progress: stryMutAct_9fa48("4128") ? "" : (stryCov_9fa48("4128"), 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'),
        completed: stryMutAct_9fa48("4129") ? "" : (stryCov_9fa48("4129"), 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'),
        delivered: stryMutAct_9fa48("4130") ? "" : (stryCov_9fa48("4130"), 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'),
        cancelled: stryMutAct_9fa48("4131") ? "" : (stryCov_9fa48("4131"), 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'),
        postponed: stryMutAct_9fa48("4132") ? "" : (stryCov_9fa48("4132"), 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300')
      });
      return stryMutAct_9fa48("4135") ? map[status] && 'bg-gray-100 text-gray-800' : stryMutAct_9fa48("4134") ? false : stryMutAct_9fa48("4133") ? true : (stryCov_9fa48("4133", "4134", "4135"), map[status] || (stryMutAct_9fa48("4136") ? "" : (stryCov_9fa48("4136"), 'bg-gray-100 text-gray-800')));
    }
  }
}