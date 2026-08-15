import { Service } from '@angular/core';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface CachedGet {
  key: string;
  url: string;
  /** Body ya desenvuelto por apiResponseInterceptor (shape final del componente). */
  body: unknown;
  fetchedAt: number;
}

interface GetCacheDB extends DBSchema {
  getCache: {
    key: string;
    value: CachedGet;
    indexes: { 'by-fetchedAt': number };
  };
}

// Base dedicada: NO compartir DB_NAME con otros stores (OfflineQueueStore usa
// 'tech-service-offline-queue'). Dos openDB al mismo nombre+versión con stores
// distintos hacen que el segundo nunca cree su store → NotFoundError.
const DB_NAME = 'tech-service-offline-cache';
const STORE = 'getCache';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 500;

function browserHasIndexedDB(): boolean {
  return typeof indexedDB !== 'undefined';
}

/**
 * Cache persistente (IndexedDB) de respuestas GET JSON, capa larga (~7 días)
 * que complementa al service worker (networkFirst, 24h para work-orders).
 * Almacena el body YA desenvuelto para servirlo directamente offline.
 */
@Service()
export class OfflineGetCache {
  private dbPromise: Promise<IDBPDatabase<GetCacheDB>> | null = null;

  private db(): Promise<IDBPDatabase<GetCacheDB>> {
    if (!browserHasIndexedDB()) {
      return Promise.reject(new Error('IndexedDB not available'));
    }
    if (!this.dbPromise) {
      this.dbPromise = openDB<GetCacheDB>(DB_NAME, 1, {
        upgrade(db) {
          const store = db.createObjectStore(STORE, { keyPath: 'key' });
          store.createIndex('by-fetchedAt', 'fetchedAt');
        },
      });
    }
    return this.dbPromise;
  }

  async get(url: string): Promise<CachedGet | undefined> {
    const db = await this.db();
    const cached = await db.get(STORE, url);
    if (!cached) return undefined;
    if (Date.now() - cached.fetchedAt > TTL_MS) {
      await db.delete(STORE, url);
      return undefined;
    }
    return cached;
  }

  async set(url: string, body: unknown): Promise<void> {
    const db = await this.db();
    await db.put(STORE, { key: url, url, body, fetchedAt: Date.now() });
    await this.evictIfNeeded(db);
  }

  async clear(): Promise<void> {
    const db = await this.db();
    await db.clear(STORE);
  }

  private async evictIfNeeded(db: IDBPDatabase<GetCacheDB>): Promise<void> {
    const total = await db.count(STORE);
    if (total <= MAX_ENTRIES) return;

    const oldest = await db.getAllFromIndex(STORE, 'by-fetchedAt', undefined, MAX_ENTRIES);
    const toDelete = oldest.slice(0, total - MAX_ENTRIES);
    const tx = db.transaction(STORE, 'readwrite');
    await Promise.all(toDelete.map((entry) => tx.store.delete(entry.key)));
    await tx.done;
  }
}
