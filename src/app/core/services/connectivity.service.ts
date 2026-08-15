import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Detección de conectividad de red (navigator.onLine + eventos).
 * SSR-safe: en el servidor siempre reporta online.
 */
@Service()
export class ConnectivityService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly onlineSignal = signal<boolean>(this.isBrowser() ? navigator.onLine : true);

  readonly online = this.onlineSignal.asReadonly();

  constructor() {
    if (this.isBrowser()) {
      window.addEventListener('online', () => this.onlineSignal.set(true));
      window.addEventListener('offline', () => this.onlineSignal.set(false));
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
