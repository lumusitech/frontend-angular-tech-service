import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-how-it-works',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  template: `
    <section id="how-it-works" class="py-14 sm:py-20 md:py-28 bg-white dark:bg-gray-950">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Encabezado de sección -->
        <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Flujo de trabajo simple
          </span>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ 'landing.howItWorks.title' | translate }}
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {{ 'landing.howItWorks.subtitle' | translate }}
          </p>
        </div>

        <!-- Contenedor del proceso -->
        <div class="relative isolate">
          <!-- Líneas de conexión horizontal (visibles en pantallas medianas/grandes) -->
          <div
            class="hidden md:block absolute top-10 left-[calc(12.5%+32px)] w-[calc(25%-64px)] h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 z-0 opacity-40"
          ></div>
          <div
            class="hidden md:block absolute top-10 left-[calc(37.5%+32px)] w-[calc(25%-64px)] h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 z-0 opacity-40"
          ></div>
          <div
            class="hidden md:block absolute top-10 left-[calc(62.5%+32px)] w-[calc(25%-64px)] h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 z-0 opacity-40"
          ></div>

          <!-- Pasos (Mobile: apilados verticalmente con línea conectora vertical, Desktop: 4 columnas) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            @for (step of steps; track step.number) {
              <div class="group flex flex-col items-center text-center relative bg-gray-50/70 dark:bg-gray-900/50 p-6 sm:p-5 rounded-2xl border border-gray-200/60 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                <!-- Badge con número e icono -->
                <div
                  class="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 shadow-md flex flex-col items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                >
                  <span class="text-xs font-bold text-gray-400 dark:text-gray-500 leading-none">0{{ step.number }}</span>
                  <mat-icon class="!w-5 !h-5 !text-xl text-blue-600 dark:text-blue-400 mt-0.5">{{ step.icon }}</mat-icon>
                </div>

                <!-- Título del paso -->
                <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {{ 'landing.howItWorks.steps.' + step.number + '.title' | translate }}
                </h3>

                <!-- Descripción -->
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {{ 'landing.howItWorks.steps.' + step.number + '.description' | translate }}
                </p>
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
