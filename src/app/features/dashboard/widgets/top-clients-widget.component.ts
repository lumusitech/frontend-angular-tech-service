import { Component, input } from '@angular/core';
import { TopClient } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-top-clients-widget',
  imports: [TranslatePipe, CurrencyArsPipe],
  template: `
    @if (clients().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.topClients' | translate }}
        </h3>
        <div class="space-y-3">
          @for (client of clients(); track client.clientId) {
            <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ client.clientName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ client.workOrderCount }} {{ 'dashboard.orders' | translate }}
                </p>
              </div>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ client.totalSpent | currencyArs: '1.2-2' }}
              </p>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class TopClientsWidgetComponent {
  clients = input.required<TopClient[]>();
}
