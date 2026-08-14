import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PwaService } from '../../../core/services/pwa.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-install-prompt',
  imports: [MatIconModule, TranslatePipe],
  template: `
    @if (pwaService.installAvailable()) {
      <div
        class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 shadow-lg"
        role="dialog"
        [attr.aria-label]="'pwa.installAriaLabel' | translate"
      >
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="hidden sm:flex w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 items-center justify-center shrink-0"
            >
              <mat-icon class="text-blue-600 dark:text-blue-400">download</mat-icon>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ 'pwa.title' | translate }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ 'pwa.subtitle' | translate }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="pwaService.dismiss()"
              class="text-sm px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {{ 'pwa.dismiss' | translate }}
            </button>
            <button
              type="button"
              (click)="pwaService.install()"
              class="text-sm px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {{ 'pwa.install' | translate }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class InstallPromptComponent {
  readonly pwaService = inject(PwaService);
}
