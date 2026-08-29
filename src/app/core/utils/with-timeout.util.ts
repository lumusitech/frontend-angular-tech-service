/**
 * Envuelve una promesa con un timeout. Si no se resuelve antes de `ms`,
 * rechaza con un Error identificable (etiquetado con `label`).
 * La promesa original sigue su curso; se ignora su resultado posterior.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label = 'operation'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
