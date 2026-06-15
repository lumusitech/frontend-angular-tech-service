import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { DashboardService } from '../../core/services/dashboard.service';
import {
  DashboardSummary,
  PendingItemSummary,
  PaginatedResponse,
} from '../../core/models/dashboard.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ErrorStateComponent,
    CurrencyPipe,
    DatePipe,
    BaseChartDirective,
  ],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1">Resumen del sistema de servicios técnicos</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (loadError()) {
        <app-error-state (retry)="loadSummary()" />
      } @else if (summary()) {
        <!-- KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Órdenes Totales</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ summary()!.kpis.workOrderCount }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ summary()!.kpis.completedCount }} completadas
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <mat-icon class="text-blue-600">assignment</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Ingresos Totales</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ summary()!.kpis.totalIncome | currency: 'ARS' : 'symbol' : '1.0-0' }}
                </p>
                <p
                  class="text-xs mt-1"
                  [class.text-green-600]="summary()!.trends.incomeChange >= 0"
                  [class.text-red-600]="summary()!.trends.incomeChange < 0"
                >
                  {{ summary()!.trends.incomeChange >= 0 ? '+' : ''
                  }}{{ summary()!.trends.incomeChange }}% vs mes anterior
                </p>
              </div>
              <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <mat-icon class="text-emerald-600">payments</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Ganancia Neta</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ summary()!.kpis.netProfit | currency: 'ARS' : 'symbol' : '1.0-0' }}
                </p>
                <p
                  class="text-xs mt-1"
                  [class.text-green-600]="summary()!.trends.profitChange >= 0"
                  [class.text-red-600]="summary()!.trends.profitChange < 0"
                >
                  {{ summary()!.trends.profitChange >= 0 ? '+' : ''
                  }}{{ summary()!.trends.profitChange }}% vs mes anterior
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <mat-icon class="text-purple-600">trending_up</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Ticket Promedio</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ summary()!.kpis.averageTicket | currency: 'ARS' : 'symbol' : '1.0-0' }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ summary()!.kpis.completionRate }}% tasa completado
                </p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <mat-icon class="text-orange-600">receipt</mat-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h3>
            <div class="h-64">
              <canvas
                baseChart
                [data]="lineChartData"
                [options]="lineChartOptions"
                type="line"
              ></canvas>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Órdenes por Estado</h3>
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

        <!-- Charts Row 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Servicios</h3>
            <div class="h-64">
              <canvas
                baseChart
                [data]="barChartData"
                [options]="barChartOptions"
                type="bar"
              ></canvas>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                mat-stroked-button
                class="!h-20 !flex !flex-col !gap-1"
                (click)="navigateTo('/admin/work-orders')"
              >
                <mat-icon>add_circle</mat-icon>
                <span class="text-xs">Nueva Orden</span>
              </button>
              <button
                mat-stroked-button
                class="!h-20 !flex !flex-col !gap-1"
                (click)="navigateTo('/admin/clients')"
              >
                <mat-icon>person_add</mat-icon>
                <span class="text-xs">Nuevo Cliente</span>
              </button>
              <button
                mat-stroked-button
                class="!h-20 !flex !flex-col !gap-1"
                (click)="navigateTo('/admin/pending-items')"
              >
                <mat-icon>pending_actions</mat-icon>
                <span class="text-xs">Pendientes</span>
              </button>
              <button
                mat-stroked-button
                class="!h-20 !flex !flex-col !gap-1"
                (click)="navigateTo('/admin/expenses')"
              >
                <mat-icon>money_off</mat-icon>
                <span class="text-xs">Ver Gastos</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Pending Items Widget -->
        @if (pendingItemsResource.hasValue() && pendingItemsResource.value().data.length > 0) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Trabajo Pendiente</h3>
              <button mat-button color="primary" (click)="navigateTo('/admin/pending-items')">
                Ver todos
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
            <div class="space-y-3">
              @for (item of pendingItemsResource.value().data; track item.id) {
                <div
                  class="flex items-center justify-between p-3 rounded-lg border"
                  [class.border-red-200]="item.priority === 'urgent'"
                  [class.bg-red-50]="item.priority === 'urgent'"
                  [class.border-orange-200]="item.priority === 'high'"
                  [class.bg-orange-50]="item.priority === 'high'"
                  [class.border-gray-200]="item.priority !== 'urgent' && item.priority !== 'high'"
                >
                  <div class="flex items-center gap-3">
                    <mat-icon
                      [class.text-red-500]="item.priority === 'urgent'"
                      [class.text-orange-500]="item.priority === 'high'"
                      [class.text-gray-400]="item.priority !== 'urgent' && item.priority !== 'high'"
                    >
                      {{ item.status === 'completed' ? 'check_circle' : 'pending_actions' }}
                    </mat-icon>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ item.title }}</p>
                      <p class="text-xs text-gray-500">
                        Vence: {{ item.dueDate | date: 'dd/MM/yyyy' }}
                        @if (item.assignedTo) {
                          &middot; {{ item.assignedTo.name }}
                        }
                      </p>
                    </div>
                  </div>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-red-100]="item.priority === 'urgent'"
                    [class.text-red-700]="item.priority === 'urgent'"
                    [class.bg-orange-100]="item.priority === 'high'"
                    [class.text-orange-700]="item.priority === 'high'"
                    [class.bg-gray-100]="item.priority !== 'urgent' && item.priority !== 'high'"
                    [class.text-gray-700]="item.priority !== 'urgent' && item.priority !== 'high'"
                  >
                    {{ getPriorityLabel(item.priority) }}
                  </span>
                </div>
              }
            </div>
          </div>
        }

        <!-- Top Clients -->
        @if (summary()!.topClients.length > 0) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Clientes</h3>
            <div class="space-y-3">
              @for (client of summary()!.topClients; track client.clientId) {
                <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ client.clientName }}</p>
                    <p class="text-xs text-gray-500">{{ client.workOrderCount }} órdenes</p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ client.totalSpent | currency: 'ARS' : 'symbol' : '1.0-0' }}
                  </p>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  readonly summary = signal<DashboardSummary | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly pendingItemsResource = httpResource<PaginatedResponse<PendingItemSummary>>(
    () => ({
      url: '/api/pending-items',
      params: {
        status: 'pending',
        limit: '5',
        sortBy: 'dueDate',
        order: 'ASC',
      },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<PendingItemSummary>>).data,
    },
  );

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos',
        borderColor: '#1E40AF',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [],
        label: 'Gastos',
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  donutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
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

  donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Servicios',
        backgroundColor: '#3B82F6',
      },
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
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

  private updateCharts(data: DashboardSummary): void {
    // Line chart - monthly trend
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

    // Donut chart - orders by status
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

    // Bar chart - top services
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

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return labels[priority] || priority;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
