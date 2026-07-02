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
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TechnicianDetail } from '../../core/models/report.interfaces';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { DecimalPipe } from '@angular/common';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { ExportButtonsComponent } from '../../shared/components/export-buttons/export-buttons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-technician-detail',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, StatusBadgeComponent, ErrorStateComponent, TrackingCodeComponent, TranslatePipe, CurrencyArsPipe, DecimalPipe, RelativeDatePipe, ExportButtonsComponent],
  template: `
    @if (loading()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (error()) {
      <app-error-state
        [title]="'reports.technicianDetail.loadError' | translate"
        [message]="'reports.technicianDetail.loadErrorMessage' | translate"
        (retry)="loadData()"
      />
    } @else if (technician(); as tech) {
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ tech.name }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'reports.technicianDetail.subtitle' | translate }}
            </p>
          </div>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-primary)'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.technicianDetail.completedOrders' | translate }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{{ tech.completedOrders }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'#F59E0B'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.technicianDetail.inProgressOrders' | translate }}</p>
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{{ tech.inProgressOrders }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-secondary)'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.technicianDetail.avgResolution' | translate }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{{ tech.averageResolutionDays | number: '1.1-1' }}d</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-primary)'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.technicianDetail.totalRevenue' | translate }}</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ tech.totalRevenue | currencyArs: '1.0-0' }}</p>
          </div>
        </div>

        <!-- Recent orders -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ 'reports.technicianDetail.recentOrders' | translate }}
          </h2>

          @if (tech.recentOrders.length === 0) {
            <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              {{ 'reports.technicianDetail.noOrders' | translate }}
            </p>
          } @else {
            <table mat-table [dataSource]="tech.recentOrders" class="w-full">
              <ng-container matColumnDef="trackingCode">
                <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {{ 'workOrders.trackingCode' | translate }}
                </th>
                <td mat-cell *matCellDef="let order" class="px-4 py-3">
                  <app-tracking-code [code]="order.trackingCode" />
                </td>
              </ng-container>

              <ng-container matColumnDef="serviceType">
                <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {{ 'workOrders.serviceType' | translate }}
                </th>
                <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {{ order.serviceTypeName }}
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

              <ng-container matColumnDef="completedAt">
                <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {{ 'reports.technicianDetail.completedAt' | translate }}
                </th>
                <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  @if (order.completedAt) {
                    {{ order.completedAt | relativeDate }}
                  } @else {
                    <span class="text-gray-400">—</span>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {{ 'common.actions' | translate }}
                </th>
                <td mat-cell *matCellDef="let order" class="px-4 py-3 text-right">
                  <app-export-buttons [workOrderId]="order.id" />
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          }
        </div>
      </div>
    }
  `
})
export class TechnicianDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly http = inject(HttpClient);
  readonly technicianId = signal(stryMutAct_9fa48("4060") ? this.route.snapshot.paramMap.get('id') && '' : stryMutAct_9fa48("4059") ? false : stryMutAct_9fa48("4058") ? true : (stryCov_9fa48("4058", "4059", "4060"), this.route.snapshot.paramMap.get(stryMutAct_9fa48("4061") ? "" : (stryCov_9fa48("4061"), 'id')) || (stryMutAct_9fa48("4062") ? "Stryker was here!" : (stryCov_9fa48("4062"), ''))));
  readonly technician = signal<TechnicianDetail | null>(null);
  readonly loading = signal(stryMutAct_9fa48("4063") ? false : (stryCov_9fa48("4063"), true));
  readonly error = signal(stryMutAct_9fa48("4064") ? true : (stryCov_9fa48("4064"), false));
  readonly displayedColumns = stryMutAct_9fa48("4065") ? [] : (stryCov_9fa48("4065"), [stryMutAct_9fa48("4066") ? "" : (stryCov_9fa48("4066"), 'trackingCode'), stryMutAct_9fa48("4067") ? "" : (stryCov_9fa48("4067"), 'serviceType'), stryMutAct_9fa48("4068") ? "" : (stryCov_9fa48("4068"), 'status'), stryMutAct_9fa48("4069") ? "" : (stryCov_9fa48("4069"), 'completedAt'), stryMutAct_9fa48("4070") ? "" : (stryCov_9fa48("4070"), 'actions')]);
  constructor() {
    if (stryMutAct_9fa48("4071")) {
      {}
    } else {
      stryCov_9fa48("4071");
      this.loadData();
    }
  }
  loadData(): void {
    if (stryMutAct_9fa48("4072")) {
      {}
    } else {
      stryCov_9fa48("4072");
      this.loading.set(stryMutAct_9fa48("4073") ? false : (stryCov_9fa48("4073"), true));
      this.error.set(stryMutAct_9fa48("4074") ? true : (stryCov_9fa48("4074"), false));
      this.http.get<TechnicianDetail>(stryMutAct_9fa48("4075") ? `` : (stryCov_9fa48("4075"), `/api/reports/technicians/${this.technicianId()}`)).subscribe(stryMutAct_9fa48("4076") ? {} : (stryCov_9fa48("4076"), {
        next: data => {
          if (stryMutAct_9fa48("4077")) {
            {}
          } else {
            stryCov_9fa48("4077");
            this.technician.set(data);
            this.loading.set(stryMutAct_9fa48("4078") ? true : (stryCov_9fa48("4078"), false));
          }
        },
        error: () => {
          if (stryMutAct_9fa48("4079")) {
            {}
          } else {
            stryCov_9fa48("4079");
            this.loading.set(stryMutAct_9fa48("4080") ? true : (stryCov_9fa48("4080"), false));
            this.error.set(stryMutAct_9fa48("4081") ? false : (stryCov_9fa48("4081"), true));
          }
        }
      }));
    }
  }
  goBack(): void {
    if (stryMutAct_9fa48("4082")) {
      {}
    } else {
      stryCov_9fa48("4082");
      this.location.back();
    }
  }
}