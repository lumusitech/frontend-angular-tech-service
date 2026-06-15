import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-empty-state',
  imports: [TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div
        class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {{ title() || ('common.noResults' | translate) }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {{ message() || ('common.noResultsMessage' | translate) }}
      </p>
      @if (actionLabel()) {
        <button
          (click)="onAction()"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  title = input<string>('');
  message = input<string>('');
  actionLabel = input<string>('');
  action = input<() => void>();

  onAction(): void {
    const actionFn = this.action();
    if (actionFn) {
      actionFn();
    }
  }
}
