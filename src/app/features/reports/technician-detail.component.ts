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
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    StatusBadgeComponent,
    ErrorStateComponent,
    TrackingCodeComponent,
    TranslatePipe,
    CurrencyArsPipe,
    DecimalPipe,
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
  `,
})
export class TechnicianDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly http = inject(HttpClient);

  readonly technicianId = signal(this.route.snapshot.paramMap.get('id') || '');
  readonly technician = signal<TechnicianDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly displayedColumns = ['trackingCode', 'serviceType', 'status', 'completedAt', 'actions'];

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(false);
    this.http.get<TechnicianDetail>(`/api/reports/technicians/${this.technicianId()}`).subscribe({
      next: (data) => {
        this.technician.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
