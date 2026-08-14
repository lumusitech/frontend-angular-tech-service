import { Component, input, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ProfitReport } from '../../core/models/report.interfaces';
import { ThemeService } from '../../core/services/theme.service';
import { inject } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-profit-chart',
  imports: [BaseChartDirective, DecimalPipe, TranslatePipe, CurrencyArsPipe],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6"
      [style.border-left-color]="'var(--color-primary)'"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ 'reports.profit.title' | translate }}
        </h3>
        <div class="text-right">
          <p
            class="text-sm font-semibold"
            [class]="
              data().netProfit >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            "
          >
            {{ data().netProfit | currencyArs: '1.0-0' }}
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
        <canvas baseChart [data]="chartData()" [options]="chartOptions()" type="bar"></canvas>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ 'reports.profit.income' | translate }}
          </p>
          <p class="text-sm font-semibold text-green-600 dark:text-green-400">
            {{ data().income | currencyArs: '1.0-0' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ 'reports.profit.materials' | translate }}
          </p>
          <p class="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            {{ data().materialCosts | currencyArs: '1.0-0' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ 'reports.profit.expenses' | translate }}
          </p>
          <p class="text-sm font-semibold text-red-600 dark:text-red-400">
            {{ data().operationalExpenses | currencyArs: '1.0-0' }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ProfitChartComponent {
  private readonly themeService = inject(ThemeService);

  data = input.required<ProfitReport>();

  private readonly isDark = this.themeService.isDark;
  private readonly labelColor = computed(() => (this.isDark() ? '#e5e7eb' : '#374151'));
  private readonly tooltipBg = computed(() => (this.isDark() ? '#374151' : '#1f2937'));

  chartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const d = this.data();
    return {
      labels: [d.period.label],
      datasets: [
        {
          data: [d.income],
          label: 'Ingresos',
          backgroundColor: '#059669',
        },
        {
          data: [d.materialCosts],
          label: 'Materiales',
          backgroundColor: '#FCD34D',
        },
        {
          data: [d.operationalExpenses],
          label: 'Gastos Operativos',
          backgroundColor: '#EF4444',
        },
      ],
    };
  });

  chartOptions = computed<ChartConfiguration<'bar'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 750, easing: 'easeInOutQuart' as const },
    scales: {
      x: {
        stacked: true,
        ticks: { color: this.labelColor(), font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { color: this.labelColor(), font: { size: 11 } },
        grid: { color: 'rgba(156,163,175,0.15)' },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: this.labelColor(), padding: 16, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: this.tooltipBg(),
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        padding: 12,
        cornerRadius: 8,
      },
    },
  }));
}
