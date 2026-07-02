import { Component, input, computed } from '@angular/core';
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
        } @else if (type() === 'date') {
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ displayDate() }}</span>
        } @else {
          <span class="text-sm text-gray-900 dark:text-gray-100 break-all">{{ value() }}</span>
        }
      </div>
      <button
        mat-icon-button
        [appCopyToClipboard]="copyValue()"
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
  readonly type = input<'phone' | 'email' | 'address' | 'date' | 'text'>('text');

  readonly displayDate = computed(() => {
    if (this.type() !== 'date') return this.value();
    const date = new Date(this.value());
    if (isNaN(date.getTime())) return this.value();
    return this.relativeDate(date);
  });

  readonly copyValue = computed(() => {
    if (this.type() !== 'date') return this.value();
    const date = new Date(this.value());
    if (isNaN(date.getTime())) return this.value();
    return date.toLocaleDateString('es-AR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  });

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }

  private relativeDate(date: Date): string {
    const now = Date.now();
    const diff = date.getTime() - now;
    const absDiff = Math.abs(diff);
    const isFuture = diff > 0;

    if (absDiff < 60_000) return isFuture ? 'en unos segundos' : 'hace unos segundos';
    if (absDiff < 3_600_000) {
      const mins = Math.round(absDiff / 60_000);
      return isFuture ? `en ${mins} min` : `hace ${mins} min`;
    }
    if (absDiff < 86_400_000) {
      const hours = Math.round(absDiff / 3_600_000);
      return isFuture ? `en ~${hours}h` : `hace ~${hours}h`;
    }
    if (absDiff < 2_592_000_000) {
      const days = Math.round(absDiff / 86_400_000);
      return isFuture ? `en ${days} días` : `hace ${days} días`;
    }
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
