import { Component, input, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardDirective } from '../../directives/copy-to-clipboard.directive';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-copy-field',
  imports: [MatIconModule, CopyToClipboardDirective, TranslatePipe],
  template: `
    <div class="flex items-center justify-between py-1.5 gap-2">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400 w-24 shrink-0">{{
          label()
        }}</span>
        @if (type() === 'phone') {
          <a
            [href]="'tel:' + value()"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 break-all hover:underline leading-none flex items-center"
          >
            {{ value() }}
          </a>
        } @else if (type() === 'email') {
          <a
            [href]="'mailto:' + value()"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 break-all hover:underline leading-none flex items-center"
          >
            {{ value() }}
          </a>
        } @else if (type() === 'address') {
          <a
            [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 break-all hover:underline leading-none flex items-center"
          >
            {{ value() }}
          </a>
        } @else if (type() === 'date') {
          <span
            class="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none flex items-center"
            >{{ formattedDate() }}</span
          >
        } @else {
          <span
            class="text-sm font-medium text-gray-900 dark:text-gray-100 break-all leading-none flex items-center"
            >{{ value() }}</span
          >
        }
      </div>
      <div class="flex items-center gap-1 shrink-0 -translate-y-[1px]">
        @if (type() === 'address') {
          <a
            [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors p-0.5"
            [title]="'common.openInMaps' | translate"
          >
            <mat-icon
              class="w-4.5! h-4.5! text-[18px]! leading-none! flex! items-center! justify-center!"
              >location_on</mat-icon
            >
          </a>
        }
        @if (type() === 'phone') {
          <a
            [href]="'tel:' + value()"
            class="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-0.5"
            [title]="'common.call' | translate"
          >
            <mat-icon
              class="w-4.5! h-4.5! text-[18px]! leading-none! flex! items-center! justify-center!"
              >call</mat-icon
            >
          </a>
          <a
            [href]="'https://wa.me/' + encodeURIComponent(value())"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors p-0.5"
            [title]="'common.whatsapp' | translate"
          >
            <svg class="w-4.5 h-4.5 shrink-0 fill-current" viewBox="0 0 24 24">
              <path
                d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.004c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.198 8.198 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.188 8.188 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.21 8.24zm4.52-6.18c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.76 2.69 4.26 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z"
              />
            </svg>
          </a>
        }
        <button
          mat-icon-button
          [appCopyToClipboard]="copyValue()"
          class="inline-flex items-center justify-center p-0.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors min-w-0!"
          [title]="'common.copyToClipboard' | translate"
        >
          <mat-icon class="w-4! h-4! text-base! leading-none! flex! items-center! justify-center!"
            >file_copy</mat-icon
          >
        </button>
      </div>
    </div>
  `,
})
export class CopyFieldComponent {
  private readonly translationService = inject(TranslationService);

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
    return d.toLocaleDateString(this.translationService.locale(), {
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
    if (abs < 60_000)
      return this.translationService.instant(
        future ? 'relativeTime.inSeconds' : 'relativeTime.agoSeconds',
      );
    if (abs < 3_600_000) {
      const m = Math.round(abs / 60_000);
      return this.translationService.instant(
        future ? 'relativeTime.inMinutes' : 'relativeTime.agoMinutes',
        { count: String(m) },
      );
    }
    if (abs < 86_400_000) {
      const h = Math.round(abs / 3_600_000);
      const key = future
        ? h > 1
          ? 'relativeTime.inHours'
          : 'relativeTime.inHour'
        : h > 1
          ? 'relativeTime.agoHours'
          : 'relativeTime.agoHour';
      return this.translationService.instant(key, { count: String(h) });
    }
    if (abs < 2_592_000_000) {
      const d = Math.round(abs / 86_400_000);
      const key = future
        ? d > 1
          ? 'relativeTime.inDays'
          : 'relativeTime.inDay'
        : d > 1
          ? 'relativeTime.agoDays'
          : 'relativeTime.agoDay';
      return this.translationService.instant(key, { count: String(d) });
    }
    return date.toLocaleDateString(this.translationService.locale(), {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
