import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { DashboardKPIs, DashboardTrends } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-kpi-cards',
  imports: [MatIconModule, CurrencyPipe, TranslatePipe],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
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
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <mat-icon class="text-blue-600 dark:text-blue-400">assignment</mat-icon>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'dashboard.totalIncome' | translate }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {{ kpis().totalIncome | currency: 'ARS' : 'symbol' : '1.0-0' }}
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
          <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
            <mat-icon class="text-emerald-600 dark:text-emerald-400">payments</mat-icon>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'dashboard.netProfit' | translate }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {{ kpis().netProfit | currency: 'ARS' : 'symbol' : '1.0-0' }}
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
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <mat-icon class="text-purple-600 dark:text-purple-400">trending_up</mat-icon>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'dashboard.avgTicket' | translate }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {{ kpis().averageTicket | currency: 'ARS' : 'symbol' : '1.0-0' }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {{ kpis().completionRate }}% {{ 'dashboard.completionRate' | translate }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
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
}
