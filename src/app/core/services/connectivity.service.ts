import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Detección de conectividad.
 * - Fuente primaria: navigator.onLine + eventos online/offline (SSR-safe).
 * - Corrección reactiva: reportOffline()/reportOnline() se llaman desde el
 *   offlineInterceptor cuando un request revela el estado real de la red
 *   (status 0 = sin red), porque navigator.onLine es poco confiable
 *   (p.ej. WiFi sin internet o emulación de red en tests).
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

  reportOffline(): void {
    if (this.onlineSignal()) {
      this.onlineSignal.set(false);
    }
  }

  reportOnline(): void {
    if (!this.onlineSignal()) {
      this.onlineSignal.set(true);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
