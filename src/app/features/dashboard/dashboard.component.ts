import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DashboardService } from '../../core/services/dashboard.service';
import {
  DashboardLayoutService,
  DashboardWidgetId,
} from '../../core/services/dashboard-layout.service';
import {
  DashboardSummary,
  PendingItemSummary,
  InquirySummary,
  PaginatedResponse,
} from '../../core/models/dashboard.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ErrorStateComponent,
    CurrencyPipe,
    DatePipe,
    SlicePipe,
    BaseChartDirective,
    DragDropModule,
    TranslatePipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ 'dashboard.title' | translate }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ 'dashboard.subtitle' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            mat-icon-button
            (click)="editMode.set(!editMode())"
            [color]="editMode() ? 'primary' : undefined"
            title="Reordenar widgets"
          >
            <mat-icon>{{ editMode() ? 'check' : 'tune' }}</mat-icon>
          </button>
          @if (editMode()) {
            <button mat-button (click)="layoutService.reset()">
              <mat-icon>restart_alt</mat-icon>
              Reset
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (loadError()) {
        <app-error-state (retry)="loadSummary()" />
      } @else if (summary()) {
        <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="space-y-6">
          @for (widgetId of layoutService.layout(); track widgetId) {
            @if (layoutService.widgets()[widgetId]) {
              <div cdkDrag [cdkDragData]="widgetId" [cdkDragDisabled]="!editMode()">
                @if (editMode()) {
                  <div
                    cdkDragHandle
                    class="cursor-grab active:cursor-grabbing p-1 text-gray-400 dark:text-gray-500"
                  >
                    <mat-icon>drag_indicator</mat-icon>
                  </div>
                }
                @switch (widgetId) {
                  @case ('kpis') {
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ 'dashboard.totalOrders' | translate }}
                            </p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                              {{ summary()!.kpis.workOrderCount }}
                            </p>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {{ summary()!.kpis.completedCount }}
                              {{ 'dashboard.completed' | translate }}
                            </p>
                          </div>
                          <div
                            class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"
                          >
                            <mat-icon class="text-blue-600 dark:text-blue-400">assignment</mat-icon>
                          </div>
                        </div>
                      </div>

                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ 'dashboard.totalIncome' | translate }}
                            </p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                              {{
                                summary()!.kpis.totalIncome | currency: 'ARS' : 'symbol' : '1.0-0'
                              }}
                            </p>
                            <p
                              class="text-xs mt-1"
                              [class.text-green-600]="summary()!.trends.incomeChange >= 0"
                              [class.text-red-600]="summary()!.trends.incomeChange < 0"
                            >
                              {{ summary()!.trends.incomeChange >= 0 ? '+' : ''
                              }}{{ summary()!.trends.incomeChange }}%
                              {{ 'dashboard.vsLastMonth' | translate }}
                            </p>
                          </div>
                          <div
                            class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center"
                          >
                            <mat-icon class="text-emerald-600 dark:text-emerald-400"
                              >payments</mat-icon
                            >
                          </div>
                        </div>
                      </div>

                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ 'dashboard.netProfit' | translate }}
                            </p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                              {{ summary()!.kpis.netProfit | currency: 'ARS' : 'symbol' : '1.0-0' }}
                            </p>
                            <p
                              class="text-xs mt-1"
                              [class.text-green-600]="summary()!.trends.profitChange >= 0"
                              [class.text-red-600]="summary()!.trends.profitChange < 0"
                            >
                              {{ summary()!.trends.profitChange >= 0 ? '+' : ''
                              }}{{ summary()!.trends.profitChange }}%
                              {{ 'dashboard.vsLastMonth' | translate }}
                            </p>
                          </div>
                          <div
                            class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center"
                          >
                            <mat-icon class="text-purple-600 dark:text-purple-400"
                              >trending_up</mat-icon
                            >
                          </div>
                        </div>
                      </div>

                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ 'dashboard.avgTicket' | translate }}
                            </p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                              {{
                                summary()!.kpis.averageTicket | currency: 'ARS' : 'symbol' : '1.0-0'
                              }}
                            </p>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {{ summary()!.kpis.completionRate }}%
                              {{ 'dashboard.completionRate' | translate }}
                            </p>
                          </div>
                          <div
                            class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center"
                          >
                            <mat-icon class="text-orange-600 dark:text-orange-400"
                              >receipt</mat-icon
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  @case ('pendingItems') {
                    @if (
                      pendingItemsResource.hasValue() &&
                      pendingItemsResource.value().data.length > 0
                    ) {
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div class="flex items-center justify-between mb-4">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {{ 'dashboard.pendingItems' | translate }}
                          </h3>
                          <button
                            mat-button
                            color="primary"
                            (click)="navigateTo('/admin/pending-items')"
                          >
                            {{ 'common.details' | translate }}
                            <mat-icon>arrow_forward</mat-icon>
                          </button>
                        </div>
                        <div class="space-y-3">
                          @for (item of pendingItemsResource.value().data; track item.id) {
                            <div
                              class="flex items-center justify-between p-3 rounded-lg border"
                              [class.border-red-200]="item.priority === 'urgent'"
                              [class.dark:border-red-800]="item.priority === 'urgent'"
                              [class.bg-red-50]="item.priority === 'urgent'"
                              [class.dark:bg-red-900/20]="item.priority === 'urgent'"
                              [class.border-orange-200]="item.priority === 'high'"
                              [class.dark:border-orange-800]="item.priority === 'high'"
                              [class.bg-orange-50]="item.priority === 'high'"
                              [class.dark:bg-orange-900/20]="item.priority === 'high'"
                              [class.border-gray-200]="
                                item.priority !== 'urgent' && item.priority !== 'high'
                              "
                              [class.dark:border-gray-700]="
                                item.priority !== 'urgent' && item.priority !== 'high'
                              "
                            >
                              <div class="flex items-center gap-3">
                                <mat-icon
                                  [class.text-red-500]="item.priority === 'urgent'"
                                  [class.text-orange-500]="item.priority === 'high'"
                                  [class.text-gray-400]="
                                    item.priority !== 'urgent' && item.priority !== 'high'
                                  "
                                >
                                  {{
                                    item.status === 'completed' ? 'check_circle' : 'pending_actions'
                                  }}
                                </mat-icon>
                                <div>
                                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {{ item.title }}
                                  </p>
                                  <p class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ 'pendingItems.dueDate' | translate }}:
                                    {{ item.dueDate | date: 'dd/MM/yyyy' }}
                                    @if (item.assignedTo) {
                                      &middot; {{ item.assignedTo.name }}
                                    }
                                  </p>
                                </div>
                              </div>
                              <span
                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                [class.bg-red-100]="item.priority === 'urgent'"
                                [class.dark:bg-red-900/30]="item.priority === 'urgent'"
                                [class.text-red-700]="item.priority === 'urgent'"
                                [class.dark:text-red-400]="item.priority === 'urgent'"
                                [class.bg-orange-100]="item.priority === 'high'"
                                [class.dark:bg-orange-900/30]="item.priority === 'high'"
                                [class.text-orange-700]="item.priority === 'high'"
                                [class.dark:text-orange-400]="item.priority === 'high'"
                                [class.bg-gray-100]="
                                  item.priority !== 'urgent' && item.priority !== 'high'
                                "
                                [class.dark:bg-gray-700]="
                                  item.priority !== 'urgent' && item.priority !== 'high'
                                "
                                [class.text-gray-700]="
                                  item.priority !== 'urgent' && item.priority !== 'high'
                                "
                                [class.dark:text-gray-300]="
                                  item.priority !== 'urgent' && item.priority !== 'high'
                                "
                              >
                                {{ item.priority | statusLabel: 'workOrderPriority' }}
                              </span>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  }
                  @case ('inquiries') {
                    @if (
                      inquiriesResource.hasValue() &&
                      inquiriesResource.value().data.length > 0
                    ) {
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <div class="flex items-center justify-between mb-4">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {{ 'dashboard.newInquiries' | translate }}
                          </h3>
                          <button
                            mat-button
                            color="primary"
                            (click)="navigateTo('/admin/inquiries')"
                          >
                            {{ 'dashboard.viewInquiries' | translate }}
                            <mat-icon>arrow_forward</mat-icon>
                          </button>
                        </div>
                        <div class="space-y-3">
                          @for (inquiry of inquiriesResource.value().data; track inquiry.id) {
                            <div
                              class="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                            >
                              <div class="flex items-center gap-3">
                                <mat-icon class="text-blue-500">help_outline</mat-icon>
                                <div>
                                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {{ inquiry.clientName }}
                                  </p>
                                  <p class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ 'statusLabels.' + inquiry.source | translate }}
                                    &middot;
                                    {{ inquiry.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                                  </p>
                                </div>
                              </div>
                              <span
                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
                              >
                                {{ inquiry.description | slice: 0:30 }}{{ inquiry.description.length > 30 ? '...' : '' }}
                              </span>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  }
                  @case ('charts') {
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div
                        class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          {{ 'dashboard.monthlyTrend' | translate }}
                        </h3>
                        <div class="h-64">
                          <canvas
                            baseChart
                            [data]="lineChartData"
                            [options]="lineChartOptions"
                            type="line"
                          ></canvas>
                        </div>
                      </div>
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          {{ 'dashboard.ordersByStatus' | translate }}
                        </h3>
                        <div class="h-64">
                          <canvas
                            baseChart
                            [data]="donutChartData"
                            [options]="donutChartOptions"
                            type="doughnut"
                          ></canvas>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          {{ 'dashboard.topServices' | translate }}
                        </h3>
                        <div class="h-64">
                          <canvas
                            baseChart
                            [data]="barChartData"
                            [options]="barChartOptions"
                            type="bar"
                          ></canvas>
                        </div>
                      </div>
                    </div>
                  }
                  @case ('quickActions') {
                    <div
                      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {{ 'dashboard.quickActions' | translate }}
                      </h3>
                      <div class="grid grid-cols-2 gap-3">
                        <button
                          mat-stroked-button
                          class="!h-20 !flex !flex-col !gap-1"
                          (click)="navigateTo('/admin/work-orders')"
                        >
                          <mat-icon>add_circle</mat-icon>
                          <span class="text-xs">{{ 'dashboard.newOrder' | translate }}</span>
                        </button>
                        <button
                          mat-stroked-button
                          class="!h-20 !flex !flex-col !gap-1"
                          (click)="navigateTo('/admin/clients')"
                        >
                          <mat-icon>person_add</mat-icon>
                          <span class="text-xs">{{ 'dashboard.newClient' | translate }}</span>
                        </button>
                        <button
                          mat-stroked-button
                          class="!h-20 !flex !flex-col !gap-1"
                          (click)="navigateTo('/admin/pending-items')"
                        >
                          <mat-icon>pending_actions</mat-icon>
                          <span class="text-xs">{{ 'dashboard.pendingItems' | translate }}</span>
                        </button>
                        <button
                          mat-stroked-button
                          class="!h-20 !flex !flex-col !gap-1"
                          (click)="navigateTo('/admin/expenses')"
                        >
                          <mat-icon>money_off</mat-icon>
                          <span class="text-xs">{{ 'dashboard.viewExpenses' | translate }}</span>
                        </button>
                      </div>
                    </div>
                  }
                  @case ('topClients') {
                    @if (summary()!.topClients.length > 0) {
                      <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                      >
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          {{ 'dashboard.topClients' | translate }}
                        </h3>
                        <div class="space-y-3">
                          @for (client of summary()!.topClients; track client.clientId) {
                            <div
                              class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                              <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {{ client.clientName }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                  {{ client.workOrderCount }} {{ 'dashboard.orders' | translate }}
                                </p>
                              </div>
                              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {{ client.totalSpent | currency: 'ARS' : 'symbol' : '1.0-0' }}
                              </p>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  }
                }
              </div>
            }
          }
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  readonly layoutService = inject(DashboardLayoutService);

  readonly summary = signal<DashboardSummary | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly editMode = signal(false);

  readonly pendingItemsResource = httpResource<PaginatedResponse<PendingItemSummary>>(
    () => ({
      url: '/api/pending-items',
      params: { status: 'pending', limit: '5', sortBy: 'dueDate', order: 'ASC' },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<PendingItemSummary>>).data,
    },
  );

  readonly inquiriesResource = httpResource<PaginatedResponse<InquirySummary>>(
    () => ({
      url: '/api/inquiries',
      params: { status: 'new', limit: '5', sortBy: 'createdAt', order: 'DESC' },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<InquirySummary>>).data,
    },
  );

  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  donutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.updateCharts(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  onDrop(event: CdkDragDrop<DashboardWidgetId[]>): void {
    this.layoutService.reorder(event.previousIndex, event.currentIndex);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private updateCharts(data: DashboardSummary): void {
    this.lineChartData = {
      labels: data.monthlyTrend.labels,
      datasets: [
        {
          data: data.monthlyTrend.income,
          label: 'Ingresos',
          borderColor: '#1E40AF',
          backgroundColor: 'rgba(30, 64, 175, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          data: data.monthlyTrend.expenses,
          label: 'Gastos',
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    this.donutChartData = {
      labels: data.workOrdersByStatus.map((s) => s.label),
      datasets: [
        {
          data: data.workOrdersByStatus.map((s) => s.count),
          backgroundColor: [
            '#FCD34D',
            '#818CF8',
            '#34D399',
            '#10B981',
            '#F87171',
            '#A78BFA',
            '#9CA3AF',
          ],
        },
      ],
    };

    this.barChartData = {
      labels: data.topServices.map((s) => s.name),
      datasets: [
        {
          data: data.topServices.map((s) => s.count),
          label: 'Servicios',
          backgroundColor: '#3B82F6',
        },
      ],
    };
  }
}
