import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../core/services/theme.service';
import { PortalSearchComponent } from './portal-search.component';
import { PortalResultComponent } from './portal-result.component';

import { BrandLogoComponent } from '../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-portal-tracking',
  imports: [
    MatIconModule,
    PortalSearchComponent,
    PortalResultComponent,
    BrandLogoComponent,
  ],
  template: `
    <div class="min-h-svh bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div class="max-w-xl mx-auto px-4 h-18 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <app-brand-logo variant="full" size="w-7 h-7" />
            <span class="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">Tech Service</span>
          </div>
          <button
            (click)="themeService.toggle()"
            class="w-10 h-10 rounded-full cursor-pointer transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
            [title]="themeService.isDark() ? 'Modo claro' : 'Modo oscuro'"
          >
            <mat-icon class="!w-6 !h-6 !text-2xl leading-none flex items-center justify-center">
              {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
            </mat-icon>
          </button>
        </div>
      </header>

      <main class="flex-1 flex flex-col">
        <div class="max-w-xl mx-auto w-full px-4 py-4 flex-1 flex flex-col">
          @if (!code()) {
            <app-portal-search (track)="onTrack($event)" />
          } @else {
            <app-portal-result [code]="code()" (search)="onSearch()" />
          }
        </div>
      </main>

      <footer class="py-4 text-center">
        <p class="text-xs text-gray-400 dark:text-gray-600">
          Tech Service &copy; {{ currentYear }}
        </p>
      </footer>
    </div>
  `,
})
export class PortalTrackingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);

  readonly code = signal(this.route.snapshot.paramMap.get('code') || '');
  readonly currentYear = new Date().getFullYear();

  onTrack(code: string): void {
    this.code.set(code);
    this.router.navigate(['/track', code]);
  }

  onSearch(): void {
    this.code.set('');
    this.router.navigate(['/track']);
  }
}
