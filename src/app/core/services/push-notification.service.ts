import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

const VAPID_KEY_ENDPOINT = '/api/push/vapid-key';
const SUBSCRIBE_ENDPOINT = '/api/push/subscribe';
const UNSUBSCRIBE_ENDPOINT = '/api/push/unsubscribe';

@Service()
export class PushNotificationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly swPush = inject(SwPush);
  private readonly authService = inject(AuthService);

  readonly permission = signal<NotificationPermission>('default');
  readonly isSubscribed = signal(false);
  readonly supported = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId) && 'Notification' in window) {
      this.supported.set(true);
      this.permission.set(Notification.permission);
      this.listenForMessages();
      this.listenForClicks();
    }
  }

  async subscribe(): Promise<void> {
    if (!this.supported() || !this.swPush.isEnabled) return;
    if (!this.authService.isAuthenticated()) return;

    try {
      const permission = await Notification.requestPermission();
      this.permission.set(permission);

      if (permission !== 'granted') return;

      const response = await firstValueFrom(
        this.http.get<{ publicKey: string }>(VAPID_KEY_ENDPOINT),
      );

      if (!response?.publicKey) return;

      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: response.publicKey,
      });

      if (!subscription) return;

      const json = subscription.toJSON();
      const keys = json.keys;

      await firstValueFrom(
        this.http.post(SUBSCRIBE_ENDPOINT, {
          endpoint: subscription.endpoint,
          p256dh: keys?.['p256dh'] ?? '',
          auth: keys?.['auth'] ?? '',
          userAgent: navigator.userAgent,
        }),
      );

      this.isSubscribed.set(true);
    } catch (error) {
      console.warn('Push subscription failed:', error);
    }
  }

  async unsubscribe(): Promise<void> {
    if (!this.swPush.isEnabled) return;

    try {
      const subscription = await firstValueFrom(this.swPush.subscription);
      if (subscription) {
        await firstValueFrom(
          this.http.delete(UNSUBSCRIBE_ENDPOINT, {
            body: { endpoint: subscription.endpoint },
          }),
        );
        await subscription.unsubscribe();
      }
      this.isSubscribed.set(false);
    } catch (error) {
      console.warn('Push unsubscribe failed:', error);
    }
  }

  private listenForMessages(): void {
    this.swPush.messages.subscribe((message: { title?: string; body?: string; url?: string }) => {
      const data = message;
      if (data.title && data.body) {
        new Notification(data.title, {
          body: data.body,
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/icon-72x72.png',
          data: { url: data.url ?? '/' },
        });
      }
    });
  }

  private listenForClicks(): void {
    this.swPush.notificationClicks.subscribe((event) => {
      const url = (event.notification.data as { url?: string })?.url ?? '/';
      window.open(url, '_blank');
    });
  }

  autoSubscribe(): void {
    if (!this.supported() || !this.authService.isAuthenticated()) return;
    if (Notification.permission === 'granted') {
      this.subscribe();
    }
  }
}
