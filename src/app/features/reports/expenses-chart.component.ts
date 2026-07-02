import { Component, input, effect } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ExpenseReport } from '../../core/models/report.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-expenses-chart',
  imports: [BaseChartDirective, DecimalPipe, TranslatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6" [style.border-left-color]="'var(--color-secondary)'">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ 'reports.expenses' | translate }}
        </h3>
        <div class="text-right">
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ data().totalExpenses | number: '1.0-0' }}
          </p>
          <p class="text-xs" [class]="data().changePercentage <= 0 ? 'text-green-600' : 'text-red-600'">
            {{ data().changePercentage >= 0 ? '+' : '' }}{{ data().changePercentage | number: '1.1-1' }}%
          </p>
        </div>
      </div>
      <div class="h-64">
        <canvas
          baseChart
          [data]="chartData"
          [options]="chartOptions"
          type="bar"
        ></canvas>
      </div>
    </div>
  `,
})
export class ExpensesChartComponent {
  data = input.required<ExpenseReport>();

  chartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => '$' + Number(v).toLocaleString('es-AR') } },
    },
  };

  private readonly colors = [
    '#EF4444', '#F59E0B', '#1E40AF', '#059669', '#8B5CF6',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#6B7280',
  ];

  constructor() {
    effect(() => {
      const report = this.data();
      this.chartData = {
        labels: report.byCategory.map((c) => c.label),
        datasets: [
          {
            data: report.byCategory.map((c) => c.total),
            backgroundColor: this.colors.slice(0, report.byCategory.length),
          },
        ],
      };
    });
  }
}
