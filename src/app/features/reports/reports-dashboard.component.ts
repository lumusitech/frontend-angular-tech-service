import { Component, inject, signal, computed } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { IncomeChartComponent } from './income-chart.component';
import { ExpensesChartComponent } from './expenses-chart.component';
import { ServicesRankingComponent } from './services-ranking.component';
import { TechnicianRankingComponent } from './technician-ranking.component';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-reports-dashboard',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeaderComponent,
    ErrorStateComponent,
    IncomeChartComponent,
    ExpensesChartComponent,
    ServicesRankingComponent,
    TechnicianRankingComponent,
    DecimalPipe,
    TranslatePipe,
    CurrencyArsPipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'reports.title' | translate"
        [subtitle]="'reports.subtitle' | translate"
      />

      <!-- Filter bar -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-button-toggle-group
            [value]="period()"
            (change)="onPeriodChange($event.value)"
            class="!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !rounded-lg h-[56px]"
          >
            <mat-button-toggle value="daily">{{ 'reports.daily' | translate }}</mat-button-toggle>
            <mat-button-toggle value="weekly">{{ 'reports.weekly' | translate }}</mat-button-toggle>
            <mat-button-toggle value="monthly">{{ 'reports.monthly' | translate }}</mat-button-toggle>
            <mat-button-toggle value="yearly">{{ 'reports.yearly' | translate }}</mat-button-toggle>
          </mat-button-toggle-group>

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateFromPicker" [value]="dateFromValue()" (dateChange)="onDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateFromPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.to' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateToPicker" [value]="dateToValue()" (dateChange)="onDateToChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateToPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateToPicker></mat-datepicker>
          </mat-form-field>
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
          <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.totalIncome' | translate }}</p>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
                {{ s.kpis.totalIncome | currencyArs: '1.2-2' }}
              </p>
              <p class="text-xs mt-1" [class]="s.trends.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ s.trends.incomeChange >= 0 ? '+' : '' }}{{ s.trends.incomeChange | number: '1.1-1' }}% {{ 'reports.vsPrevious' | translate }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.totalExpenses' | translate }}</p>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
                {{ s.kpis.totalExpenses | currencyArs: '1.2-2' }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.netProfit' | translate }}</p>
              <p class="text-xl lg:text-2xl font-bold mt-1 truncate" [class]="s.kpis.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ s.kpis.netProfit | currencyArs: '1.2-2' }}
              </p>
              <p class="text-xs mt-1" [class]="s.trends.profitChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ s.trends.profitChange >= 0 ? '+' : '' }}{{ s.trends.profitChange | number: '1.1-1' }}% {{ 'reports.vsPrevious' | translate }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.averageTicket' | translate }}</p>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
                {{ s.kpis.averageTicket | currencyArs: '1.2-2' }}
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
  readonly dateFromValue = computed(() => this.dateFrom() ? new Date(this.dateFrom()) : null);
  readonly dateToValue = computed(() => this.dateTo() ? new Date(this.dateTo()) : null);
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

  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    this.dateFrom.set(date ? date.toISOString().split('T')[0] : '');
    this.period.set('');
    this.loadAll();
  }

  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    this.dateTo.set(date ? date.toISOString().split('T')[0] : '');
    this.period.set('');
    this.loadAll();
  }
}
