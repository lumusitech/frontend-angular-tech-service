import { Component, computed, inject, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardSummary } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-charts-widget',
  imports: [BaseChartDirective, TranslatePipe],
  styles: `
    @keyframes chartEntry {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .chart-entry {
      animation: chartEntry 0.5s ease-out both;
    }
    .chart-entry:nth-child(2) {
      animation-delay: 0.1s;
    }
    .chart-entry:nth-child(3) {
      animation-delay: 0.2s;
    }
  `,
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6 chart-entry"
        [style.border-left-color]="borderColor()"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.monthlyTrend' | translate }}
        </h3>
        <div class="h-64">
          <canvas
            baseChart
            [data]="lineChartData()"
            [options]="lineChartOptions()"
            type="line"
          ></canvas>
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6 chart-entry"
        [style.border-left-color]="borderColor()"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.ordersByStatus' | translate }}
        </h3>
        <div class="h-64">
          <canvas
            baseChart
            [data]="donutChartData()"
            [options]="donutChartOptions()"
            type="doughnut"
          ></canvas>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6 chart-entry"
        [style.border-left-color]="borderColor()"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.topServices' | translate }}
        </h3>
        <div class="h-64">
          <canvas
            baseChart
            [data]="barChartData()"
            [options]="barChartOptions()"
            type="bar"
          ></canvas>
        </div>
      </div>
    </div>
  `,
})
export class ChartsWidgetComponent {
  private static readonly ANIMATION = { duration: 750, easing: 'easeInOutQuart' as const };

  private readonly themeService = inject(ThemeService);

  readonly summary = input.required<DashboardSummary>();
  readonly primaryColor = input<string>('#1E40AF');
  readonly secondaryColor = input<string>('#059669');
  readonly borderColor = input<string>('#1E40AF');

  private readonly isDark = this.themeService.isDark;

  private readonly labelColor = computed(() => (this.isDark() ? '#e5e7eb' : '#374151'));
  private readonly chartBgColor = computed(() => (this.isDark() ? '#1f2937' : '#ffffff'));
  private readonly tooltipBg = computed(() => (this.isDark() ? '#374151' : '#1f2937'));

  private readonly gridColor = 'rgba(156,163,175,0.15)';

  lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const s = this.summary();
    const color = this.primaryColor();
    const sColor = this.secondaryColor();
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
        {
          data: s.monthlyTrend.profit,
          label: 'Ganancia',
          borderColor: sColor,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
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
          backgroundColor: [pColor, sColor, '#FCD34D', '#818CF8', '#F87171', '#A78BFA', '#9CA3AF'],
          borderColor: this.chartBgColor(),
          borderWidth: 2,
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

  lineChartOptions = computed<ChartConfiguration<'line'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: ChartsWidgetComponent.ANIMATION,
    scales: {
      x: {
        ticks: { color: this.labelColor(), font: { size: 11 } },
        grid: { color: this.gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: { color: this.labelColor(), font: { size: 11 } },
        grid: { color: this.gridColor },
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

  donutChartOptions = computed<ChartConfiguration<'doughnut'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { animateRotate: true, animateScale: true, ...ChartsWidgetComponent.ANIMATION },
    cutout: '55%',
    spacing: 2,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: this.labelColor(), padding: 16, font: { size: 12 }, usePointStyle: true },
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

  barChartOptions = computed<ChartConfiguration<'bar'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: ChartsWidgetComponent.ANIMATION,
    plugins: {
      legend: { display: false },
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
