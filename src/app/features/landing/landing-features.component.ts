import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-features',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <section id="features" class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">{{ 'landing.features.title' | translate }}</h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{{ 'landing.features.subtitle' | translate }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (feature of features; track feature.key) {
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                <mat-icon class="!w-5 !h-5 text-blue-600 dark:text-blue-400">{{ feature.icon }}</mat-icon>
              </div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">{{ 'landing.features.items.' + feature.key + '.title' | translate }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ 'landing.features.items.' + feature.key + '.description' | translate }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingFeaturesComponent {
  readonly features = [
    { key: 'workOrders', icon: 'assignment' },
    { key: 'tracking', icon: 'pin_drop' },
    { key: 'payments', icon: 'receipt_long' },
    { key: 'dashboard', icon: 'bar_chart' },
    { key: 'multiTenant', icon: 'business' },
    { key: 'notifications', icon: 'notifications_active' },
  ];
}
