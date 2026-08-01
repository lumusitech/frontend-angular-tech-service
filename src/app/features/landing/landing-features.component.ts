import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-features',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  template: `
    <section id="features" class="py-14 sm:py-20 md:py-28 bg-gray-50/60 dark:bg-gray-900/40">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Encabezado de sección -->
        <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Características destacadas
          </span>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ 'landing.features.title' | translate }}
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {{ 'landing.features.subtitle' | translate }}
          </p>
        </div>

        <!-- Grid de características (Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          @for (feature of features; track feature.key) {
            <div
              class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <!-- Icon Badge con gradiente -->
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <mat-icon class="!w-6 !h-6 !text-2xl">{{ feature.icon }}</mat-icon>
                </div>

                <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {{ 'landing.features.items.' + feature.key + '.title' | translate }}
                </h3>

                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ 'landing.features.items.' + feature.key + '.description' | translate }}
                </p>
              </div>
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
