import {
  Service,
  inject,
  signal,
  effect,
  untracked,
  PLATFORM_ID,
  DestroyRef,
  type EffectRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { deleteDB } from 'idb';
import { ConnectivityService } from './connectivity.service';
import { OfflineQueueStore, QueuedRequest } from './offline-queue-store.service';
import { OfflineGetCache } from './offline-get-cache.service';
import { WebsocketService } from './websocket.service';
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';
import { withTimeout } from '../utils/with-timeout.util';

export interface FlushResult {
  synced: number;
  failed: number;
  blocked: number;
}

const PROBE_INTERVAL_MS = 6000;
const REPLAY_TIMEOUT_MS = 15000;
const PROBE_TIMEOUT_MS = 15000;
const IDB_TIMEOUT_MS = 5000;
const FLUSH_MAX_MS = 20000;

@Service()
export class OfflineService {
  private readonly connectivity = inject(ConnectivityService);
  private readonly queueStore = inject(OfflineQueueStore);
  private readonly getCache = inject(OfflineGetCache);
  private readonly http = inject(HttpClient);
  private readonly websocketService = inject(WebsocketService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly online = this.connectivity.online;
  readonly pendingCount = signal(0);
  readonly blockedCount = signal(0);
  readonly isSyncing = signal(false);
  readonly lastSyncedAt = signal<number | null>(null);
  readonly lastResult = signal<FlushResult | null>(null);

  private effectRef: EffectRef | null = null;
  private probeTimer: ReturnType<typeof setInterval> | null = null;
  private flushWatchdog: ReturnType<typeof setTimeout> | null = null;
  private legacyDbCleanupDone = false;

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.destroyRef.onDestroy(() => {
      this.effectRef?.destroy();
      this.stopProbe();
      this.clearFlushWatchdog();
    });

    void this.refreshCounts();
    this.cleanupLegacyDb();

    // El effect debe depender SOLO de `online()`. flush() lee isSyncing() con
    // untracked() para no crear una dependencia reactiva espuria que genere un
    // bucle infinito de flush.
    this.effectRef = effect(() => {
      const isOnline = this.connectivity.online();
      if (isOnline) {
        this.stopProbe();
        void this.flush();
      } else {
        this.startProbe();
      }
    });
  }

  /**
   * Limpieza one-shot de la base legacy del feature offline (v1): ambos stores
   * (queue y getCache) compartían el nombre 'tech-service-offline' a la misma
   * versión → el segundo openDB nunca creaba su store y toda operación lanzaba
   * NotFoundError. Hoy cada store vive en su propia base. Este método descarta
   * la base rota huérfana; si otra pestaña la mantiene abierta, se reintenta en
   * el próximo arranque.
   */
  private cleanupLegacyDb(): void {
    if (this.legacyDbCleanupDone) return;
    this.legacyDbCleanupDone = true;
    void deleteDB('tech-service-offline').catch(() => undefined);
  }

  async queueRequest(
    request: Omit<QueuedRequest, 'createdAt' | 'attempts' | 'state'>,
  ): Promise<void> {
    await this.queueStore.enqueue({
      ...request,
      createdAt: Date.now(),
      attempts: 0,
      state: 'pending',
    });
    await this.refreshCounts();
  }

  async retryBlocked(id: string): Promise<void> {
    const item = await this.queueStore.getById(id);
    if (!item || item.state !== 'blocked') return;
    await this.queueStore.update({ ...item, state: 'pending', attempts: 0, lastError: undefined });
    await this.refreshCounts();
    void this.flush();
  }

  async retryAllBlocked(): Promise<void> {
    const blocked = await this.queueStore.getBlocked();
    for (const item of blocked) {
      await this.queueStore.update({
        ...item,
        state: 'pending',
        attempts: 0,
        lastError: undefined,
      });
    }
    await this.refreshCounts();
    void this.flush();
  }

  async clearAll(): Promise<void> {
    await this.queueStore.clear();
    await this.getCache.clear();
    await this.refreshCounts();
  }

  pendingItems(): Promise<QueuedRequest[]> {
    return this.queueStore.getPending();
  }

  blockedItems(): Promise<QueuedRequest[]> {
    return this.queueStore.getBlocked();
  }

  /**
   * Reintenta las mutaciones encoladas en orden FIFO. Solo se re-envían
   * requests que nunca recibieron respuesta (replay seguro + idempotencia).
   * 2xx → se quitan; 4xx → bloqueadas (visibles, nunca se borran); red/5xx →
   * se conservan para el próximo evento online.
   */
  async flush(): Promise<FlushResult> {
    const result: FlushResult = { synced: 0, failed: 0, blocked: 0 };

    if (!isPlatformBrowser(this.platformId)) return result;
    if (untracked(() => !this.connectivity.online() || this.isSyncing())) return result;

    this.isSyncing.set(true);
    this.startFlushWatchdog();
    try {
      const pending = await withTimeout(
        this.queueStore.getPending(),
        IDB_TIMEOUT_MS,
        'OfflineService.flush getPending',
      );
      const sorted = pending.sort((a, b) => a.createdAt - b.createdAt);

      for (const item of sorted) {
        if (!this.connectivity.online()) break;

        try {
          const headers = new HttpHeaders({
            'Idempotency-Key': item.idempotencyKey,
            'X-Offline-Replay': 'true',
          });
          await withTimeout(
            firstValueFrom(this.http.request(item.method, item.url, { body: item.body, headers })),
            REPLAY_TIMEOUT_MS,
            `OfflineService.flush replay ${item.method} ${item.url}`,
          );
          await this.queueStore.remove(item.id);
          result.synced += 1;
        } catch (error) {
          const status = (error as HttpErrorResponse | undefined)?.status;
          if (status === 401) {
            // El refresh del authInterceptor ya intentó renovar la sesión.
            await this.markBlocked(
              item,
              this.translationService.instant('offline.syncSessionExpired'),
            );
            result.blocked += 1;
          } else if (typeof status === 'number' && status >= 400 && status < 500) {
            await this.markBlocked(item, this.serverErrorLabel(status));
            result.blocked += 1;
          } else {
            // Red caída / 5xx: detener el flush, reintentar en el próximo evento online.
            result.failed += 1;
            break;
          }
        }
      }

      if (result.synced > 0) {
        this.websocketService.workOrderRefreshKey.update((key) => key + 1);
      }

      this.lastSyncedAt.set(Date.now());
      this.lastResult.set(result);

      if (result.synced > 0) {
        this.toastService.show(
          this.translationService.instant('offline.syncSuccess', { count: String(result.synced) }),
          'success',
        );
      }
      if (result.blocked > 0) {
        this.toastService.show(
          this.translationService.instant('offline.syncBlocked', { count: String(result.blocked) }),
          'warning',
        );
      }
    } catch (error) {
      // Fallo del almacenamiento (ej: store de IndexedDB no disponible): no
      // propagar unhandled rejection — loguear y terminar el flush con calma.
      console.error('OfflineService.flush failed:', error);
    } finally {
      this.clearFlushWatchdog();
      this.isSyncing.set(false);
      await this.refreshCounts();
    }

    return result;
  }

  async cacheGet(url: string, body: unknown): Promise<void> {
    try {
      await this.getCache.set(url, body);
    } catch {
      // Fallo de cache no debe afectar la request original.
    }
  }

  async getCached(
    url: string,
  ): Promise<{ key: string; url: string; body: unknown; fetchedAt: number } | undefined> {
    try {
      return await this.getCache.get(url);
    } catch {
      return undefined;
    }
  }

  private async markBlocked(item: QueuedRequest, lastError: string): Promise<void> {
    await this.queueStore.update({
      ...item,
      state: 'blocked',
      attempts: item.attempts + 1,
      lastError,
    });
  }

  private serverErrorLabel(status: number): string {
    if (status === 409 || status === 422) {
      return this.translationService.instant('offline.syncConflict');
    }
    return this.translationService.instant('offline.syncRejected', { status: String(status) });
  }

  private async refreshCounts(): Promise<void> {
    try {
      const counts = await withTimeout(
        this.queueStore.counts(),
        IDB_TIMEOUT_MS,
        'OfflineService.refreshCounts counts',
      );
      this.pendingCount.set(counts.pending);
      this.blockedCount.set(counts.blocked);
    } catch {
      this.pendingCount.set(0);
      this.blockedCount.set(0);
    }
  }

  private startFlushWatchdog(): void {
    this.clearFlushWatchdog();
    this.flushWatchdog = setTimeout(() => {
      if (this.isSyncing()) {
        console.warn('OfflineService.flush watchdog: forzando isSyncing=false tras timeout');
        this.isSyncing.set(false);
      }
    }, FLUSH_MAX_MS);
  }

  private clearFlushWatchdog(): void {
    if (this.flushWatchdog) {
      clearTimeout(this.flushWatchdog);
      this.flushWatchdog = null;
    }
  }

  /**
   * Sonda de recuperación: mientras esté "offline" (detectado por fallos reales
   * de red), cada PROBE_INTERVAL_MS se intenta una request liviana. Al tener
   * éxito, se reporta online y el efecto dispara el flush.
   */
  private startProbe(): void {
    if (this.probeTimer) return;
    void this.probe();
    this.probeTimer = setInterval(() => void this.probe(), PROBE_INTERVAL_MS);
  }

  private stopProbe(): void {
    if (this.probeTimer) {
      clearInterval(this.probeTimer);
      this.probeTimer = null;
    }
  }

  private async probe(): Promise<void> {
    if (this.connectivity.online()) return;
    const headers = new HttpHeaders({
      'X-Connectivity-Probe': 'true',
      'X-Skip-Loading': 'true',
    });
    try {
      await withTimeout(
        firstValueFrom(this.http.get('/api/business-settings', { headers })),
        PROBE_TIMEOUT_MS,
        'OfflineService.probe',
      );
      this.connectivity.reportOnline();
    } catch {
      // Sigue offline; el próximo probe reintenta.
    }
  }
}
