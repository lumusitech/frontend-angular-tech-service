import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, MatFormFieldModule, MatSelectModule],
  template: `
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 h-16 flex items-center justify-between"
    >
      <div class="flex items-center gap-4">
        <button
          (click)="toggleSidebar.emit()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
        >
          <svg
            class="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div
          class="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 w-64"
        >
          <svg
            class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2"
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
            [placeholder]="'common.search' | translate"
            class="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 w-full"
          />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          (click)="themeService.toggle()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          [title]="themeService.isDark() ? 'Light mode' : 'Dark mode'"
        >
          @if (themeService.isDark()) {
            <svg
              class="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          } @else {
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          }
        </button>

        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="!m-0 !min-w-0">
          <mat-select
            [value]="translationService.locale()"
            (selectionChange)="onLanguageChange($event.value)"
          >
            @for (lang of availableLanguages; track lang.code) {
              <mat-option [value]="lang.code"> {{ lang.flag }} {{ lang.label }} </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ authService.user()?.name?.charAt(0) || 'U' }}
            </span>
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ authService.user()?.name || 'Usuario' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {{ authService.user()?.role || 'admin' }}
            </p>
          </div>
          <button
            (click)="authService.logout()"
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1"
            [title]="'auth.logout' | translate"
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
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly translationService = inject(TranslationService);
  readonly router = inject(Router);

  toggleSidebar = output<void>();

  availableLanguages: LanguageOption[] = [
    { code: 'es', label: 'Español', flag: '🇦🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  onLanguageChange(locale: string): void {
    this.translationService.setLocale(locale);
  }
}
