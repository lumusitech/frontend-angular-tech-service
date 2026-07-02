import { Component, input, output } from '@angular/core';
import { TopClient } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-top-clients-widget',
  imports: [TranslatePipe, CurrencyArsPipe],
  template: `
    @if (clients().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6" [style.border-left-color]="primaryColor()">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.topClients' | translate }}
        </h3>
        <div class="space-y-2">
          @for (client of clients(); track client.clientId; let i = $index) {
            <div class="flex items-center justify-between p-3 rounded-lg border-l-[3px] cursor-pointer hover:opacity-80 transition-opacity"
                 [style.border-left-color]="i === 0 ? primaryColor() : secondaryColor()"
                 [style.background-color]="i === 0 ? primaryColor() + '0a' : secondaryColor() + '05'"
                 (click)="clientClick.emit({ id: client.clientId, name: client.clientName })">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      [style.background-color]="i === 0 ? primaryColor() + '1a' : secondaryColor() + '1a'"
                      [style.color]="i === 0 ? primaryColor() : secondaryColor()">
                  {{ i + 1 }}
                </span>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ client.clientName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ client.workOrderCount }} {{ 'dashboard.orders' | translate }}
                  </p>
                </div>
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
  primaryColor = input<string>('#1E40AF');
  secondaryColor = input<string>('#059669');
  clientClick = output<{ id: string; name: string }>();
}
