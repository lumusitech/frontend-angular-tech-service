import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-tech-layout',
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="h-dvh flex flex-col bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 h-14 flex items-center justify-between shrink-0"
      >
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">Tech Service</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ authService.user()?.name?.charAt(0) || 'T' }}
            </span>
          </div>
          <div class="hidden sm:block">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ authService.user()?.name || 'Técnico' }}
            </p>
          </div>
          <button
            (click)="authService.logout()"
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-4 pb-20">
        <router-outlet />
      </main>

      <!-- Bottom navigation -->
      <app-bottom-nav />
    </div>
  `,
})
export class TechLayoutComponent {
  readonly authService = inject(AuthService);
}
