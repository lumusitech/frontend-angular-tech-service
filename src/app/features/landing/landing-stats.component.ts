import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-stats',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  template: `
    <section
      class="py-12 sm:py-16 md:py-20 bg-gray-50/80 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-800/60"
    >
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2
            class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2"
          >
            {{ 'landing.stats.title' | translate }}
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {{ 'landing.stats.subtitle' | translate }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          @for (stat of stats; track stat.key) {
            <div
              class="relative group bg-white dark:bg-gray-800/80 rounded-2xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-start"
            >
              <div
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"
              >
                <mat-icon class="!w-5 !h-5 !text-xl">{{ stat.icon }}</mat-icon>
              </div>
              <span
                class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent"
              >
                {{ 'landing.stats.items.' + stat.key + '.value' | translate }}
              </span>
              <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ 'landing.stats.items.' + stat.key + '.label' | translate }}
              </span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingStatsComponent {
  readonly stats = [
    { key: 'orders', icon: 'task_alt' },
    { key: 'uptime', icon: 'cloud_done' },
    { key: 'tracking', icon: 'speed' },
    { key: 'satisfaction', icon: 'star' },
  ];
}
