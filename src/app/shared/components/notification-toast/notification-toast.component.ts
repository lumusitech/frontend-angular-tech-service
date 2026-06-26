import { Component, effect, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WebsocketService } from '../../../core/services/websocket.service';
import { NotificationType } from '../../../core/models/notification.interfaces';

const TYPE_ICONS: Record<string, string> = {
  [NotificationType.WORK_ORDER_CREATED]: 'assignment',
  [NotificationType.WORK_ORDER_STATUS_CHANGED]: 'sync',
  [NotificationType.WORK_ORDER_TECHNICIAN_ASSIGNED]: 'person_add',
  [NotificationType.TASK_CREATED]: 'task',
  [NotificationType.TASK_COMPLETED]: 'task_alt',
  [NotificationType.PAYMENT_CREATED]: 'payment',
  [NotificationType.PAYMENT_APPROVED]: 'check_circle',
  [NotificationType.PAYMENT_REJECTED]: 'cancel',
  [NotificationType.PENDING_ITEM_CREATED]: 'pending_actions',
  [NotificationType.PENDING_ITEM_DUE_TODAY]: 'alarm',
  [NotificationType.PENDING_ITEM_OVERDUE]: 'warning',
  [NotificationType.INQUIRY_CREATED]: 'help_outline',
  [NotificationType.INQUIRY_ASSIGNED]: 'person_add',
  [NotificationType.INQUIRY_CONTACTED]: 'phone',
  [NotificationType.INQUIRY_REVIEWED]: 'rate_review',
};

interface ToastData {
  title: string;
  message: string;
  icon: string;
}

@Component({
  selector: 'app-toast-content',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex items-start gap-3 min-w-[320px] max-w-[400px]">
      <mat-icon class="!text-blue-500 !mt-0.5 shrink-0">{{ data.icon }}</mat-icon>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ data.title }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{{ data.message }}</p>
      </div>
      <button mat-icon-button (click)="dismiss()" class="!-mt-1 !-mr-1 shrink-0">
        <mat-icon class="!w-4 !h-4">close</mat-icon>
      </button>
    </div>
  `,
  host: { class: 'block' },
})
export class ToastContentComponent {
  readonly data: ToastData = inject(MAT_SNACK_BAR_DATA);
  private readonly snackBar = inject(MatSnackBar);

  dismiss(): void {
    this.snackBar.dismiss();
  }
}

@Component({
  selector: 'app-notification-toast',
  imports: [],
  template: '',
})
export class NotificationToastComponent {
  private readonly websocketService = inject(WebsocketService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      const notification = this.websocketService.lastNotification();
      if (!notification) return;

      const icon = TYPE_ICONS[notification.type] || 'notifications';

      this.snackBar.openFromComponent(ToastContentComponent, {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notification-toast-panel'],
        data: {
          title: notification.title,
          message: notification.message,
          icon,
        } satisfies ToastData,
      });
    });
  }
}
