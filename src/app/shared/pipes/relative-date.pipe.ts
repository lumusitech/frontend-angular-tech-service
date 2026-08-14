import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const MONTH = 2_592_000_000;
const YEAR = 31_536_000_000;

@Pipe({ name: 'relativeDate', pure: false })
export class RelativeDatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    const now = Date.now();
    const diff = date.getTime() - now;
    const absDiff = Math.abs(diff);
    const isFuture = diff > 0;

    if (absDiff < MINUTE) {
      return this.translationService.instant(
        isFuture ? 'relativeTime.inSeconds' : 'relativeTime.agoSeconds',
      );
    }

    if (absDiff < HOUR) {
      const mins = Math.round(absDiff / MINUTE);
      return this.translationService.instant(
        isFuture ? 'relativeTime.inMinutes' : 'relativeTime.agoMinutes',
        { count: String(mins) },
      );
    }

    if (absDiff < DAY) {
      const hours = Math.round(absDiff / HOUR);
      const key = isFuture
        ? hours > 1
          ? 'relativeTime.inHours'
          : 'relativeTime.inHour'
        : hours > 1
          ? 'relativeTime.agoHours'
          : 'relativeTime.agoHour';
      return this.translationService.instant(key, { count: String(hours) });
    }

    if (absDiff < MONTH) {
      const days = Math.round(absDiff / DAY);
      const key = isFuture
        ? days > 1
          ? 'relativeTime.inDays'
          : 'relativeTime.inDay'
        : days > 1
          ? 'relativeTime.agoDays'
          : 'relativeTime.agoDay';
      return this.translationService.instant(key, { count: String(days) });
    }

    if (absDiff < YEAR) {
      const months = Math.round(absDiff / MONTH);
      const key = isFuture
        ? months > 1
          ? 'relativeTime.inMonths'
          : 'relativeTime.inMonth'
        : months > 1
          ? 'relativeTime.agoMonths'
          : 'relativeTime.agoMonth';
      return this.translationService.instant(key, { count: String(months) });
    }

    const years = Math.round(absDiff / YEAR);
    const key = isFuture
      ? years > 1
        ? 'relativeTime.inYears'
        : 'relativeTime.inYear'
      : years > 1
        ? 'relativeTime.agoYears'
        : 'relativeTime.agoYear';
    return this.translationService.instant(key, { count: String(years) });
  }
}
