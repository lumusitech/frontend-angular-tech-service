import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-how-it-works',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <section id="how-it-works" class="py-16 md:py-24">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">{{ 'landing.howItWorks.title' | translate }}</h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{{ 'landing.howItWorks.subtitle' | translate }}</p>
        </div>
        <div class="relative">
          <div class="hidden md:block absolute top-10 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-[2px] bg-gray-200 dark:bg-gray-700"></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            @for (step of steps; track step.number) {
              <div class="flex flex-col items-center text-center relative">
                <div class="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 border-4 border-white dark:border-gray-950 flex items-center justify-center mb-4 relative z-10">
                  <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ step.number }}</span>
                </div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">{{ 'landing.howItWorks.steps.' + step.number + '.title' | translate }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">{{ 'landing.howItWorks.steps.' + step.number + '.description' | translate }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingHowItWorksComponent {
  readonly steps = [
    { number: 1, icon: 'edit_note' },
    { number: 2, icon: 'person_add' },
    { number: 3, icon: 'qr_code_scanner' },
    { number: 4, icon: 'payments' },
  ];
}
