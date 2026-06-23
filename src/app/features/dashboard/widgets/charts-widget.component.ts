import { Component, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-charts-widget',
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.monthlyTrend' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="lineChartData()" [options]="lineChartOptions" type="line"></canvas>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.ordersByStatus' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="donutChartData()" [options]="donutChartOptions" type="doughnut"></canvas>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
  lineChartData = input.required<ChartConfiguration<'line'>['data']>();
  donutChartData = input.required<ChartData<'doughnut'>>();
  barChartData = input.required<ChartData<'bar'>>();

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
