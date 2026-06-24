import { Component, inject, computed, signal, effect } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ThemeService } from '../../core/services/theme.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  DashboardLayoutService,
  DashboardWidgetId,
} from '../../core/services/dashboard-layout.service';
import { BusinessSettingsService } from '../../core/services/business-settings.service';

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
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

      <!-- Business -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-amber-600 dark:text-amber-400">business</mat-icon>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ 'settings.business' | translate }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'settings.businessSubtitle' | translate }}
            </p>
          </div>
        </div>

        <div class="ml-0 sm:ml-13 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.businessName' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.businessNamePlaceholder' | translate"
                [(ngModel)]="businessName"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.logoUrl' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.logoUrlPlaceholder' | translate"
                [(ngModel)]="logoUrl"
              />
            </mat-form-field>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {{ 'settings.primaryColor' | translate }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  [(ngModel)]="primaryColor"
                  class="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  [(ngModel)]="primaryColor"
                  class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {{ 'settings.secondaryColor' | translate }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  [(ngModel)]="secondaryColor"
                  class="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  [(ngModel)]="secondaryColor"
                  class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.businessAddress' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.businessAddressPlaceholder' | translate"
                [(ngModel)]="address"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.businessPhone' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.businessPhonePlaceholder' | translate"
                [(ngModel)]="phone"
              />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'settings.businessEmail' | translate }}</mat-label>
            <input
              matInput
              type="email"
              [placeholder]="'settings.businessEmailPlaceholder' | translate"
              [(ngModel)]="email"
            />
          </mat-form-field>

          <div class="flex justify-end">
            <button
              mat-flat-button
              color="primary"
              [disabled]="saving()"
              (click)="saveBusiness()"
            >
              @if (saving()) {
                {{ 'common.saving' | translate }}
              } @else {
                {{ 'common.save' | translate }}
              }
            </button>
          </div>
        </div>
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
            [value]="themeMode()"
            (change)="onThemeChange($event.value)"
          >
            <mat-button-toggle value="system">
              <span class="flex items-center gap-2">
                <mat-icon class="!w-5 !h-5 text-gray-500">brightness_auto</mat-icon>
                {{ 'settings.system' | translate }}
              </span>
            </mat-button-toggle>
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
            {{ 'settings.dashboardOrder' | translate }}
          </p>
          <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="space-y-2">
            @for (widgetId of layoutService.layout(); track widgetId) {
              <div
                cdkDrag
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div
                  cdkDragHandle
                  class="cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500"
                >
                  <mat-icon>drag_indicator</mat-icon>
                </div>
                <mat-checkbox
                  [checked]="layoutService.widgets()[widgetId]"
                  (change)="layoutService.toggleWidget(widgetId)"
                >
                  {{ ('settings.widget' + widgetId) | translate }}
                </mat-checkbox>
              </div>
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
  readonly businessSettingsService = inject(BusinessSettingsService);

  readonly themeMode = computed(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme_preference') : null;
    return stored ? stored : 'system';
  });

  readonly saving = signal(false);

  businessName = '';
  logoUrl = '';
  primaryColor = '#3B82F6';
  secondaryColor = '#10B981';
  address = '';
  phone = '';
  email = '';

  private readonly loadEffect = effect(() => {
    const data = this.businessSettingsService.settingsResource.value();
    if (data?.data) {
      this.businessName = data.data.businessName || '';
      this.logoUrl = data.data.logoUrl || '';
      this.primaryColor = this.toHex(data.data.primaryColor) || '#3B82F6';
      this.secondaryColor = this.toHex(data.data.secondaryColor) || '#10B981';
      this.address = data.data.address || '';
      this.phone = data.data.phone || '';
      this.email = data.data.email || '';
      this.applyColors();
    }
  });

  availableLanguages: LanguageOption[] = [
    { code: 'es', label: 'Español', flag: '🇦🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  currentFlag = computed(() => {
    const lang = this.availableLanguages.find((l) => l.code === this.translationService.locale());
    return lang?.flag || '🌐';
  });

  onThemeChange(mode: string): void {
    if (mode === 'system') {
      this.themeService.resetToSystem();
    } else {
      this.themeService.setTheme(mode as 'light' | 'dark');
    }
  }

  onLanguageChange(locale: string): void {
    this.translationService.setLocale(locale);
  }

  onDrop(event: CdkDragDrop<DashboardWidgetId[]>): void {
    this.layoutService.reorder(event.previousIndex, event.currentIndex);
  }

  saveBusiness(): void {
    this.saving.set(true);
    this.businessSettingsService
      .update({
        businessName: this.businessName,
        logoUrl: this.logoUrl,
        primaryColor: this.primaryColor,
        secondaryColor: this.secondaryColor,
        address: this.address,
        phone: this.phone,
        email: this.email,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.businessSettingsService.settingsResource.reload();
          this.applyColors();
        },
        error: () => this.saving.set(false),
      });
  }

  private applyColors(): void {
    if (typeof document !== 'undefined') {
      if (this.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', this.primaryColor);
      }
      if (this.secondaryColor) {
        document.documentElement.style.setProperty('--color-secondary', this.secondaryColor);
      }
    }
  }

  private toHex(value: string | null | undefined): string | null {
    if (!value) return null;
    if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
    return null;
  }
}
