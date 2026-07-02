import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardDirective } from '../../directives/copy-to-clipboard.directive';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-copy-field',
  imports: [MatIconModule, CopyToClipboardDirective, TranslatePipe],
  template: `
    <div class="flex items-start justify-between py-2 gap-2">
      <div class="flex items-start gap-2 min-w-0 flex-1">
        <span class="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0 pt-0.5">{{ label() }}</span>
        @if (type() === 'phone') {
          <a [href]="'tel:' + value()" class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline">
            {{ value() }}
          </a>
        } @else if (type() === 'email') {
          <a [href]="'mailto:' + value()" class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline">
            {{ value() }}
          </a>
        } @else if (type() === 'address') {
          <a [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())" target="_blank" rel="noopener"
             class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline">
            {{ value() }}
          </a>
        } @else {
          <span class="text-sm text-gray-900 dark:text-gray-100 break-all">{{ value() }}</span>
        }
      </div>
      <button
        mat-icon-button
        [appCopyToClipboard]="value()"
        class="!min-w-0 !p-1 shrink-0"
        [title]="'common.copyToClipboard' | translate"
      >
        <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-gray-400">file_copy</mat-icon>
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
