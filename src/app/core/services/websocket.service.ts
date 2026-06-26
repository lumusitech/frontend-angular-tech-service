import { Service, inject, signal, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { NotificationsService } from './notifications.service';
import { AppNotification } from '../models/notification.interfaces';
import { environment } from '../../../environments/environment';

@Service()
export class WebsocketService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);

  private socket: Socket | null = null;
  readonly connected = signal(false);
  readonly lastNotification = signal<AppNotification | null>(null);

  connect(): void {
    if (this.socket?.connected) return;

    const token = this.authService.token();
    if (!token) return;

    this.socket = io(environment.wsUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      this.connected.set(true);
    });

    this.socket.on('disconnect', () => {
      this.connected.set(false);
    });

    this.socket.on('notification', (data: AppNotification) => {
      this.lastNotification.set(data);
      this.notificationsService.incrementUnread();
    });

    this.socket.on('connect_error', () => {
      this.connected.set(false);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected.set(false);
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
