import { Component, HostListener, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../core/services/theme.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { BrandLogoComponent } from '../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, TranslatePipe, BrandLogoComponent],
  template: `
    <!-- Header fijo con aparición inteligente al scrollear hacia arriba -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out bg-white/85 dark:bg-gray-950/85 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/80"
      [class.-translate-y-full]="isHeaderHidden()"
      [class.translate-y-0]="!isHeaderHidden()"
      [class.shadow-md]="isScrolled()"
    >
      <div class="max-w-6xl mx-auto px-4 h-18 sm:h-20 flex items-center justify-between gap-3">
        <!-- Logo de marca -->
        <a routerLink="/" class="flex items-center gap-2.5 group focus:outline-hidden">
          <app-brand-logo variant="full" size="w-7 h-7 sm:w-8 sm:h-8" customClass="text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform" />
          <span class="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Tech Service
          </span>
        </a>

        <!-- Enlaces Desktop -->
        <nav class="hidden md:flex items-center gap-8">
          <a
            href="#features"
            class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {{ 'landing.header.features' | translate }}
          </a>
          <a
            href="#how-it-works"
            class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {{ 'landing.header.howItWorks' | translate }}
          </a>
          <a
            routerLink="/track"
            class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <mat-icon class="!w-4 !h-4 !text-base">search</mat-icon>
            {{ 'landing.header.track' | translate }}
          </a>
        </nav>

        <!-- Acciones principales -->
        <div class="flex items-center gap-2">
          <!-- Toggle Modo Oscuro -->
          <button
            (click)="themeService.toggle()"
            type="button"
            aria-label="Cambiar tema"
            class="w-10 h-10 rounded-full cursor-pointer transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
          >
            <mat-icon class="!w-6 !h-6 !text-2xl leading-none flex items-center justify-center">
              {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
            </mat-icon>
          </button>

          <!-- Rastrear (Mobile shortcut) -->
          <a
            routerLink="/track"
            class="md:hidden w-10 h-10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            [title]="'landing.header.track' | translate"
          >
            <mat-icon class="!w-5 !h-5 !text-xl flex items-center justify-center">pin_drop</mat-icon>
          </a>

          <!-- Botón Iniciar Sesión -->
          <a
            mat-flat-button
            routerLink="/login"
            class="!bg-blue-600 dark:!bg-blue-600 hover:!bg-blue-700 !text-white !px-4 sm:!px-5 !py-2.5 !text-xs sm:!text-sm !rounded-xl !font-medium !shadow-xs"
          >
            {{ 'landing.header.login' | translate }}
          </a>
        </div>
      </div>
    </header>

    <!-- Espaciador para evitar saltos de contenido debido a position: fixed -->
    <div class="h-18 sm:h-20"></div>
  `,
})
export class LandingHeaderComponent {
  readonly themeService = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isHeaderHidden = signal(false);
  readonly isScrolled = signal(false);

  private lastScrollY = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const currentScrollY = window.scrollY;

    this.isScrolled.set(currentScrollY > 20);

    // Si el usuario scrollea hacia abajo más de 120px, oculta el header.
    // Si scrollea hacia arriba o está arriba de todo, lo muestra.
    if (currentScrollY > this.lastScrollY && currentScrollY > 120) {
      this.isHeaderHidden.set(true);
    } else {
      this.isHeaderHidden.set(false);
    }

    this.lastScrollY = currentScrollY;
  }
}
