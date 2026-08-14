import { Component, inject, output, computed, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GlobalSearchComponent } from '../global-search/global-search.component';

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  imports: [
    TranslatePipe,
    UpperCasePipe,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    GlobalSearchComponent,
  ],
  template: `
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 h-16 flex items-center justify-between"
    >
      <div class="flex items-center gap-4 min-w-0">
        <button
          (click)="toggleSidebar.emit()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden cursor-pointer shrink-0"
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

        <app-global-search />
      </div>

      <div class="flex items-center gap-3">
        <button
          (click)="themeService.toggle()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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

        <button mat-button [matMenuTriggerFor]="langMenu" class="!min-w-0 !px-2 !text-sm">
          {{ currentFlag() }} {{ translationService.locale() | uppercase }}
        </button>

        <mat-menu #langMenu="matMenu">
          @for (lang of availableLanguages; track lang.code) {
            <button mat-menu-item (click)="onLanguageChange(lang.code)">
              <span>{{ lang.flag }} {{ lang.label }}</span>
            </button>
          }
        </mat-menu>

        <button
          mat-icon-button
          (click)="navigateToNotifications()"
          [title]="'common.notifications' | translate"
          class="relative"
        >
          <mat-icon>notifications</mat-icon>
          @if (notificationsService.unreadCount() > 0) {
            <span
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {{
                notificationsService.unreadCount() > 99 ? '99+' : notificationsService.unreadCount()
              }}
            </span>
          }
        </button>

        <div
          class="flex items-center gap-2 pl-3 border-l-2"
          [style.border-left-color]="'var(--color-secondary)'"
        >
          @if (authService.user()?.avatar) {
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-lg overflow-hidden"
              [style.background-color]="'var(--color-secondary)'"
            >
              @if (authService.user()!.avatar!.startsWith('data:')) {
                <img
                  [src]="authService.user()!.avatar"
                  alt="Avatar del usuario"
                  class="w-full h-full object-cover"
                />
              } @else {
                {{ authService.user()!.avatar }}
              }
            </div>
          } @else {
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center"
              [style.background-color]="'var(--color-secondary)'"
            >
              <span class="text-white text-sm font-medium">
                {{ authService.user()?.name?.charAt(0) || 'U' }}
              </span>
            </div>
          }
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
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1 cursor-pointer"
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
export class HeaderComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly translationService = inject(TranslationService);
  readonly notificationsService = inject(NotificationsService);
  private readonly router = inject(Router);

  toggleSidebar = output<void>();

  availableLanguages: LanguageOption[] = [
    { code: 'es', label: 'Español', flag: '🇦🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  currentFlag = computed(() => {
    const lang = this.availableLanguages.find((l) => l.code === this.translationService.locale());
    return lang?.flag || '🌐';
  });

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationsService.getUnreadCount().subscribe({
        next: (count) => this.notificationsService.unreadCount.set(count),
      });
    }
  }

  onLanguageChange(locale: string): void {
    this.translationService.setLocale(locale);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/admin/notifications']);
  }
}
