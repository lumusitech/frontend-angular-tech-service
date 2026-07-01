import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClientReport } from '../../core/models/report.interfaces';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { ExportButtonsComponent } from '../../shared/components/export-buttons/export-buttons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-client-report',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    StatusBadgeComponent,
    ErrorStateComponent,
    TrackingCodeComponent,
    TranslatePipe,
    CurrencyArsPipe,
    RelativeDatePipe,
    ExportButtonsComponent,
  ],
  template: `
    @if (loading()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (error()) {
      <app-error-state
        [title]="'reports.clientReport.loadError' | translate"
        [message]="'reports.clientReport.loadErrorMessage' | translate"
        (retry)="loadData()"
      />
    } @else if (report(); as rpt) {
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ rpt.client.name }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ rpt.client.email }} · {{ rpt.client.phone }}
            </p>
          </div>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-primary)'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.clientReport.totalOrders' | translate }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{{ rpt.kpis.totalWorkOrders }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-secondary)'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.clientReport.totalSpent' | translate }}</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ rpt.kpis.totalSpent | currencyArs: '1.0-0' }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'#EF4444'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.clientReport.outstandingDebt' | translate }}</p>
            <p class="text-2xl font-bold" [class]="rpt.kpis.outstandingDebt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
              {{ rpt.kpis.outstandingDebt | currencyArs: '1.0-0' }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-primary)'">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.clientReport.avgTicket' | translate }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{{ rpt.kpis.averageTicket | currencyArs: '1.0-0' }}</p>
          </div>
        </div>

        <!-- Tabs: Orders / Payments -->
        <mat-tab-group>
          <mat-tab [label]="'reports.clientReport.orders' | translate">
            <div class="py-4">
              @if (rpt.workOrders.length === 0) {
                <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                  {{ 'reports.clientReport.noOrders' | translate }}
                </p>
              } @else {
                <table mat-table [dataSource]="rpt.workOrders" class="w-full">
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

                  <ng-container matColumnDef="createdAt">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'common.created' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {{ order.createdAt | relativeDate }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="totalPaid">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'reports.clientReport.totalPaid' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                      {{ order.totalPaid | currencyArs: '1.0-0' }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="orderActions">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'common.actions' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3 text-right">
                      <app-export-buttons [workOrderId]="order.id" />
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="orderColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: orderColumns" class="hover:bg-gray-50 dark:hover:bg-gray-700/50"></tr>
                </table>
              }
            </div>
          </mat-tab>

          <mat-tab [label]="'reports.clientReport.payments' | translate">
            <div class="py-4">
              @if (rpt.paymentHistory.length === 0) {
                <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                  {{ 'reports.clientReport.noPayments' | translate }}
                </p>
              } @else {
                <table mat-table [dataSource]="rpt.paymentHistory" class="w-full">
                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'payments.amount' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let payment" class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {{ payment.amount | currencyArs: '1.0-0' }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="method">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'payments.method' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {{ payment.method }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'common.status' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let payment" class="px-4 py-3">
                      <app-status-badge [value]="payment.status" type="paymentStatus" />
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="paidAt">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'reports.clientReport.paidAt' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {{ payment.paidAt | relativeDate }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="trackingCode">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'workOrders.trackingCode' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {{ payment.trackingCode }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="paymentActions">
                    <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'common.actions' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-right">
                      <app-export-buttons [paymentId]="payment.id" />
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="paymentColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: paymentColumns" class="hover:bg-gray-50 dark:hover:bg-gray-700/50"></tr>
                </table>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    }
  `,
})
export class ClientReportComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  readonly clientId = signal(this.route.snapshot.paramMap.get('id') || '');
  readonly report = signal<ClientReport | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly orderColumns = ['trackingCode', 'serviceType', 'status', 'createdAt', 'totalPaid', 'orderActions'];
  readonly paymentColumns = ['amount', 'method', 'status', 'paidAt', 'trackingCode', 'paymentActions'];

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(false);
    this.http.get<ClientReport>(`/api/reports/clients/${this.clientId()}`).subscribe({
      next: (data) => {
        this.report.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/reports']);
  }
}
