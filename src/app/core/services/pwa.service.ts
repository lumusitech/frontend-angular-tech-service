import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

@Service()
export class PwaService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly installPromptEvent = signal<BeforeInstallPromptEvent | null>(null);
  readonly installAvailable = signal(false);
  readonly installed = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.listenForInstallPrompt();
    }
  }

  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPromptEvent.set(event as BeforeInstallPromptEvent);
      this.installAvailable.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.installPromptEvent.set(null);
      this.installAvailable.set(false);
      this.installed.set(true);
    });
  }

  async install(): Promise<void> {
    const promptEvent = this.installPromptEvent();
    if (!promptEvent) {
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;

    if (choice.outcome === 'accepted') {
      this.installPromptEvent.set(null);
      this.installAvailable.set(false);
    }
  }

  dismiss(): void {
    this.installPromptEvent.set(null);
    this.installAvailable.set(false);
  }
}
