import { TestBed } from '@angular/core/testing';
import { RelativeDatePipe } from './relative-date.pipe';
import { TranslationService } from '../../core/services/translation.service';

const es = {
  'relativeTime.inSeconds': 'en unos segundos',
  'relativeTime.agoSeconds': 'hace unos segundos',
  'relativeTime.inMinutes': 'en {{count}} min',
  'relativeTime.agoMinutes': 'hace {{count}} min',
  'relativeTime.inHour': 'en ~{{count}} hora',
  'relativeTime.inHours': 'en ~{{count}} horas',
  'relativeTime.agoHour': 'hace ~{{count}} hora',
  'relativeTime.agoHours': 'hace ~{{count}} horas',
  'relativeTime.inDay': 'en {{count}} día',
  'relativeTime.inDays': 'en {{count}} días',
  'relativeTime.agoDay': 'hace {{count}} día',
  'relativeTime.agoDays': 'hace {{count}} días',
  'relativeTime.inMonth': 'en {{count}} mes',
  'relativeTime.inMonths': 'en {{count}} meses',
  'relativeTime.agoMonth': 'hace {{count}} mes',
  'relativeTime.agoMonths': 'hace {{count}} meses',
  'relativeTime.inYear': 'en {{count}} año',
  'relativeTime.inYears': 'en {{count}} años',
  'relativeTime.agoYear': 'hace {{count}} año',
  'relativeTime.agoYears': 'hace {{count}} años',
};

const translationMock = {
  instant: (key: string, params?: Record<string, string>): string => {
    const template = es[key as keyof typeof es] ?? key;
    if (!params) return template;
    return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => params[name] ?? '');
  },
};

describe('RelativeDatePipe', () => {
  let pipe: RelativeDatePipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationService,
          useValue: translationMock,
        },
      ],
    }).compileComponents();

    pipe = TestBed.runInInjectionContext(() => new RelativeDatePipe());
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-02T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('past dates', () => {
    it('should return "hace unos segundos" for dates less than 1 minute ago', () => {
      const date = new Date('2026-07-02T11:59:30.000Z'); // 30 seconds ago
      expect(pipe.transform(date)).toBe('hace unos segundos');
    });

    it('should return minutes for dates less than 1 hour ago', () => {
      const date = new Date('2026-07-02T11:45:00.000Z'); // 15 minutes ago
      expect(pipe.transform(date)).toBe('hace 15 min');
    });

    it('should return singular "min" for 1 minute', () => {
      const date = new Date('2026-07-02T11:59:00.000Z'); // 1 minute ago
      expect(pipe.transform(date)).toBe('hace 1 min');
    });

    it('should return hours for dates less than 1 day ago', () => {
      const date = new Date('2026-07-02T09:00:00.000Z'); // 3 hours ago
      expect(pipe.transform(date)).toBe('hace ~3 horas');
    });

    it('should return singular "hora" for 1 hour', () => {
      const date = new Date('2026-07-02T11:00:00.000Z'); // 1 hour ago
      expect(pipe.transform(date)).toBe('hace ~1 hora');
    });

    it('should return days for dates less than 1 month ago', () => {
      const date = new Date('2026-06-30T12:00:00.000Z'); // 2 days ago
      expect(pipe.transform(date)).toBe('hace 2 días');
    });

    it('should return singular "día" for 1 day', () => {
      const date = new Date('2026-07-01T12:00:00.000Z'); // 1 day ago
      expect(pipe.transform(date)).toBe('hace 1 día');
    });

    it('should return months for dates less than 1 year ago', () => {
      const date = new Date('2026-04-02T12:00:00.000Z'); // 3 months ago
      expect(pipe.transform(date)).toBe('hace 3 meses');
    });

    it('should return singular "mes" for 1 month', () => {
      const date = new Date('2026-06-02T12:00:00.000Z'); // 1 month ago
      expect(pipe.transform(date)).toBe('hace 1 mes');
    });

    it('should return years for dates more than 1 year ago', () => {
      const date = new Date('2024-07-02T12:00:00.000Z'); // 2 years ago
      expect(pipe.transform(date)).toBe('hace 2 años');
    });

    it('should return singular "año" for 1 year', () => {
      const date = new Date('2025-07-02T12:00:00.000Z'); // 1 year ago
      expect(pipe.transform(date)).toBe('hace 1 año');
    });
  });

  describe('future dates', () => {
    it('should return "en unos segundos" for dates less than 1 minute ahead', () => {
      const date = new Date('2026-07-02T12:00:30.000Z'); // 30 seconds ahead
      expect(pipe.transform(date)).toBe('en unos segundos');
    });

    it('should return minutes for future dates less than 1 hour ahead', () => {
      const date = new Date('2026-07-02T12:15:00.000Z'); // 15 minutes ahead
      expect(pipe.transform(date)).toBe('en 15 min');
    });

    it('should return hours for future dates less than 1 day ahead', () => {
      const date = new Date('2026-07-02T15:00:00.000Z'); // 3 hours ahead
      expect(pipe.transform(date)).toBe('en ~3 horas');
    });

    it('should return days for future dates less than 1 month ahead', () => {
      const date = new Date('2026-07-04T12:00:00.000Z'); // 2 days ahead
      expect(pipe.transform(date)).toBe('en 2 días');
    });

    it('should return months for future dates less than 1 year ahead', () => {
      const date = new Date('2026-10-02T12:00:00.000Z'); // 3 months ahead
      expect(pipe.transform(date)).toBe('en 3 meses');
    });

    it('should return years for future dates more than 1 year ahead', () => {
      const date = new Date('2028-07-02T12:00:00.000Z'); // 2 years ahead
      expect(pipe.transform(date)).toBe('en 2 años');
    });
  });

  describe('input types', () => {
    it('should handle Date object', () => {
      const date = new Date('2026-07-02T11:45:00.000Z');
      expect(pipe.transform(date)).toBe('hace 15 min');
    });

    it('should handle ISO string', () => {
      expect(pipe.transform('2026-07-02T11:45:00.000Z')).toBe('hace 15 min');
    });

    it('should handle timestamp number', () => {
      const timestamp = new Date('2026-07-02T11:45:00.000Z').getTime();
      expect(pipe.transform(timestamp)).toBe('hace 15 min');
    });
  });

  describe('edge cases', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      expect(pipe.transform('invalid-date')).toBe('');
    });

    it('should handle exact boundary: exactly 1 minute ago', () => {
      const date = new Date('2026-07-02T11:59:00.000Z'); // exactly 1 minute ago
      const result = pipe.transform(date);
      expect(result).toBe('hace 1 min');
    });

    it('should handle exact boundary: exactly 1 hour ago', () => {
      const date = new Date('2026-07-02T11:00:00.000Z'); // exactly 1 hour ago
      const result = pipe.transform(date);
      expect(result).toBe('hace ~1 hora');
    });

    it('should handle exact boundary: exactly 1 day ago', () => {
      const date = new Date('2026-07-01T12:00:00.000Z'); // exactly 1 day ago
      const result = pipe.transform(date);
      expect(result).toBe('hace 1 día');
    });
  });
});
