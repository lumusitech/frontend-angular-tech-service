import { Component, input, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PortalPaymentSummary } from '../../core/models/portal.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-portal-payment-summary',
  imports: [MatIconModule, MatCardModule, TranslatePipe, CurrencyArsPipe],
  template: `
    <mat-card>
      <mat-card-content class="!p-5">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {{ 'portal.payments.title' | translate }}
        </h3>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ 'portal.payments.total' | translate }}</span>
            <span class="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
              {{ summary().totalApproved | currencyArs }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            @if (summary().isFullyPaid) {
              <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <mat-icon class="!w-3 !h-3 text-white">check</mat-icon>
              </div>
              <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {{ 'portal.payments.fullyPaid' | translate }}
              </span>
            } @else {
              <div class="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                <mat-icon class="!w-3 !h-3 text-white">schedule</mat-icon>
              </div>
              <span class="text-xs font-medium text-amber-600 dark:text-amber-400">
                {{ 'portal.payments.partial' | translate }}
              </span>
            }
          </div>

          @if (hasInstallments()) {
            <p class="text-xs text-gray-400 dark:text-gray-500">
              {{ 'portal.payments.installments' | translate : { pending: '' + summary().installmentsPending, total: '' + summary().installmentsTotal } }}
            </p>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class PortalPaymentSummaryComponent {
  readonly summary = input.required<PortalPaymentSummary>();

  readonly hasInstallments = computed(
    () => this.summary().installmentsTotal > 0,
  );
}
