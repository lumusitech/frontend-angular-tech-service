import { withTimeout } from './with-timeout.util';

describe('withTimeout', () => {
  it('resolves with the value when the promise settles before the timeout', async () => {
    await expect(withTimeout(Promise.resolve(42), 1000)).resolves.toBe(42);
  });

  it('rejects with the original error before the timeout', async () => {
    const error = new Error('boom');
    await expect(withTimeout(Promise.reject(error), 1000)).rejects.toBe(error);
  });

  it('rejects after the timeout when the promise never settles', async () => {
    vi.useFakeTimers();
    try {
      const never = new Promise<never>(() => undefined);
      const promise = withTimeout(never, 5000, 'test');
      const timerPromise = promise.catch((error: Error) => error);
      await vi.advanceTimersByTimeAsync(5000);
      const error = await timerPromise;
      expect(error.message).toBe('test timed out after 5000ms');
    } finally {
      vi.useRealTimers();
    }
  });
});
