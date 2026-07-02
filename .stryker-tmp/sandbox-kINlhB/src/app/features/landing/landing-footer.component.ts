// @ts-nocheck
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-landing-footer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">Tech Service</span>
          </div>
          <nav class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a routerLink="/login" class="hover:text-gray-900 dark:hover:text-white transition-colors">{{ 'landing.footer.login' | translate }}</a>
            <a routerLink="/track" class="hover:text-gray-900 dark:hover:text-white transition-colors">{{ 'landing.footer.track' | translate }}</a>
          </nav>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ 'landing.footer.copyright' | translate }}</p>
        </div>
      </div>
    </footer>
  `
})
export class LandingFooterComponent {}