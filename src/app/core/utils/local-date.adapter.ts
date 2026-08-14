import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { parseLocalDate } from './date.utils';

/**
 * Custom DateAdapter that ensures strings in YYYY-MM-DD or locale formats
 * are parsed as LOCAL midnight dates rather than UTC midnight dates.
 * This prevents the day-before date shift in negative timezones (e.g. UTC-3).
 */
@Injectable()
export class LocalDateAdapter extends NativeDateAdapter {
  override parse(value: unknown): Date | null {
    if (typeof value === 'string') {
      const str = value.trim();
      if (!str) return null;

      // Handle ISO format YYYY-MM-DD (e.g. "2026-08-01")
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return parseLocalDate(str);
      }

      // Handle DD/MM/YYYY format (e.g. "01/08/2026")
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
        const [day, month, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day);
      }

      const date = super.parse(value);
      if (date && !isNaN(date.getTime())) {
        // If super.parse returned a UTC date (from Date.parse), adjust it to local date
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      }
      return date;
    }
    return super.parse(value);
  }
}
