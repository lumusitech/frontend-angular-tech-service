import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
  private readonly loadingSignal = signal(false);
  private readonly requestCount = signal(0);
  private showTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly isLoading = this.loadingSignal.asReadonly();

  show(): void {
    this.requestCount.update((count) => count + 1);
    if (!this.showTimeoutId) {
      this.showTimeoutId = setTimeout(() => {
        this.loadingSignal.set(true);
        this.showTimeoutId = null;
      }, 300);
    }
  }

  hide(): void {
    this.requestCount.update((count) => {
      const newCount = count - 1;
      if (newCount <= 0) {
        if (this.showTimeoutId) {
          clearTimeout(this.showTimeoutId);
          this.showTimeoutId = null;
        }
        this.loadingSignal.set(false);
        return 0;
      }
      return newCount;
    });
  }
}
