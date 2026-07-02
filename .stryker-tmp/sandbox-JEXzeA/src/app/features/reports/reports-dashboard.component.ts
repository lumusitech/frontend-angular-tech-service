// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { toLocalDateString } from '../../core/utils/date.utils';
import { ReportsService } from '../../core/services/reports.service';
import { PeriodFilter, SummaryReport, IncomeReport, ExpenseReport, ProfitReport, ServicesReport, TechnicianRanking } from '../../core/models/report.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { IncomeChartComponent } from './income-chart.component';
import { ExpensesChartComponent } from './expenses-chart.component';
import { ProfitChartComponent } from './profit-chart.component';
import { ServicesRankingComponent } from './services-ranking.component';
import { TechnicianRankingComponent } from './technician-ranking.component';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
@Component({
  selector: 'app-reports-dashboard',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, PageHeaderComponent, ErrorStateComponent, IncomeChartComponent, ExpensesChartComponent, ProfitChartComponent, ServicesRankingComponent, TechnicianRankingComponent, DecimalPipe, TranslatePipe, CurrencyArsPipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'reports.title' | translate"
        [subtitle]="'reports.subtitle' | translate"
      />

      <!-- Filter bar -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 px-4 py-3" [style.border-left-color]="'var(--color-primary)'">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'reports.period' | translate }}</mat-label>
            <mat-select [value]="period()" (selectionChange)="onPeriodChange($event.value)">
              <mat-option value="daily">{{ 'reports.daily' | translate }}</mat-option>
              <mat-option value="weekly">{{ 'reports.weekly' | translate }}</mat-option>
              <mat-option value="monthly">{{ 'reports.monthly' | translate }}</mat-option>
              <mat-option value="yearly">{{ 'reports.yearly' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateFromPicker" [value]="dateFromValue()" [max]="dateToValue() || undefined" (dateChange)="onDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateFromPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.to' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateToPicker" [value]="dateToValue()" [min]="dateFromValue() || undefined" (dateChange)="onDateToChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateToPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateToPicker></mat-datepicker>
          </mat-form-field>

          @if (dateError()) {
            <span class="text-sm text-red-500 dark:text-red-400">{{ 'common.invalidDateRange' | translate }}</span>
          }
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
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-primary)'">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.totalIncome' | translate }}</p>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
                {{ s.kpis.totalIncome | currencyArs: '1.2-2' }}
              </p>
              <p class="text-xs mt-1" [class]="s.trends.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ s.trends.incomeChange >= 0 ? '+' : '' }}{{ s.trends.incomeChange | number: '1.1-1' }}% {{ 'reports.vsPrevious' | translate }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-secondary)'">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.totalExpenses' | translate }}</p>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
                {{ s.kpis.totalExpenses | currencyArs: '1.2-2' }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-primary)'">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'reports.netProfit' | translate }}</p>
              <p class="text-xl lg:text-2xl font-bold mt-1 truncate" [class]="s.kpis.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ s.kpis.netProfit | currencyArs: '1.2-2' }}
              </p>
              <p class="text-xs mt-1" [class]="s.trends.profitChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ s.trends.profitChange >= 0 ? '+' : '' }}{{ s.trends.profitChange | number: '1.1-1' }}% {{ 'reports.vsPrevious' | translate }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-4" [style.border-left-color]="'var(--color-secondary)'">
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

        <!-- Profit chart -->
        <div class="grid grid-cols-1 gap-6">
          @if (profitReport(); as profit) {
            <app-profit-chart [data]="profit" />
          }
        </div>

        <!-- Rankings row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @if (servicesReport(); as services) {
            <app-services-ranking [data]="services" />
          }
          @if (technicianRanking(); as technicians) {
            <app-technician-ranking [data]="technicians" (technicianClick)="onTechnicianClick($event)" />
          }
        </div>
      }
    </div>
  `
})
export class ReportsDashboardComponent {
  private readonly reportsService = inject(ReportsService);
  private readonly router = inject(Router);
  readonly period = signal<string>(stryMutAct_9fa48("3975") ? "" : (stryCov_9fa48("3975"), 'monthly'));
  readonly dateFrom = signal<string>(stryMutAct_9fa48("3976") ? "Stryker was here!" : (stryCov_9fa48("3976"), ''));
  readonly dateTo = signal<string>(stryMutAct_9fa48("3977") ? "Stryker was here!" : (stryCov_9fa48("3977"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("3978") ? () => undefined : (stryCov_9fa48("3978"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("3979") ? () => undefined : (stryCov_9fa48("3979"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly dateError = signal(stryMutAct_9fa48("3980") ? true : (stryCov_9fa48("3980"), false));
  readonly loading = signal(stryMutAct_9fa48("3981") ? false : (stryCov_9fa48("3981"), true));
  readonly error = signal(stryMutAct_9fa48("3982") ? true : (stryCov_9fa48("3982"), false));
  readonly summary = signal<SummaryReport | null>(null);
  readonly incomeReport = signal<IncomeReport | null>(null);
  readonly expenseReport = signal<ExpenseReport | null>(null);
  readonly profitReport = signal<ProfitReport | null>(null);
  readonly servicesReport = signal<ServicesReport | null>(null);
  readonly technicianRanking = signal<TechnicianRanking[] | null>(null);
  constructor() {
    if (stryMutAct_9fa48("3983")) {
      {}
    } else {
      stryCov_9fa48("3983");
      this.loadAll();
    }
  }
  private getFilters(): PeriodFilter {
    if (stryMutAct_9fa48("3984")) {
      {}
    } else {
      stryCov_9fa48("3984");
      const filters: PeriodFilter = {};
      if (stryMutAct_9fa48("3987") ? this.dateFrom() || this.dateTo() : stryMutAct_9fa48("3986") ? false : stryMutAct_9fa48("3985") ? true : (stryCov_9fa48("3985", "3986", "3987"), this.dateFrom() && this.dateTo())) {
        if (stryMutAct_9fa48("3988")) {
          {}
        } else {
          stryCov_9fa48("3988");
          filters.dateFrom = this.dateFrom();
          filters.dateTo = this.dateTo();
        }
      } else {
        if (stryMutAct_9fa48("3989")) {
          {}
        } else {
          stryCov_9fa48("3989");
          filters.period = this.period() as PeriodFilter['period'];
        }
      }
      return filters;
    }
  }
  loadAll(): void {
    if (stryMutAct_9fa48("3990")) {
      {}
    } else {
      stryCov_9fa48("3990");
      this.loading.set(stryMutAct_9fa48("3991") ? false : (stryCov_9fa48("3991"), true));
      this.error.set(stryMutAct_9fa48("3992") ? true : (stryCov_9fa48("3992"), false));
      const filters = this.getFilters();
      let completed = 0;
      const total = 6;
      const checkDone = () => {
        if (stryMutAct_9fa48("3993")) {
          {}
        } else {
          stryCov_9fa48("3993");
          stryMutAct_9fa48("3994") ? completed-- : (stryCov_9fa48("3994"), completed++);
          if (stryMutAct_9fa48("3997") ? completed !== total : stryMutAct_9fa48("3996") ? false : stryMutAct_9fa48("3995") ? true : (stryCov_9fa48("3995", "3996", "3997"), completed === total)) {
            if (stryMutAct_9fa48("3998")) {
              {}
            } else {
              stryCov_9fa48("3998");
              this.loading.set(stryMutAct_9fa48("3999") ? true : (stryCov_9fa48("3999"), false));
            }
          }
        }
      };
      this.reportsService.getSummary().subscribe(stryMutAct_9fa48("4000") ? {} : (stryCov_9fa48("4000"), {
        next: data => {
          if (stryMutAct_9fa48("4001")) {
            {}
          } else {
            stryCov_9fa48("4001");
            this.summary.set(data);
            checkDone();
          }
        },
        error: () => {
          if (stryMutAct_9fa48("4002")) {
            {}
          } else {
            stryCov_9fa48("4002");
            this.error.set(stryMutAct_9fa48("4003") ? false : (stryCov_9fa48("4003"), true));
            this.loading.set(stryMutAct_9fa48("4004") ? true : (stryCov_9fa48("4004"), false));
          }
        }
      }));
      this.reportsService.getIncome(filters).subscribe(stryMutAct_9fa48("4005") ? {} : (stryCov_9fa48("4005"), {
        next: data => {
          if (stryMutAct_9fa48("4006")) {
            {}
          } else {
            stryCov_9fa48("4006");
            this.incomeReport.set(data);
            checkDone();
          }
        },
        error: stryMutAct_9fa48("4007") ? () => undefined : (stryCov_9fa48("4007"), () => checkDone())
      }));
      this.reportsService.getExpenses(filters).subscribe(stryMutAct_9fa48("4008") ? {} : (stryCov_9fa48("4008"), {
        next: data => {
          if (stryMutAct_9fa48("4009")) {
            {}
          } else {
            stryCov_9fa48("4009");
            this.expenseReport.set(data);
            checkDone();
          }
        },
        error: stryMutAct_9fa48("4010") ? () => undefined : (stryCov_9fa48("4010"), () => checkDone())
      }));
      this.reportsService.getProfit(filters).subscribe(stryMutAct_9fa48("4011") ? {} : (stryCov_9fa48("4011"), {
        next: data => {
          if (stryMutAct_9fa48("4012")) {
            {}
          } else {
            stryCov_9fa48("4012");
            this.profitReport.set(data);
            checkDone();
          }
        },
        error: stryMutAct_9fa48("4013") ? () => undefined : (stryCov_9fa48("4013"), () => checkDone())
      }));
      this.reportsService.getServices(filters).subscribe(stryMutAct_9fa48("4014") ? {} : (stryCov_9fa48("4014"), {
        next: data => {
          if (stryMutAct_9fa48("4015")) {
            {}
          } else {
            stryCov_9fa48("4015");
            this.servicesReport.set(data);
            checkDone();
          }
        },
        error: stryMutAct_9fa48("4016") ? () => undefined : (stryCov_9fa48("4016"), () => checkDone())
      }));
      this.reportsService.getTechnicians().subscribe(stryMutAct_9fa48("4017") ? {} : (stryCov_9fa48("4017"), {
        next: data => {
          if (stryMutAct_9fa48("4018")) {
            {}
          } else {
            stryCov_9fa48("4018");
            this.technicianRanking.set(data);
            checkDone();
          }
        },
        error: stryMutAct_9fa48("4019") ? () => undefined : (stryCov_9fa48("4019"), () => checkDone())
      }));
    }
  }
  private validateDates(): boolean {
    if (stryMutAct_9fa48("4020")) {
      {}
    } else {
      stryCov_9fa48("4020");
      if (stryMutAct_9fa48("4023") ? this.dateFrom() || this.dateTo() : stryMutAct_9fa48("4022") ? false : stryMutAct_9fa48("4021") ? true : (stryCov_9fa48("4021", "4022", "4023"), this.dateFrom() && this.dateTo())) {
        if (stryMutAct_9fa48("4024")) {
          {}
        } else {
          stryCov_9fa48("4024");
          const from = new Date(this.dateFrom());
          const to = new Date(this.dateTo());
          if (stryMutAct_9fa48("4028") ? from <= to : stryMutAct_9fa48("4027") ? from >= to : stryMutAct_9fa48("4026") ? false : stryMutAct_9fa48("4025") ? true : (stryCov_9fa48("4025", "4026", "4027", "4028"), from > to)) {
            if (stryMutAct_9fa48("4029")) {
              {}
            } else {
              stryCov_9fa48("4029");
              this.dateError.set(stryMutAct_9fa48("4030") ? false : (stryCov_9fa48("4030"), true));
              return stryMutAct_9fa48("4031") ? true : (stryCov_9fa48("4031"), false);
            }
          }
        }
      }
      this.dateError.set(stryMutAct_9fa48("4032") ? true : (stryCov_9fa48("4032"), false));
      return stryMutAct_9fa48("4033") ? false : (stryCov_9fa48("4033"), true);
    }
  }
  onPeriodChange(value: string): void {
    if (stryMutAct_9fa48("4034")) {
      {}
    } else {
      stryCov_9fa48("4034");
      this.period.set(value);
      this.dateFrom.set(stryMutAct_9fa48("4035") ? "Stryker was here!" : (stryCov_9fa48("4035"), ''));
      this.dateTo.set(stryMutAct_9fa48("4036") ? "Stryker was here!" : (stryCov_9fa48("4036"), ''));
      this.dateError.set(stryMutAct_9fa48("4037") ? true : (stryCov_9fa48("4037"), false));
      this.loadAll();
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("4038")) {
      {}
    } else {
      stryCov_9fa48("4038");
      const date = event.value;
      this.dateFrom.set(date ? toLocalDateString(date) : stryMutAct_9fa48("4039") ? "Stryker was here!" : (stryCov_9fa48("4039"), ''));
      this.period.set(stryMutAct_9fa48("4040") ? "Stryker was here!" : (stryCov_9fa48("4040"), ''));
      if (stryMutAct_9fa48("4042") ? false : stryMutAct_9fa48("4041") ? true : (stryCov_9fa48("4041", "4042"), this.validateDates())) {
        if (stryMutAct_9fa48("4043")) {
          {}
        } else {
          stryCov_9fa48("4043");
          this.loadAll();
        }
      }
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("4044")) {
      {}
    } else {
      stryCov_9fa48("4044");
      const date = event.value;
      this.dateTo.set(date ? toLocalDateString(date) : stryMutAct_9fa48("4045") ? "Stryker was here!" : (stryCov_9fa48("4045"), ''));
      this.period.set(stryMutAct_9fa48("4046") ? "Stryker was here!" : (stryCov_9fa48("4046"), ''));
      if (stryMutAct_9fa48("4048") ? false : stryMutAct_9fa48("4047") ? true : (stryCov_9fa48("4047", "4048"), this.validateDates())) {
        if (stryMutAct_9fa48("4049")) {
          {}
        } else {
          stryCov_9fa48("4049");
          this.loadAll();
        }
      }
    }
  }
  onTechnicianClick(technicianId: string): void {
    if (stryMutAct_9fa48("4050")) {
      {}
    } else {
      stryCov_9fa48("4050");
      this.router.navigate(stryMutAct_9fa48("4051") ? [] : (stryCov_9fa48("4051"), [stryMutAct_9fa48("4052") ? "" : (stryCov_9fa48("4052"), '/admin/reports/technicians'), technicianId]));
    }
  }
}