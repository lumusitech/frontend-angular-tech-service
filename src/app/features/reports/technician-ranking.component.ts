import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TechnicianRanking } from '../../core/models/report.interfaces';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-technician-ranking',
  imports: [DecimalPipe, CurrencyArsPipe, TranslatePipe],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6"
      [style.border-left-color]="'var(--color-primary)'"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {{ 'reports.technicianRanking' | translate }}
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th
                class="text-left py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                #
              </th>
              <th
                class="text-left py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'technician.title' | translate }}
              </th>
              <th
                class="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'reports.completedOrders' | translate }}
              </th>
              <th
                class="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'reports.avgResolution' | translate }}
              </th>
              <th
                class="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'reports.totalRevenue' | translate }}
              </th>
            </tr>
          </thead>
          <tbody>
            @for (tech of data(); track tech.technicianId; let i = $index) {
              <tr
                class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                (click)="technicianClick.emit(tech.technicianId)"
              >
                <td class="py-2.5 text-gray-400 dark:text-gray-500 font-bold">{{ i + 1 }}</td>
                <td class="py-2.5 font-medium text-gray-900 dark:text-gray-100">{{ tech.name }}</td>
                <td class="py-2.5 text-right text-gray-900 dark:text-gray-100">
                  {{ tech.completedOrders }}
                </td>
                <td class="py-2.5 text-right text-gray-900 dark:text-gray-100">
                  {{ tech.averageResolutionDays | number: '1.1-1' }}d
                </td>
                <td class="py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
                  {{ tech.totalRevenue | currencyArs: '1.2-2' }}
                </td>
              </tr>
            }
            @if (data().length === 0) {
              <tr>
                <td colspan="5" class="py-4 text-center text-gray-400 dark:text-gray-500">
                  {{ 'common.noResults' | translate }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class TechnicianRankingComponent {
  data = input.required<TechnicianRanking[]>();
  technicianClick = output<string>();
}
