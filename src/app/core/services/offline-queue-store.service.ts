import { Service } from '@angular/core';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export type QueuedRequestState = 'pending' | 'blocked';

export interface QueuedRequest {
  id: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body?: unknown;
  /** Key de idempotencia que el backend usa para deduplicar replays. */
  idempotencyKey: string;
  createdAt: number;
  attempts: number;
  state: QueuedRequestState;
  lastError?: string;
}

interface OfflineQueueDB extends DBSchema {
  queue: {
    key: string;
    value: QueuedRequest;
    indexes: { 'by-state': QueuedRequestState; 'by-createdAt': number };
  };
}

const DB_NAME = 'tech-service-offline';
const STORE = 'queue';

function browserHasIndexedDB(): boolean {
  return typeof indexedDB !== 'undefined';
}

/**
 * Cola de mutaciones persistida en IndexedDB (vía `idb`).
 * El store no es reactivo: la reactividad (pendingCount/blockedCount) vive en
 * OfflineService. SSR-safe: fuera del browser no hace nada.
 */
@Service()
export class OfflineQueueStore {
  private dbPromise: Promise<IDBPDatabase<OfflineQueueDB>> | null = null;

  private db(): Promise<IDBPDatabase<OfflineQueueDB>> {
    if (!browserHasIndexedDB()) {
      return Promise.reject(new Error('IndexedDB not available'));
    }
    if (!this.dbPromise) {
      this.dbPromise = openDB<OfflineQueueDB>(DB_NAME, 1, {
        upgrade(db) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('by-state', 'state');
          store.createIndex('by-createdAt', 'createdAt');
        },
      });
    }
    return this.dbPromise;
  }

  async enqueue(request: QueuedRequest): Promise<void> {
    const db = await this.db();
    await db.put(STORE, request);
  }

  async getPending(): Promise<QueuedRequest[]> {
    const db = await this.db();
    const pending = await db.getAllFromIndex(STORE, 'by-state', 'pending');
    return pending.sort((a, b) => a.createdAt - b.createdAt);
  }

  async getBlocked(): Promise<QueuedRequest[]> {
    const db = await this.db();
    return db.getAllFromIndex(STORE, 'by-state', 'blocked');
  }

  async getById(id: string): Promise<QueuedRequest | undefined> {
    const db = await this.db();
    return db.get(STORE, id);
  }

  async update(request: QueuedRequest): Promise<void> {
    const db = await this.db();
    await db.put(STORE, request);
  }

  async remove(id: string): Promise<void> {
    const db = await this.db();
    await db.delete(STORE, id);
  }

  async clear(): Promise<void> {
    const db = await this.db();
    await db.clear(STORE);
  }

  async counts(): Promise<{ pending: number; blocked: number }> {
    const db = await this.db();
    const pending = await db.countFromIndex(STORE, 'by-state', 'pending');
    const blocked = await db.countFromIndex(STORE, 'by-state', 'blocked');
    return { pending, blocked };
  }
}
