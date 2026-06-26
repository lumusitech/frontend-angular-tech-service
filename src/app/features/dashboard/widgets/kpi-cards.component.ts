import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardKPIs, DashboardTrends } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-kpi-cards',
  imports: [MatIconModule, TranslatePipe, CurrencyArsPipe],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" [style.border-left-color]="primaryColor()" (click)="kpiClick.emit('/admin/work-orders')">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'dashboard.totalOrders' | translate }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {{ kpis().workOrderCount }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {{ kpis().completedCount }} {{ 'dashboard.completed' | translate }}
            </p>
          </div>
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" [style.background-color]="primaryColor() + '1a'">
            <mat-icon [style.color]="primaryColor()">assignment</mat-icon>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" [style.border-left-color]="primaryColor()" (click)="kpiClick.emit('/admin/payments')">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'dashboard.totalIncome' | translate }}
            </p>
            <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
              {{ kpis().totalIncome | currencyArs: '1.2-2' }}
            </p>
            <p
              class="text-xs mt-1"
              [class.text-green-600]="trends().incomeChange >= 0"
              [class.text-red-600]="trends().incomeChange < 0"
            >
              {{ trends().incomeChange >= 0 ? '+' : '' }}{{ trends().incomeChange }}%
              {{ 'dashboard.vsLastMonth' | translate }}
            </p>
          </div>
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" [style.background-color]="secondaryColor() + '1a'">
            <mat-icon [style.color]="secondaryColor()">payments</mat-icon>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" [style.border-left-color]="primaryColor()" (click)="kpiClick.emit('/admin/expenses')">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'dashboard.netProfit' | translate }}
            </p>
            <p class="text-xl lg:text-2xl font-bold mt-1 truncate" [class]="kpis().netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ kpis().netProfit | currencyArs: '1.2-2' }}
            </p>
            <p
              class="text-xs mt-1"
              [class.text-green-600]="trends().profitChange >= 0"
              [class.text-red-600]="trends().profitChange < 0"
            >
              {{ trends().profitChange >= 0 ? '+' : '' }}{{ trends().profitChange }}%
              {{ 'dashboard.vsLastMonth' | translate }}
            </p>
          </div>
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
            <mat-icon class="text-purple-600 dark:text-purple-400">trending_up</mat-icon>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" [style.border-left-color]="primaryColor()" (click)="kpiClick.emit('/admin/billing')">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'dashboard.avgTicket' | translate }}
            </p>
            <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
              {{ kpis().averageTicket | currencyArs: '1.2-2' }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {{ kpis().completionRate }}% {{ 'dashboard.completionRate' | translate }}
            </p>
          </div>
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
            <mat-icon class="text-orange-600 dark:text-orange-400">receipt</mat-icon>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class KpiCardsComponent {
  kpis = input.required<DashboardKPIs>();
  trends = input.required<DashboardTrends>();
  primaryColor = input<string>('#3B82F6');
  secondaryColor = input<string>('#10B981');
  kpiClick = output<string>();
}
