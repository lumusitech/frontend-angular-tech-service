/**
 * Setup global de tests: polyfill de localStorage/sessionStorage.
 *
 * Node 22+ expone globals experimentales `localStorage`/`sessionStorage` que
 * devuelven `undefined` (a menos que se pase --localstorage-file) y "pisan" el
 * entorno jsdom del runner, rompiendo los tests que persisten en localStorage.
 */
class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

function installStoragePolyfill(name: 'localStorage' | 'sessionStorage'): void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  const hasWorkingValue = descriptor != null && 'value' in descriptor && descriptor.value != null;
  if (!hasWorkingValue) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      enumerable: true,
      value: new MemoryStorage(),
    });
  }
}

installStoragePolyfill('localStorage');
installStoragePolyfill('sessionStorage');
