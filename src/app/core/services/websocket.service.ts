import { Service, inject, signal, OnDestroy, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { NotificationsService } from './notifications.service';
import { AppNotification } from '../models/notification.interfaces';
import {
  NOTIFICATION_TOAST_ICONS,
  ToastContentComponent,
} from '../../shared/components/notification-toast/notification-toast.component';
import { environment } from '../../../environments/environment';

@Service()
export class WebsocketService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private socket: Socket | null = null;
  readonly connected = signal(false);
  readonly lastNotification = signal<AppNotification | null>(null);
  readonly workOrderRefreshKey = signal(0);
  readonly workOrderStatusChanges = signal<Record<string, string>>({});

  connect(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.socket?.connected) return;

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    const token = this.authService.token();
    if (!token) return;

    // Same-origin (empty wsUrl) goes through Angular proxy → works on PC and phone.
    // Absolute wsUrl is only for special setups.
    const url = environment.wsUrl || undefined;

    this.socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.ngZone.run(() => this.connected.set(true));
    });

    this.socket.on('disconnect', () => {
      this.ngZone.run(() => this.connected.set(false));
    });

    this.socket.on('notification', (data: AppNotification) => {
      this.ngZone.run(() => {
        this.lastNotification.set(data);
        this.notificationsService.incrementUnread();
        this.showNotificationToast(data);
        if (data.referenceType === 'work_order') {
          this.workOrderRefreshKey.update((n) => n + 1);
        }
        if (
          data.type === ('work_order.status_changed' as any) &&
          data.referenceId &&
          data.metadata
        ) {
          const newStatus = data.metadata['newStatus'];
          const refId = data.referenceId;
          if (typeof newStatus === 'string' && refId) {
            this.workOrderStatusChanges.update((map) => ({
              ...map,
              [refId]: newStatus,
            }));
          }
        }
      });
    });

    this.socket.on('connect_error', () => {
      this.ngZone.run(() => this.connected.set(false));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.connected.set(false);
    }
  }

  private showNotificationToast(notification: AppNotification): void {
    const icon = NOTIFICATION_TOAST_ICONS[notification.type] || 'notifications';

    this.snackBar.openFromComponent(ToastContentComponent, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['notification-toast-panel'],
      data: {
        title: notification.title,
        message: notification.message,
        icon,
      },
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
