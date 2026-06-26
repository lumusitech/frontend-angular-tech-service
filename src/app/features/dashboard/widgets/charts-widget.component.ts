import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardSummary } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-charts-widget',
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6" [style.border-left-color]="primaryColor()">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.monthlyTrend' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="lineChartData()" [options]="lineChartOptions" type="line"></canvas>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6" [style.border-left-color]="primaryColor()">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.ordersByStatus' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="donutChartData()" [options]="donutChartOptions" type="doughnut"></canvas>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6" [style.border-left-color]="primaryColor()">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.topServices' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="barChartData()" [options]="barChartOptions" type="bar"></canvas>
        </div>
      </div>
    </div>
  `,
})
export class ChartsWidgetComponent {
  readonly summary = input.required<DashboardSummary>();
  readonly primaryColor = input<string>('#3B82F6');
  readonly secondaryColor = input<string>('#10B981');

  lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const s = this.summary();
    const color = this.primaryColor();
    return {
      labels: s.monthlyTrend.labels,
      datasets: [
        {
          data: s.monthlyTrend.income,
          label: 'Ingresos',
          borderColor: color,
          backgroundColor: color + '1a',
          fill: true,
          tension: 0.4,
        },
        {
          data: s.monthlyTrend.expenses,
          label: 'Gastos',
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  });

  donutChartData = computed<ChartData<'doughnut'>>(() => {
    const s = this.summary();
    const pColor = this.primaryColor();
    const sColor = this.secondaryColor();
    return {
      labels: s.workOrdersByStatus.map((st) => st.label),
      datasets: [
        {
          data: s.workOrdersByStatus.map((st) => st.count),
          backgroundColor: [
            pColor,
            sColor,
            '#FCD34D',
            '#818CF8',
            '#F87171',
            '#A78BFA',
            '#9CA3AF',
          ],
        },
      ],
    };
  });

  barChartData = computed<ChartData<'bar'>>(() => {
    const s = this.summary();
    return {
      labels: s.topServices.map((svc) => svc.name),
      datasets: [
        {
          data: s.topServices.map((svc) => svc.count),
          label: 'Servicios',
          backgroundColor: this.primaryColor(),
        },
      ],
    };
  });

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };
}
