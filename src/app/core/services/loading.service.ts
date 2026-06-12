import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
  private readonly loadingSignal = signal(false);
  private readonly requestCount = signal(0);

  readonly isLoading = this.loadingSignal.asReadonly();

  show(): void {
    this.requestCount.update((count) => count + 1);
    this.loadingSignal.set(true);
  }

  hide(): void {
    this.requestCount.update((count) => {
      const newCount = count - 1;
      if (newCount <= 0) {
        this.loadingSignal.set(false);
        return 0;
      }
      return newCount;
    });
  }
}
