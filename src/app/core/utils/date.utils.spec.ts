import { toLocalDateString, parseLocalDate } from './date.utils';

describe('toLocalDateString', () => {
  it('should format Date created with year/month/day constructor (local time)', () => {
    // This is how Angular Material datepicker creates dates
    const date = new Date(2026, 4, 2); // May 2, 2026 local
    expect(toLocalDateString(date)).toBe('2026-05-02');
  });

  it('should format May 14 correctly', () => {
    const date = new Date(2026, 4, 14);
    expect(toLocalDateString(date)).toBe('2026-05-14');
  });

  it('should format January 1 correctly', () => {
    const date = new Date(2026, 0, 1);
    expect(toLocalDateString(date)).toBe('2026-01-01');
  });

  it('should format December 31 correctly', () => {
    const date = new Date(2026, 11, 31);
    expect(toLocalDateString(date)).toBe('2026-12-31');
  });

  it('should not shift dates across 24-hour boundary', () => {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(2026, 4, 2, hour, 0, 0);
      expect(toLocalDateString(date)).toBe('2026-05-02');
    }
  });

  it('should handle midnight to 1-minute-before-midnight range', () => {
    // Edge: 23:59 should still be same day
    const date = new Date(2026, 4, 2, 23, 59, 59);
    expect(toLocalDateString(date)).toBe('2026-05-02');
  });

  it('should handle midnight exactly', () => {
    const date = new Date(2026, 4, 2, 0, 0, 0);
    expect(toLocalDateString(date)).toBe('2026-05-02');
  });
});

describe('parseLocalDate', () => {
  it('should parse date string as local time', () => {
    const date = parseLocalDate('2026-05-02');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(4); // May = 4
    expect(date.getDate()).toBe(2);
    expect(date.getHours()).toBe(0);
  });

  it('should parse May 14 correctly', () => {
    const date = parseLocalDate('2026-05-14');
    expect(toLocalDateString(date)).toBe('2026-05-14');
  });

  it('should parse January 1 correctly', () => {
    const date = parseLocalDate('2026-01-01');
    expect(toLocalDateString(date)).toBe('2026-01-01');
  });

  it('should parse December 31 correctly', () => {
    const date = parseLocalDate('2026-12-31');
    expect(toLocalDateString(date)).toBe('2026-12-31');
  });

  it('should create Date at midnight local, not UTC', () => {
    // new Date("2026-05-02") creates UTC midnight
    // parseLocalDate("2026-05-02") should create local midnight
    const localDate = parseLocalDate('2026-05-02');

    // They should represent the same calendar day in local time
    expect(toLocalDateString(localDate)).toBe('2026-05-02');
  });
});
