// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, inject, output, computed, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}
@Component({
  selector: 'app-header',
  imports: [TranslatePipe, UpperCasePipe, MatMenuModule, MatButtonModule, MatIconModule],
  template: `
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 h-16 flex items-center justify-between"
    >
      <div class="flex items-center gap-4">
        <button
          (click)="toggleSidebar.emit()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden cursor-pointer"
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
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {{ notificationsService.unreadCount() > 99 ? '99+' : notificationsService.unreadCount() }}
            </span>
          }
        </button>

        <div class="flex items-center gap-2 pl-3 border-l-2" [style.border-left-color]="'var(--color-secondary)'">
          @if (authService.user()?.avatar) {
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg overflow-hidden" [style.background-color]="'var(--color-secondary)'">
              @if (authService.user()!.avatar!.startsWith('data:')) {
                <img [src]="authService.user()!.avatar" class="w-full h-full object-cover" />
              } @else {
                {{ authService.user()!.avatar }}
              }
            </div>
          } @else {
            <div class="w-8 h-8 rounded-full flex items-center justify-center" [style.background-color]="'var(--color-secondary)'">
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
  `
})
export class HeaderComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly translationService = inject(TranslationService);
  readonly notificationsService = inject(NotificationsService);
  private readonly websocketService = inject(WebsocketService);
  private readonly router = inject(Router);
  toggleSidebar = output<void>();
  availableLanguages: LanguageOption[] = stryMutAct_9fa48("5913") ? [] : (stryCov_9fa48("5913"), [stryMutAct_9fa48("5914") ? {} : (stryCov_9fa48("5914"), {
    code: stryMutAct_9fa48("5915") ? "" : (stryCov_9fa48("5915"), 'es'),
    label: stryMutAct_9fa48("5916") ? "" : (stryCov_9fa48("5916"), 'Español'),
    flag: stryMutAct_9fa48("5917") ? "" : (stryCov_9fa48("5917"), '🇦🇷')
  }), stryMutAct_9fa48("5918") ? {} : (stryCov_9fa48("5918"), {
    code: stryMutAct_9fa48("5919") ? "" : (stryCov_9fa48("5919"), 'en'),
    label: stryMutAct_9fa48("5920") ? "" : (stryCov_9fa48("5920"), 'English'),
    flag: stryMutAct_9fa48("5921") ? "" : (stryCov_9fa48("5921"), '🇺🇸')
  })]);
  currentFlag = computed(() => {
    if (stryMutAct_9fa48("5922")) {
      {}
    } else {
      stryCov_9fa48("5922");
      const lang = this.availableLanguages.find(stryMutAct_9fa48("5923") ? () => undefined : (stryCov_9fa48("5923"), l => stryMutAct_9fa48("5926") ? l.code !== this.translationService.locale() : stryMutAct_9fa48("5925") ? false : stryMutAct_9fa48("5924") ? true : (stryCov_9fa48("5924", "5925", "5926"), l.code === this.translationService.locale())));
      return stryMutAct_9fa48("5929") ? lang?.flag && '🌐' : stryMutAct_9fa48("5928") ? false : stryMutAct_9fa48("5927") ? true : (stryCov_9fa48("5927", "5928", "5929"), (stryMutAct_9fa48("5930") ? lang.flag : (stryCov_9fa48("5930"), lang?.flag)) || (stryMutAct_9fa48("5931") ? "" : (stryCov_9fa48("5931"), '🌐')));
    }
  });
  ngOnInit(): void {
    if (stryMutAct_9fa48("5932")) {
      {}
    } else {
      stryCov_9fa48("5932");
      if (stryMutAct_9fa48("5934") ? false : stryMutAct_9fa48("5933") ? true : (stryCov_9fa48("5933", "5934"), this.authService.isAuthenticated())) {
        if (stryMutAct_9fa48("5935")) {
          {}
        } else {
          stryCov_9fa48("5935");
          this.notificationsService.getUnreadCount().subscribe(stryMutAct_9fa48("5936") ? {} : (stryCov_9fa48("5936"), {
            next: stryMutAct_9fa48("5937") ? () => undefined : (stryCov_9fa48("5937"), count => this.notificationsService.unreadCount.set(count))
          }));
          this.websocketService.connect();
        }
      }
    }
  }
  onLanguageChange(locale: string): void {
    if (stryMutAct_9fa48("5938")) {
      {}
    } else {
      stryCov_9fa48("5938");
      this.translationService.setLocale(locale);
    }
  }
  navigateToNotifications(): void {
    if (stryMutAct_9fa48("5939")) {
      {}
    } else {
      stryCov_9fa48("5939");
      this.router.navigate(stryMutAct_9fa48("5940") ? [] : (stryCov_9fa48("5940"), [stryMutAct_9fa48("5941") ? "" : (stryCov_9fa48("5941"), '/admin/notifications')]));
    }
  }
}