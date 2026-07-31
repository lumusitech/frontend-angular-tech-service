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
        <span class="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0 pt-0.5">{{
          label()
        }}</span>
        @if (type() === 'phone') {
          <a
            [href]="'tel:' + value()"
            class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline"
          >
            {{ value() }}
          </a>
        } @else if (type() === 'email') {
          <a
            [href]="'mailto:' + value()"
            class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline"
          >
            {{ value() }}
          </a>
        } @else if (type() === 'address') {
          <a
            [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline"
          >
            {{ value() }}
          </a>
        } @else if (type() === 'date') {
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ formattedDate() }}</span>
        } @else {
          <span class="text-sm text-gray-900 dark:text-gray-100 break-all">{{ value() }}</span>
        }
      </div>
      <div class="flex items-center shrink-0">
        @if (type() === 'address') {
          <a
            [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            mat-icon-button
            class="!min-w-0 !p-1"
            [title]="'common.openInMaps' | translate"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-green-500"
              >location_on</mat-icon
            >
          </a>
        }
        @if (type() === 'phone') {
          <a
            [href]="'tel:' + value()"
            mat-icon-button
            class="!min-w-0 !p-1"
            [title]="'common.call' | translate"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-blue-500">phone</mat-icon>
          </a>
          <a
            [href]="'https://wa.me/' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            mat-icon-button
            class="!min-w-0 !p-1"
            [title]="'common.whatsapp' | translate"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-green-500">chat</mat-icon>
          </a>
        }
        <button
          mat-icon-button
          [appCopyToClipboard]="copyValue()"
          class="!min-w-0 !p-1"
          [title]="'common.copyToClipboard' | translate"
        >
          <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-gray-400">file_copy</mat-icon>
        </button>
      </div>
    </div>
  `,
})
export class CopyFieldComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly type = input<'phone' | 'email' | 'address' | 'date' | 'text'>('text');

  readonly formattedDate = computed(() => {
    if (this.type() !== 'date') return this.value();
    const d = new Date(this.value());
    if (isNaN(d.getTime())) return this.value();
    return this.relativeDate(d);
  });

  readonly copyValue = computed(() => {
    if (this.type() !== 'date') return this.value();
    const d = new Date(this.value());
    if (isNaN(d.getTime())) return this.value();
    return d.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }

  private relativeDate(date: Date): string {
    const now = Date.now();
    const diff = date.getTime() - now;
    const abs = Math.abs(diff);
    const future = diff > 0;
    if (abs < 60_000) return future ? 'en unos segundos' : 'hace unos segundos';
    if (abs < 3_600_000) {
      const m = Math.round(abs / 60_000);
      return future ? `en ${m} min` : `hace ${m} min`;
    }
    if (abs < 86_400_000) {
      const h = Math.round(abs / 3_600_000);
      return future ? `en ~${h}h` : `hace ~${h}h`;
    }
    if (abs < 2_592_000_000) {
      const d = Math.round(abs / 86_400_000);
      return future ? `en ${d} días` : `hace ${d} días`;
    }
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
