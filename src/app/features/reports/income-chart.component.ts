import { Component, input, effect } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { IncomeReport } from '../../core/models/report.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-income-chart',
  imports: [BaseChartDirective, DecimalPipe, TranslatePipe],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6"
      [style.border-left-color]="'var(--color-primary)'"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ 'reports.income' | translate }}
        </h3>
        <div class="text-right">
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {{ data().totalIncome | number: '1.0-0' }}
          </p>
          <p
            class="text-xs"
            [class]="data().changePercentage >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ data().changePercentage >= 0 ? '+' : ''
            }}{{ data().changePercentage | number: '1.1-1' }}%
          </p>
        </div>
      </div>
      <div class="h-64">
        <canvas baseChart [data]="chartData" [options]="chartOptions" type="line"></canvas>
      </div>
    </div>
  `,
})
export class IncomeChartComponent {
  data = input.required<IncomeReport>();

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => '$' + Number(v).toLocaleString('es-AR') } },
    },
  };

  constructor() {
    effect(() => {
      const report = this.data();
      const primaryColor = this.getPrimaryColor();
      this.chartData = {
        labels: report.byDay.map((d) => d.date),
        datasets: [
          {
            data: report.byDay.map((d) => d.total),
            label: 'Ingresos',
            borderColor: primaryColor,
            backgroundColor: primaryColor + '1a',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    });
  }

  private getPrimaryColor(): string {
    if (typeof document === 'undefined') return '#1E40AF';
    return (
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
      '#1E40AF'
    );
  }
}
