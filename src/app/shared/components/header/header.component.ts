import { Component, inject, input, output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header
      class="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between"
    >
      <div class="flex items-center gap-4">
        <button
          (click)="toggleSidebar.emit()"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div class="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
          <svg
            class="w-4 h-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar..."
            class="bg-transparent outline-none text-sm text-gray-700 w-full"
          />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div class="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ authService.user()?.name?.charAt(0) || 'U' }}
            </span>
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-gray-900">
              {{ authService.user()?.name || 'Usuario' }}
            </p>
            <p class="text-xs text-gray-500 capitalize">
              {{ authService.user()?.role || 'admin' }}
            </p>
          </div>
          <button
            (click)="authService.logout()"
            class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-1"
            title="Cerrar sesión"
          >
            <svg
              class="w-4 h-4 text-gray-500"
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
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  toggleSidebar = output<void>();
}
