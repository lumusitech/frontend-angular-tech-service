import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardKPIs } from '../../core/models/dashboard.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
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
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Órdenes Activas</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ kpis()?.activeOrders || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <mat-icon class="text-blue-600">assignment</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Completadas Hoy</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ kpis()?.completedToday || 0 }}
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <mat-icon class="text-green-600">check_circle</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Ingresos del Mes</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ kpis()?.monthlyRevenue || 0 | currency: 'ARS' : 'symbol' : '1.0-0' }}
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
                <p class="text-sm text-gray-500">Pagos Pendientes</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">
                  {{ kpis()?.pendingPayments || 0 }}
                </p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <mat-icon class="text-orange-600">pending_actions</mat-icon>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h3>
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
                (click)="navigateTo('/admin/payments')"
              >
                <mat-icon>receipt</mat-icon>
                <span class="text-xs">Ver Pagos</span>
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
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  readonly kpis = signal<DashboardKPIs | null>(null);
  readonly loading = signal(true);

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        label: 'Ingresos',
        borderColor: '#1E40AF',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  donutChartData: ChartData<'doughnut'> = {
    labels: ['Pendiente', 'En Progreso', 'Completada', 'Entregada'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#FCD34D', '#818CF8', '#34D399', '#10B981'],
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
    labels: ['Sin datos'],
    datasets: [
      {
        data: [0],
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
    this.loadKPIs();
  }

  loadKPIs(): void {
    this.dashboardService.getKPIs().subscribe({
      next: (kpis) => {
        this.kpis.set(kpis);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
