import { Component, inject, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ThemeService } from '../../core/services/theme.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  DashboardLayoutService,
  DashboardWidgetId,
} from '../../core/services/dashboard-layout.service';

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

interface WidgetOption {
  id: DashboardWidgetId;
  labelKey: string;
}

@Component({
  selector: 'app-settings',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    TranslatePipe,
    UpperCasePipe,
  ],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ 'settings.title' | translate }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ 'settings.subtitle' | translate }}
        </p>
      </div>

      <!-- Appearance -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-purple-600 dark:text-purple-400">palette</mat-icon>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'settings.appearance' | translate }}
          </h2>
        </div>

        <div class="ml-13">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {{ 'settings.theme' | translate }}
          </p>
          <mat-button-toggle-group
            [value]="themeService.theme()"
            (change)="themeService.setTheme($event.value)"
          >
            <mat-button-toggle value="light">
              <span class="flex items-center gap-2">
                <mat-icon class="!w-5 !h-5 text-amber-500">light_mode</mat-icon>
                {{ 'settings.light' | translate }}
              </span>
            </mat-button-toggle>
            <mat-button-toggle value="dark">
              <span class="flex items-center gap-2">
                <mat-icon class="!w-5 !h-5 text-indigo-400">dark_mode</mat-icon>
                {{ 'settings.dark' | translate }}
              </span>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </div>

      <!-- Language -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-blue-600 dark:text-blue-400">translate</mat-icon>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'settings.language' | translate }}
          </h2>
        </div>

        <div class="ml-13">
          <button mat-stroked-button [matMenuTriggerFor]="langMenu">
            {{ currentFlag() }} {{ translationService.locale() | uppercase }}
            <mat-icon>arrow_drop_down</mat-icon>
          </button>

          <mat-menu #langMenu="matMenu">
            @for (lang of availableLanguages; track lang.code) {
              <button mat-menu-item (click)="onLanguageChange(lang.code)">
                <span>{{ lang.flag }} {{ lang.label }}</span>
              </button>
            }
          </mat-menu>
        </div>
      </div>

      <!-- Dashboard Widgets -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-emerald-600 dark:text-emerald-400">dashboard</mat-icon>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'settings.dashboard' | translate }}
          </h2>
        </div>

        <div class="ml-13">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {{ 'settings.visibleWidgets' | translate }}
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            @for (widget of widgetOptions; track widget.id) {
              <mat-checkbox
                [checked]="layoutService.widgets()[widget.id]"
                (change)="layoutService.toggleWidget(widget.id)"
              >
                {{ widget.labelKey | translate }}
              </mat-checkbox>
            }
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button mat-stroked-button (click)="layoutService.reset()">
              <mat-icon>restart_alt</mat-icon>
              {{ 'settings.resetLayout' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  readonly translationService = inject(TranslationService);
  readonly layoutService = inject(DashboardLayoutService);

  availableLanguages: LanguageOption[] = [
    { code: 'es', label: 'Español', flag: '🇦🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  widgetOptions: WidgetOption[] = [
    { id: 'kpis', labelKey: 'settings.widgetKpis' },
    { id: 'pendingItems', labelKey: 'settings.widgetPendingItems' },
    { id: 'inquiries', labelKey: 'settings.widgetInquiries' },
    { id: 'charts', labelKey: 'settings.widgetCharts' },
    { id: 'quickActions', labelKey: 'settings.widgetQuickActions' },
    { id: 'topClients', labelKey: 'settings.widgetTopClients' },
  ];

  currentFlag = computed(() => {
    const lang = this.availableLanguages.find((l) => l.code === this.translationService.locale());
    return lang?.flag || '🌐';
  });

  onLanguageChange(locale: string): void {
    this.translationService.setLocale(locale);
  }
}
