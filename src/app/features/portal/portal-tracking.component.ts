import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../core/services/theme.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PortalSearchComponent } from './portal-search.component';
import { PortalResultComponent } from './portal-result.component';

@Component({
  selector: 'app-portal-tracking',
  imports: [
    MatIconModule,
    TranslatePipe,
    PortalSearchComponent,
    PortalResultComponent,
  ],
  template: `
    <div class="min-h-svh bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div class="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <svg class="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span class="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">Tech Service</span>
          </div>
          <button
            (click)="themeService.toggle()"
            class="p-2 rounded-full cursor-pointer transition-colors text-gray-500 dark:text-gray-400"
            [title]="themeService.isDark() ? 'Modo claro' : 'Modo oscuro'"
          >
            <mat-icon>
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
