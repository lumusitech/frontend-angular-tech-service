import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-hero',
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <section class="py-16 md:py-24 overflow-hidden">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              {{ 'landing.hero.title' | translate }}
            </h1>
            <p class="text-lg text-gray-500 dark:text-gray-400 max-w-lg">
              {{ 'landing.hero.subtitle' | translate }}
            </p>
            <a mat-flat-button routerLink="/login" class="!bg-blue-600 !text-white !px-8 !py-3 !text-base !rounded-xl !font-medium">
              {{ 'landing.hero.cta' | translate }}
              <mat-icon class="!ml-1">arrow_forward</mat-icon>
            </a>
          </div>
          <div class="relative">
            <div class="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 rounded-3xl -rotate-3 scale-105"></div>
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-4">
              <div class="flex items-center gap-1.5 mb-3">
                <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div class="flex gap-3">
                <div class="hidden sm:block w-16 rounded-lg bg-gray-100 dark:bg-gray-800 p-2 space-y-2">
                  <div class="w-full h-2 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="w-3/4 h-2 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="w-full h-2 rounded bg-blue-500/30"></div>
                  <div class="w-1/2 h-2 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div class="flex-1 space-y-3">
                  <div class="grid grid-cols-3 gap-2">
                    <div class="h-14 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2">
                      <div class="w-1/2 h-1.5 rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                      <div class="w-3/4 h-3 rounded bg-blue-600 dark:bg-blue-400"></div>
                    </div>
                    <div class="h-14 rounded-lg bg-green-50 dark:bg-green-950/30 p-2">
                      <div class="w-1/2 h-1.5 rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                      <div class="w-3/4 h-3 rounded bg-green-600 dark:bg-green-400"></div>
                    </div>
                    <div class="h-14 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2">
                      <div class="w-1/2 h-1.5 rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                      <div class="w-3/4 h-3 rounded bg-amber-600 dark:bg-amber-400"></div>
                    </div>
                  </div>
                  <div class="h-32 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3">
                    <div class="w-1/3 h-2 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                    <svg class="w-full h-20" viewBox="0 0 200 60">
                      <polyline
                        fill="none"
                        stroke="rgb(37, 99, 235)"
                        stroke-width="2"
                        stroke-linecap="round"
                        points="0,50 30,40 60,45 90,30 120,35 150,20 180,25 200,15"
                      />
                      <polyline
                        fill="none"
                        stroke="rgb(239, 68, 68)"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-dasharray="4,4"
                        points="0,45 30,50 60,42 90,48 120,40 150,35 180,30 200,28"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingHeroComponent {}
