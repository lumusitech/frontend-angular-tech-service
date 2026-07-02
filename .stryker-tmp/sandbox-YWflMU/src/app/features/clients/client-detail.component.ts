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
import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Client } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DatePipe } from '@angular/common';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-client-detail',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, StatusBadgeComponent, ErrorStateComponent, TrackingCodeComponent, TranslatePipe, DatePipe, RelativeDatePipe],
  template: `
    @if (clientResource.status() === 'loading' && !clientResource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (clientResource.error()) {
      <app-error-state
        [title]="'clients.detail.loadError' | translate"
        [message]="'clients.detail.loadErrorMessage' | translate"
        (retry)="clientResource.reload()"
      />
    } @else if (clientResource.hasValue()) {
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ clientResource.value().name }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'clients.detail.subtitle' | translate }}
            </p>
          </div>
          <button mat-stroked-button (click)="viewReport()" class="!text-blue-600 dark:!text-blue-400 !border-blue-200 dark:!border-blue-800">
            <mat-icon>assessment</mat-icon>
            {{ 'clients.detail.viewReport' | translate }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {{ 'clients.detail.clientInfo' | translate }}
              </h2>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'clients.name' | translate }}</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ clientResource.value().name }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'clients.email' | translate }}</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ clientResource.value().email }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'clients.phone' | translate }}</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ clientResource.value().phone }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'common.address' | translate }}</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ clientResource.value().address }}</dd>
                </div>
                @if (clientResource.value().cuit) {
                  <div>
                    <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'clients.cuit' | translate }}</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ clientResource.value().cuit }}</dd>
                  </div>
                }
                @if (clientResource.value().ivaCondition) {
                  <div>
                    <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'clients.ivaCondition' | translate }}</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {{ 'clients.ivaConditions.' + clientResource.value().ivaCondition! | translate }}
                    </dd>
                  </div>
                }
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'common.status' | translate }}</dt>
                  <dd class="mt-1">
                    <app-status-badge [value]="clientResource.value().isActive" type="activeInactive" />
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ 'common.created' | translate }}</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ clientResource.value().createdAt | relativeDate }}
                  </dd>
                </div>
              </dl>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {{ 'clients.detail.workOrders' | translate }}
              </h2>

              @if (workOrdersResource.isLoading()) {
                <div class="flex justify-center py-6">
                  <mat-spinner diameter="32" />
                </div>
              } @else if (workOrdersResource.hasValue() && workOrdersResource.value().data.length === 0) {
                <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                  {{ 'clients.detail.noOrdersMessage' | translate }}
                </p>
              } @else if (workOrdersResource.hasValue()) {
                <table mat-table [dataSource]="workOrdersResource.value().data" class="w-full">
                  <ng-container matColumnDef="trackingCode">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'workOrders.trackingCode' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3">
                      <a [routerLink]="['/admin/work-orders', order.id]" class="text-blue-600 dark:text-blue-400 hover:underline">
                        <app-tracking-code [code]="order.trackingCode" />
                      </a>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'common.status' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3">
                      <app-status-badge [value]="order.status" type="workOrderStatus" />
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="priority">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'workOrders.priority' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3">
                      <app-status-badge [value]="order.priority" type="workOrderPriority" />
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="serviceType">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'workOrders.serviceType' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {{ order.serviceType.name }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="scheduledDate">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'workOrders.scheduledDate' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      @if (order.scheduledDate) {
                        {{ order.scheduledDate | date: 'dd/MM/yyyy' }}
                      } @else {
                        <span class="text-gray-400">—</span>
                      }
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="createdAt">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'common.created' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {{ order.createdAt | relativeDate }}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns" [routerLink]="['/admin/work-orders', row.id]" class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"></tr>
                </table>
              }
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {{ 'clients.detail.kpis' | translate }}
              </h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ 'clients.detail.totalOrders' | translate }}</span>
                  <span class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ totalOrders() }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ 'clients.detail.completedOrders' | translate }}</span>
                  <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ completedOrders() }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ 'clients.detail.pendingOrders' | translate }}</span>
                  <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">{{ pendingOrders() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly clientId = signal(stryMutAct_9fa48("1730") ? this.route.snapshot.paramMap.get('id') && '' : stryMutAct_9fa48("1729") ? false : stryMutAct_9fa48("1728") ? true : (stryCov_9fa48("1728", "1729", "1730"), this.route.snapshot.paramMap.get(stryMutAct_9fa48("1731") ? "" : (stryCov_9fa48("1731"), 'id')) || (stryMutAct_9fa48("1732") ? "Stryker was here!" : (stryCov_9fa48("1732"), ''))));
  readonly clientResource = httpResource<Client>(stryMutAct_9fa48("1733") ? () => undefined : (stryCov_9fa48("1733"), () => stryMutAct_9fa48("1734") ? {} : (stryCov_9fa48("1734"), {
    url: stryMutAct_9fa48("1735") ? `` : (stryCov_9fa48("1735"), `/api/clients/${this.clientId()}`)
  })));
  readonly workOrdersResource = httpResource<PaginatedResponse<WorkOrder>>(stryMutAct_9fa48("1736") ? () => undefined : (stryCov_9fa48("1736"), () => stryMutAct_9fa48("1737") ? {} : (stryCov_9fa48("1737"), {
    url: stryMutAct_9fa48("1738") ? "" : (stryCov_9fa48("1738"), '/api/work-orders'),
    params: stryMutAct_9fa48("1739") ? {} : (stryCov_9fa48("1739"), {
      clientId: this.clientId(),
      limit: 50
    })
  })));
  readonly totalOrders = computed(stryMutAct_9fa48("1740") ? () => undefined : (stryCov_9fa48("1740"), () => stryMutAct_9fa48("1743") ? this.workOrdersResource.value()?.total && 0 : stryMutAct_9fa48("1742") ? false : stryMutAct_9fa48("1741") ? true : (stryCov_9fa48("1741", "1742", "1743"), (stryMutAct_9fa48("1744") ? this.workOrdersResource.value().total : (stryCov_9fa48("1744"), this.workOrdersResource.value()?.total)) || 0)));
  readonly completedOrders = computed(stryMutAct_9fa48("1745") ? () => undefined : (stryCov_9fa48("1745"), () => stryMutAct_9fa48("1748") ? this.workOrdersResource.value()?.data.filter(o => o.status === 'completed' || o.status === 'delivered').length && 0 : stryMutAct_9fa48("1747") ? false : stryMutAct_9fa48("1746") ? true : (stryCov_9fa48("1746", "1747", "1748"), (stryMutAct_9fa48("1750") ? this.workOrdersResource.value().data.filter(o => o.status === 'completed' || o.status === 'delivered').length : stryMutAct_9fa48("1749") ? this.workOrdersResource.value()?.data.length : (stryCov_9fa48("1749", "1750"), this.workOrdersResource.value()?.data.filter(stryMutAct_9fa48("1751") ? () => undefined : (stryCov_9fa48("1751"), o => stryMutAct_9fa48("1754") ? o.status === 'completed' && o.status === 'delivered' : stryMutAct_9fa48("1753") ? false : stryMutAct_9fa48("1752") ? true : (stryCov_9fa48("1752", "1753", "1754"), (stryMutAct_9fa48("1756") ? o.status !== 'completed' : stryMutAct_9fa48("1755") ? false : (stryCov_9fa48("1755", "1756"), o.status === (stryMutAct_9fa48("1757") ? "" : (stryCov_9fa48("1757"), 'completed')))) || (stryMutAct_9fa48("1759") ? o.status !== 'delivered' : stryMutAct_9fa48("1758") ? false : (stryCov_9fa48("1758", "1759"), o.status === (stryMutAct_9fa48("1760") ? "" : (stryCov_9fa48("1760"), 'delivered'))))))).length)) || 0)));
  readonly pendingOrders = computed(stryMutAct_9fa48("1761") ? () => undefined : (stryCov_9fa48("1761"), () => stryMutAct_9fa48("1764") ? this.workOrdersResource.value()?.data.filter(o => o.status === 'pending' || o.status === 'assigned' || o.status === 'in_progress').length && 0 : stryMutAct_9fa48("1763") ? false : stryMutAct_9fa48("1762") ? true : (stryCov_9fa48("1762", "1763", "1764"), (stryMutAct_9fa48("1766") ? this.workOrdersResource.value().data.filter(o => o.status === 'pending' || o.status === 'assigned' || o.status === 'in_progress').length : stryMutAct_9fa48("1765") ? this.workOrdersResource.value()?.data.length : (stryCov_9fa48("1765", "1766"), this.workOrdersResource.value()?.data.filter(stryMutAct_9fa48("1767") ? () => undefined : (stryCov_9fa48("1767"), o => stryMutAct_9fa48("1770") ? (o.status === 'pending' || o.status === 'assigned') && o.status === 'in_progress' : stryMutAct_9fa48("1769") ? false : stryMutAct_9fa48("1768") ? true : (stryCov_9fa48("1768", "1769", "1770"), (stryMutAct_9fa48("1772") ? o.status === 'pending' && o.status === 'assigned' : stryMutAct_9fa48("1771") ? false : (stryCov_9fa48("1771", "1772"), (stryMutAct_9fa48("1774") ? o.status !== 'pending' : stryMutAct_9fa48("1773") ? false : (stryCov_9fa48("1773", "1774"), o.status === (stryMutAct_9fa48("1775") ? "" : (stryCov_9fa48("1775"), 'pending')))) || (stryMutAct_9fa48("1777") ? o.status !== 'assigned' : stryMutAct_9fa48("1776") ? false : (stryCov_9fa48("1776", "1777"), o.status === (stryMutAct_9fa48("1778") ? "" : (stryCov_9fa48("1778"), 'assigned')))))) || (stryMutAct_9fa48("1780") ? o.status !== 'in_progress' : stryMutAct_9fa48("1779") ? false : (stryCov_9fa48("1779", "1780"), o.status === (stryMutAct_9fa48("1781") ? "" : (stryCov_9fa48("1781"), 'in_progress'))))))).length)) || 0)));
  readonly displayedColumns = stryMutAct_9fa48("1782") ? [] : (stryCov_9fa48("1782"), [stryMutAct_9fa48("1783") ? "" : (stryCov_9fa48("1783"), 'trackingCode'), stryMutAct_9fa48("1784") ? "" : (stryCov_9fa48("1784"), 'status'), stryMutAct_9fa48("1785") ? "" : (stryCov_9fa48("1785"), 'priority'), stryMutAct_9fa48("1786") ? "" : (stryCov_9fa48("1786"), 'serviceType'), stryMutAct_9fa48("1787") ? "" : (stryCov_9fa48("1787"), 'scheduledDate'), stryMutAct_9fa48("1788") ? "" : (stryCov_9fa48("1788"), 'createdAt')]);
  goBack(): void {
    if (stryMutAct_9fa48("1789")) {
      {}
    } else {
      stryCov_9fa48("1789");
      this.router.navigate(stryMutAct_9fa48("1790") ? [] : (stryCov_9fa48("1790"), [stryMutAct_9fa48("1791") ? "" : (stryCov_9fa48("1791"), '/admin/clients')]));
    }
  }
  viewReport(): void {
    if (stryMutAct_9fa48("1792")) {
      {}
    } else {
      stryCov_9fa48("1792");
      this.router.navigate(stryMutAct_9fa48("1793") ? [] : (stryCov_9fa48("1793"), [stryMutAct_9fa48("1794") ? "" : (stryCov_9fa48("1794"), '/admin/reports/clients'), this.clientId()]));
    }
  }
}