import { Service, inject, signal, effect } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme_preference';

@Service()
export class ThemeService {
  private readonly prefsService = inject(UserPreferencesService);

  readonly theme = signal<Theme>('light');
  readonly isDark = signal(false);

  private updateTimeout: ReturnType<typeof setTimeout> | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private osChangeListener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    effect(() => {
      const t = this.theme();
      this.applyTheme(t);
    });
  }

  init(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      this.setTheme(stored, false);
    } else {
      this.setTheme(this.getOsPreference(), false);
    }

    this.listenForOsChanges();
  }

  setTheme(name: Theme, persist = true): void {
    this.theme.set(name);
    this.isDark.set(name === 'dark');

    if (persist) {
      localStorage.setItem(THEME_KEY, name);
      this.persistTheme(name);
    }
  }

  toggle(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  resetToSystem(): void {
    localStorage.removeItem(THEME_KEY);
    this.setTheme(this.getOsPreference(), true);
  }

  private getOsPreference(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private listenForOsChanges(): void {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.osChangeListener = (e: MediaQueryListEvent) => {
      const hasExplicitChoice = localStorage.getItem(THEME_KEY) !== null;
      if (!hasExplicitChoice) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    };

    this.mediaQuery.addEventListener('change', this.osChangeListener);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
    html.setAttribute('data-theme', theme);
  }

  private persistTheme(theme: Theme): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.prefsService.update({ theme }).subscribe({
        error: () => {},
      });
    }, 500);
  }
}
