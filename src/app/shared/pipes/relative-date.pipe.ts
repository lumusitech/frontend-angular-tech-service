import { Pipe, PipeTransform } from '@angular/core';

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const MONTH = 2_592_000_000;
const YEAR = 31_536_000_000;

@Pipe({ name: 'relativeDate', pure: false })
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    const now = Date.now();
    const diff = date.getTime() - now;
    const absDiff = Math.abs(diff);
    const isFuture = diff > 0;

    if (absDiff < MINUTE) {
      return isFuture ? 'en unos segundos' : 'hace unos segundos';
    }

    if (absDiff < HOUR) {
      const mins = Math.round(absDiff / MINUTE);
      return isFuture ? `en ${mins} min` : `hace ${mins} min`;
    }

    if (absDiff < DAY) {
      const hours = Math.round(absDiff / HOUR);
      return isFuture
        ? `en ~${hours} hora${hours > 1 ? 's' : ''}`
        : `hace ~${hours} hora${hours > 1 ? 's' : ''}`;
    }

    if (absDiff < MONTH) {
      const days = Math.round(absDiff / DAY);
      return isFuture
        ? `en ${days} día${days > 1 ? 's' : ''}`
        : `hace ${days} día${days > 1 ? 's' : ''}`;
    }

    if (absDiff < YEAR) {
      const months = Math.round(absDiff / MONTH);
      return isFuture
        ? `en ${months} mes${months > 1 ? 'es' : ''}`
        : `hace ${months} mes${months > 1 ? 'es' : ''}`;
    }

    const years = Math.round(absDiff / YEAR);
    return isFuture
      ? `en ${years} año${years > 1 ? 's' : ''}`
      : `hace ${years} año${years > 1 ? 's' : ''}`;
  }
}
