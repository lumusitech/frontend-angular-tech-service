/**
 * Formats a Date object to 'YYYY-MM-DD' in local time (not UTC).
 * Compensates for timezone offset to avoid the day-shift issue
 * when Datepickers create dates at midnight UTC.
 */
export function toLocalDateString(date: Date): string {
  const adjusted = new Date(date.getTime() + date.getTimezoneOffset() * 60_000);
  const year = adjusted.getFullYear();
  const month = String(adjusted.getMonth() + 1).padStart(2, '0');
  const day = String(adjusted.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
