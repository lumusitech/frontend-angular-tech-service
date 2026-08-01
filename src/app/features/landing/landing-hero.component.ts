import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <section class="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      <!-- Fondo decorativo con gradientes sutiles -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-500/5 blur-3xl pointer-events-none -z-10"></div>

      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <!-- Columna Texto (Mobile: 1ª posición) -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <!-- Badge superior -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 shadow-2xs">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
              </span>
              {{ 'landing.hero.badge' | translate }}
            </div>

            <!-- Título principal -->
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.15] tracking-tight">
              Gestión de servicios técnicos
              <span class="block mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-300 bg-clip-text text-transparent">
                simplificada y en tiempo real
              </span>
            </h1>

            <!-- Subtítulo -->
            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {{ 'landing.hero.subtitle' | translate }}
            </p>

            <!-- Acciones CTA (Mobile-first stack vertical, Desktop horizontal) -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                mat-flat-button
                routerLink="/login"
                class="!bg-blue-600 hover:!bg-blue-700 !text-white !px-7 !py-3.5 !text-base !rounded-xl !font-semibold !shadow-lg !shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {{ 'landing.hero.cta' | translate }}
                <mat-icon class="!w-5 !h-5 !text-xl">arrow_forward</mat-icon>
              </a>

              <a
                mat-stroked-button
                routerLink="/track"
                class="!border-gray-300 dark:!border-gray-700 !text-gray-700 dark:!text-gray-200 hover:!bg-gray-50 dark:hover:!bg-gray-800 !px-6 !py-3.5 !text-base !rounded-xl !font-semibold transition-all flex items-center justify-center gap-2"
              >
                <mat-icon class="!w-5 !h-5 !text-xl text-blue-600 dark:text-blue-400">qr_code_scanner</mat-icon>
                {{ 'landing.hero.secondaryCta' | translate }}
              </a>
            </div>

            <!-- Features destacadas rápidas -->
            <div class="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              <div class="flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-base text-emerald-500">check_circle</mat-icon>
                <span>QR Code Tracking</span>
              </div>
              <div class="flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-base text-emerald-500">check_circle</mat-icon>
                <span>Sin descarga requerida (PWA)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-base text-emerald-500">check_circle</mat-icon>
                <span>MercadoPago Integrado</span>
              </div>
            </div>
          </div>

          <!-- Columna Mockup interactivo (Mobile-first responsive card) -->
          <div class="lg:col-span-5 relative mt-4 lg:mt-0">
            <!-- Glow de fondo -->
            <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-20 dark:opacity-30 blur-xl"></div>

            <div class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-2xl p-4 sm:p-5 overflow-hidden">
              <!-- Window header bar -->
              <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                <div class="flex items-center gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                  <div class="w-3 h-3 rounded-full bg-green-400/80"></div>
                  <span class="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500 font-mono">TS-A1B2C3</span>
                </div>
                <div class="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  En reparación
                </div>
              </div>

              <!-- Preview body -->
              <div class="space-y-3.5">
                <!-- Status timeline preview -->
                <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700/60">
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="font-semibold text-gray-700 dark:text-gray-200">Notebook Lenovo ThinkPad</span>
                    <span class="text-blue-600 dark:text-blue-400 font-bold">75% Completado</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 w-3/4 rounded-full"></div>
                  </div>
                </div>

                <!-- Live Metrics Grid -->
                <div class="grid grid-cols-2 gap-2.5">
                  <div class="bg-blue-50/60 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <div class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Técnico Asignado</div>
                    <div class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                      <div class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">CR</div>
                      Carlos R.
                    </div>
                  </div>

                  <div class="bg-indigo-50/60 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                    <div class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Tiempo Estimado</div>
                    <div class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                      24 hs
                    </div>
                  </div>
                </div>

                <!-- Recent Activity row -->
                <div class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700/80 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <mat-icon class="!w-4 !h-4 !text-base">check</mat-icon>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-gray-200">Cambio de pantalla</div>
                      <div class="text-[10px] text-gray-400">Hace 15 minutos</div>
                    </div>
                  </div>
                  <span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-mono">OK</span>
                </div>
              </div>

              <!-- Floating badge overlay -->
              <div class="absolute -bottom-2 -right-2 sm:bottom-4 sm:right-4 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3.5 py-2 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-gray-700 dark:border-gray-200">
                <mat-icon class="!w-4 !h-4 !text-base text-amber-400">verified</mat-icon>
                Trazabilidad 100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingHeroComponent {}
