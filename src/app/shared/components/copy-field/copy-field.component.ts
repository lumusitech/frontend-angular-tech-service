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
      <div class="flex items-center gap-1 shrink-0">
        @if (type() === 'address') {
          <a
            [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center p-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            [title]="'common.openInMaps' | translate"
          >
            <mat-icon class="w-4! h-4! text-base!">pin_drop</mat-icon>
          </a>
        }
        @if (type() === 'phone') {
          <a
            [href]="'tel:' + value()"
            class="inline-flex items-center justify-center p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
            [title]="'common.call' | translate"
          >
            <mat-icon class="w-4! h-4! text-base!">call</mat-icon>
          </a>
          <a
            [href]="'https://wa.me/' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            [title]="'common.whatsapp' | translate"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.43-9.874 9.875-9.874 2.637 0 5.115 1.028 6.978 2.894A9.827 9.827 0 0121.996 12c0 5.447-4.429 9.875-9.875 9.875m0-18c-6.52 0-11.82 5.3-11.82 11.82 0 2.09.544 4.13 1.579 5.92L0 24l6.452-1.69a11.78 11.78 0 005.597 1.41h.005c6.519 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.463-8.363A11.754 11.754 0 0012.05 1z"/>
            </svg>
          </a>
        }
        <button
          mat-icon-button
          [appCopyToClipboard]="copyValue()"
          class="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors !min-w-0"
          [title]="'common.copyToClipboard' | translate"
        >
          <mat-icon class="w-4! h-4! text-base!">file_copy</mat-icon>
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
