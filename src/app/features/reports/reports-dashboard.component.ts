import { Component, inject, signal } from '@angular/core';
import { ReportsService } from '../../core/services/reports.service';
import {
  PeriodFilter,
  SummaryReport,
  IncomeReport,
  ExpenseReport,
  ProfitReport,
  ServicesReport,
  TechnicianRanking,
} from '../../core/models/report.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { IncomeChartComponent } from './income-chart.component';
import { ExpensesChartComponent } from './expenses-chart.component';
import { ServicesRankingComponent } from './services-ranking.component';
import { TechnicianRankingComponent } from './technician-ranking.component';
import { DecimalPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-reports-dashboard',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    ErrorStateComponent,
    IncomeChartComponent,
    ExpensesChartComponent,
    ServicesRankingComponent,
    TechnicianRankingComponent,
    DecimalPipe,
    DatePipe,
    TranslatePipe,
    CurrencyArsPipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'reports.title' | translate"
        [subtitle]="'reports.subtitle' | translate"
      />

      <!-- Period selector -->
      <div class="flex items-center gap-4 flex-wrap">
        <mat-button-toggle-group
          [value]="period()"
          (change)="onPeriodChange($event.value)"
          class="!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !rounded-lg"
        >
          <mat-button-toggle value="daily">{{ 'reports.daily' | translate }}</mat-button-toggle>
          <mat-button-toggle value="weekly">{{ 'reports.weekly' | translate }}</mat-button-toggle>
          <mat-button-toggle value="monthly">{{ 'reports.monthly' | translate }}</mat-button-toggle>
          <mat-button-toggle value="yearly">{{ 'reports.yearly' | translate }}</mat-button-toggle>
        </mat-button-toggle-group>

        <div class="flex items-center gap-2">
          <input
            type="date"
            [value]="dateFrom()"
            (change)="onDateFromChange($event)"
            class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <span class="text-gray-400">—</span>
          <input
            type="date"
            [value]="dateTo()"
            (change)="onDateToChange($event)"
            class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40" />
        </div>
      } @else if (error()) {
        <app-error-state (retry)="loadAll()" />
      } @else {
        <!-- KPI Cards -->
        @if (summary(); as s) {
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.totalIncome' | translate }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {{ s.kpis.totalIncome | currencyArs: '1.0-0' }}
              </p>
              <p class="text-xs mt-1" [class]="s.trends.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ s.trends.incomeChange >= 0 ? '+' : '' }}{{ s.trends.incomeChange | number: '1.1-1' }}% {{ 'reports.vsPrevious' | translate }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.totalExpenses' | translate }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {{ s.kpis.totalExpenses | currencyArs: '1.0-0' }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.netProfit' | translate }}</p>
              <p class="text-2xl font-bold mt-1" [class]="s.kpis.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ s.kpis.netProfit | currencyArs: '1.0-0' }}
              </p>
              <p class="text-xs mt-1" [class]="s.trends.profitChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ s.trends.profitChange >= 0 ? '+' : '' }}{{ s.trends.profitChange | number: '1.1-1' }}% {{ 'reports.vsPrevious' | translate }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.averageTicket' | translate }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {{ s.kpis.averageTicket | currencyArs: '1.0-0' }}
              </p>
            </div>
          </div>
        }

        <!-- Charts row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @if (incomeReport(); as income) {
            <app-income-chart [data]="income" />
          }
          @if (expenseReport(); as expense) {
            <app-expenses-chart [data]="expense" />
          }
        </div>

        <!-- Rankings row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @if (servicesReport(); as services) {
            <app-services-ranking [data]="services" />
          }
          @if (technicianRanking(); as technicians) {
            <app-technician-ranking [data]="technicians" />
          }
        </div>
      }
    </div>
  `,
})
export class ReportsDashboardComponent {
  private readonly reportsService = inject(ReportsService);

  readonly period = signal<string>('monthly');
  readonly dateFrom = signal<string>('');
  readonly dateTo = signal<string>('');
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly summary = signal<SummaryReport | null>(null);
  readonly incomeReport = signal<IncomeReport | null>(null);
  readonly expenseReport = signal<ExpenseReport | null>(null);
  readonly profitReport = signal<ProfitReport | null>(null);
  readonly servicesReport = signal<ServicesReport | null>(null);
  readonly technicianRanking = signal<TechnicianRanking[] | null>(null);

  constructor() {
    this.loadAll();
  }

  private getFilters(): PeriodFilter {
    const filters: PeriodFilter = {};
    if (this.dateFrom() && this.dateTo()) {
      filters.dateFrom = this.dateFrom();
      filters.dateTo = this.dateTo();
    } else {
      filters.period = this.period() as PeriodFilter['period'];
    }
    return filters;
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(false);
    const filters = this.getFilters();

    let completed = 0;
    const total = 5;
    const checkDone = () => {
      completed++;
      if (completed === total) {
        this.loading.set(false);
      }
    };

    this.reportsService.getSummary().subscribe({
      next: (data) => { this.summary.set(data); checkDone(); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });

    this.reportsService.getIncome(filters).subscribe({
      next: (data) => { this.incomeReport.set(data); checkDone(); },
      error: () => checkDone(),
    });

    this.reportsService.getExpenses(filters).subscribe({
      next: (data) => { this.expenseReport.set(data); checkDone(); },
      error: () => checkDone(),
    });

    this.reportsService.getServices(filters).subscribe({
      next: (data) => { this.servicesReport.set(data); checkDone(); },
      error: () => checkDone(),
    });

    this.reportsService.getTechnicians().subscribe({
      next: (data) => { this.technicianRanking.set(data); checkDone(); },
      error: () => checkDone(),
    });
  }

  onPeriodChange(value: string): void {
    this.period.set(value);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.loadAll();
  }

  onDateFromChange(event: Event): void {
    this.dateFrom.set((event.target as HTMLInputElement).value);
    this.loadAll();
  }

  onDateToChange(event: Event): void {
    this.dateTo.set((event.target as HTMLInputElement).value);
    this.loadAll();
  }
}
