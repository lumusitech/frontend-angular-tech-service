import { TestBed } from '@angular/core/testing';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { LocalDateAdapter } from './local-date.adapter';

describe('LocalDateAdapter', () => {
  let adapter: LocalDateAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DateAdapter, useClass: LocalDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
      ],
    });
    adapter = TestBed.inject(DateAdapter) as LocalDateAdapter;
  });

  it('should parse YYYY-MM-DD as local date without UTC shift', () => {
    const parsed = adapter.parse('2026-08-01');
    expect(parsed).not.toBeNull();
    expect(parsed!.getFullYear()).toBe(2026);
    expect(parsed!.getMonth()).toBe(7); // August = index 7
    expect(parsed!.getDate()).toBe(1);
    expect(parsed!.getHours()).toBe(0);
  });

  it('should parse DD/MM/YYYY as local date', () => {
    const parsed = adapter.parse('01/08/2026');
    expect(parsed).not.toBeNull();
    expect(parsed!.getFullYear()).toBe(2026);
    expect(parsed!.getMonth()).toBe(7);
    expect(parsed!.getDate()).toBe(1);
  });

  it('should return null for empty string or null', () => {
    expect(adapter.parse('')).toBeNull();
    expect(adapter.parse('   ')).toBeNull();
    expect(adapter.parse(null)).toBeNull();
  });

  it('should preserve Date objects passed into parse', () => {
    const date = new Date(2026, 7, 1);
    expect(adapter.parse(date)).toEqual(date);
  });
});
