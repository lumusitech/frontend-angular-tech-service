import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardDirective } from '../../directives/copy-to-clipboard.directive';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-copy-field',
  imports: [MatIconModule, CopyToClipboardDirective, TranslatePipe],
  template: `
    <div class="flex items-center justify-between py-2">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <span class="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ label() }}</span>
        @if (type() === 'phone') {
          <a [href]="'tel:' + value()" class="text-sm text-blue-600 dark:text-blue-400 truncate hover:underline">
            {{ value() }}
          </a>
        } @else if (type() === 'email') {
          <a [href]="'mailto:' + value()" class="text-sm text-blue-600 dark:text-blue-400 truncate hover:underline">
            {{ value() }}
          </a>
        } @else if (type() === 'address') {
          <a [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())" target="_blank" rel="noopener"
             class="text-sm text-blue-600 dark:text-blue-400 truncate hover:underline">
            {{ value() }}
          </a>
        } @else {
          <span class="text-sm text-gray-900 dark:text-gray-100 truncate">{{ value() }}</span>
        }
      </div>
      <button
        mat-icon-button
        [appCopyToClipboard]="value()"
        class="!w-8 !h-8 shrink-0"
        [title]="'common.copyToClipboard' | translate"
      >
        <mat-icon class="!w-4 !h-4 !text-gray-400">file_copy</mat-icon>
      </button>
    </div>
  `,
})
export class CopyFieldComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly type = input<'phone' | 'email' | 'address' | 'text'>('text');

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }
}
