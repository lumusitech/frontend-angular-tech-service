import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-cta',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <section class="py-14 sm:py-20 px-4">
      <div class="max-w-5xl mx-auto">
        <div
          class="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-950 text-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden text-center border border-blue-800/40"
        >
          <!-- Decoración visual (Luz radial) -->
          <div
            class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
          ></div>
          <div
            class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
          ></div>

          <div class="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2
              class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
            >
              {{ 'landing.cta.title' | translate }}
            </h2>
            <p class="text-sm sm:text-base text-blue-100/80 max-w-lg mx-auto leading-relaxed">
              {{ 'landing.cta.subtitle' | translate }}
            </p>

            <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                mat-flat-button
                routerLink="/login"
                class="!bg-white hover:!bg-blue-50 !text-blue-900 !px-8 !py-3.5 !text-base !rounded-xl !font-bold !shadow-xl transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                {{ 'landing.cta.button' | translate }}
                <mat-icon class="!ml-1">arrow_forward</mat-icon>
              </a>

              <a
                routerLink="/track"
                class="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 text-sm font-semibold text-blue-200 hover:text-white transition-colors w-full sm:w-auto"
              >
                <mat-icon class="!w-4 !h-4 !text-base">search</mat-icon>
                <span>Probá rastrear una orden</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingCtaComponent {}
