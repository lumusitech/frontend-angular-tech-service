import { Component, input } from '@angular/core';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { ServicesReport } from '../../core/models/report.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-services-ranking',
  imports: [CurrencyArsPipe, TranslatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6" [style.border-left-color]="'var(--color-primary)'">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {{ 'reports.topServices' | translate }}
      </h3>
      <div class="space-y-3">
        @for (service of data().services; track service.name; let i = $index) {
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold w-6 text-center"
                  [style.color]="i === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'">
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ service.name }}
                </p>
                <p class="text-sm text-gray-900 dark:text-gray-100 ml-2">
                  {{ service.revenue | currencyArs: '1.2-2' }}
                </p>
              </div>
              <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  [style.background-color]="i === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'"
                  [style.width.%]="getBarWidth(service.revenue)"
                ></div>
              </div>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {{ service.count }} {{ 'reports.completedOrders' | translate }}
              </p>
            </div>
          </div>
        }
        @if (data().services.length === 0) {
          <p class="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            {{ 'common.noResults' | translate }}
          </p>
        }
      </div>
    </div>
  `,
})
export class ServicesRankingComponent {
  data = input.required<ServicesReport>();

  getBarWidth(revenue: number): number {
    const maxRevenue = Math.max(...this.data().services.map((s) => s.revenue), 1);
    return (revenue / maxRevenue) * 100;
  }
}
