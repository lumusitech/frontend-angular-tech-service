import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div
        class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4"
      >
        <mat-icon class="text-red-500 dark:text-red-400 text-3xl">error_outline</mat-icon>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {{ title() || ('common.errorLoading' | translate) }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {{ message() || ('common.errorMessage' | translate) }}
      </p>
      <button mat-stroked-button color="primary" (click)="retry.emit()">
        <mat-icon>refresh</mat-icon>
        {{ 'common.retry' | translate }}
      </button>
    </div>
  `,
})
export class ErrorStateComponent {
  title = input<string>('');
  message = input<string>('');
  retry = output<void>();
}
