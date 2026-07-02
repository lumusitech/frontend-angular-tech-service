// @ts-nocheck
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../core/services/theme.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-landing-header',
  imports: [RouterLink, MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <svg class="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span class="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">Tech Service</span>
        </div>
        <nav class="hidden sm:flex items-center gap-6">
          <a href="#features" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{{ 'landing.header.features' | translate }}</a>
          <a href="#how-it-works" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{{ 'landing.header.howItWorks' | translate }}</a>
        </nav>
        <div class="flex items-center gap-2">
          <button
            (click)="themeService.toggle()"
            class="p-2 rounded-full cursor-pointer transition-colors text-gray-500 dark:text-gray-400"
          >
            <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          <a mat-stroked-button routerLink="/login" class="!text-blue-600 dark:!text-blue-400 !border-blue-200 dark:!border-blue-800">
            {{ 'landing.header.login' | translate }}
          </a>
        </div>
      </div>
    </header>
  `
})
export class LandingHeaderComponent {
  readonly themeService = inject(ThemeService);
}