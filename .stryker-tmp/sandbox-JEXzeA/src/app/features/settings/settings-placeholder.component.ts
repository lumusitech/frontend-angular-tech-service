// @ts-nocheck
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-settings-placeholder',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ 'settings.title' | translate }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">{{ 'settings.subtitle' | translate }}</p>
      </div>
      <div class="flex flex-col items-center justify-center py-16 px-4">
        <div
          class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4"
        >
          <mat-icon class="text-blue-600 dark:text-blue-400 text-3xl">settings</mat-icon>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          {{ 'settings.comingSoon' | translate }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
          {{ 'settings.comingSoonMessage' | translate }}
        </p>
      </div>
    </div>
  `
})
export class SettingsPlaceholderComponent {}