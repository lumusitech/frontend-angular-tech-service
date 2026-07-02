import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { CurrencyArsPipe } from './currency-ars.pipe';

registerLocaleData(localeEsAr, 'es-AR');

describe('CurrencyArsPipe', () => {
  let pipe: CurrencyArsPipe;

  beforeEach(() => {
    pipe = new CurrencyArsPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform()', () => {
    it('should format number as ARS currency', () => {
      const result = pipe.transform(1234.56);
      expect(result).toContain('1.234,56');
      expect(result).toContain('$');
    });

    it('should format zero', () => {
      const result = pipe.transform(0);
      expect(result).toContain('0');
      expect(result).toContain('$');
    });

    it('should format negative numbers', () => {
      const result = pipe.transform(-500);
      expect(result).toContain('500');
      expect(result).toContain('$');
    });

    it('should format large numbers', () => {
      const result = pipe.transform(1000000);
      expect(result).toContain('1.000.000');
      expect(result).toContain('$');
    });

    it('should return null for null input', () => {
      expect(pipe.transform(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(pipe.transform(undefined)).toBeNull();
    });

    it('should respect custom decimals parameter', () => {
      const result = pipe.transform(1234.567, '1.2-3');
      expect(result).toContain('1.234,567');
    });

    it('should format with no decimals', () => {
      const result = pipe.transform(1234, '1.0-0');
      expect(result).toContain('1.234');
    });
  });
});
