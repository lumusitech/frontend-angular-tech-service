import { Service, signal } from '@angular/core';

@Service()
export class TranslationService {
  readonly locale = signal<string>('es');
  readonly translations = signal<Record<string, unknown>>({});

  private loaded = new Set<string>();
  private loading: Promise<void> | null = null;

  async init(locale = 'es'): Promise<void> {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('locale');
    const target = stored || locale;
    await this.loadLocale(target);
  }

  async loadLocale(locale: string): Promise<void> {
    if (this.loaded.has(locale)) {
      this.locale.set(locale);
      return;
    }

    if (this.loading) {
      await this.loading;
      if (this.loaded.has(locale)) {
        this.locale.set(locale);
        return;
      }
    }

    this.loading = this.doLoad(locale);
    await this.loading;
    this.loading = null;
  }

  private async doLoad(locale: string): Promise<void> {
    try {
      const response = await fetch(`/i18n/${locale}.json`);
      if (!response.ok) {
        console.warn(`Translation file not found: ${locale}`);
        return;
      }
      const data = (await response.json()) as Record<string, unknown>;
      this.translations.set(data);
      this.locale.set(locale);
      this.loaded.add(locale);

      try {
        localStorage.setItem('locale', locale);
      } catch {}
    } catch (err) {
      console.warn(`Failed to load translations for ${locale}`, err);
    }
  }

  async setLocale(locale: string): Promise<void> {
    await this.loadLocale(locale);
  }

  instant(key: string, params?: Record<string, string>): string {
    const translations = this.translations();
    const value = this.getNestedValue(translations, key);

    if (value === undefined || value === null) {
      return key;
    }

    let result = String(value);

    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), paramValue);
      }
    }

    return result;
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const k of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[k];
    }

    return current;
  }
}
