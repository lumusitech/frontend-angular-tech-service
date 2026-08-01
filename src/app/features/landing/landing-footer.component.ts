import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { BrandLogoComponent } from '../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink, TranslatePipe, BrandLogoComponent],
  template: `
    <footer class="border-t border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-950 py-10">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <!-- Logo & Nombre -->
          <div class="flex items-center gap-2.5">
            <app-brand-logo variant="full" size="w-6 h-6" customClass="text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Tech Service</span>
          </div>

          <!-- Enlaces de navegación rápida -->
          <nav class="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <a routerLink="/login" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {{ 'landing.footer.login' | translate }}
            </a>
            <a routerLink="/track" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {{ 'landing.footer.track' | translate }}
            </a>
            <a href="#features" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {{ 'landing.header.features' | translate }}
            </a>
          </nav>

          <!-- Copyright -->
          <p class="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-right">
            {{ 'landing.footer.copyright' | translate }}
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class LandingFooterComponent {}
