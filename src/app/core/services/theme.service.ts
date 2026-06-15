import { Service, inject, signal, effect } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';

export type Theme = 'light' | 'dark';

@Service()
export class ThemeService {
  private readonly prefsService = inject(UserPreferencesService);

  readonly theme = signal<Theme>('light');
  readonly isDark = signal(false);

  private updateTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const t = this.theme();
      this.applyTheme(t);
    });
  }

  init(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        this.setTheme(stored, false);
        return;
      }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light', false);
    }
  }

  setTheme(name: Theme, persist = true): void {
    this.theme.set(name);
    this.isDark.set(name === 'dark');

    if (persist) {
      this.persistTheme(name);
    }
  }

  toggle(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('theme', theme);
    } catch {}
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
