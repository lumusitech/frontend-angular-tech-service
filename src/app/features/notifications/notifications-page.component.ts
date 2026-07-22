import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsListComponent } from './notifications-list.component';
import { AppNotification, NotificationType } from '../../core/models/notification.interfaces';

@Component({
  selector: 'app-notifications-page',
  imports: [NotificationsListComponent],
  template: `
    <app-notifications-list (notificationClick)="handleClick($event)" />
  `,
})
export class NotificationsPageComponent {
  private readonly router = inject(Router);

  handleClick(notification: AppNotification): void {
    if (!notification.referenceType) return;

    if (notification.referenceType === 'work_order' && notification.referenceId) {
      this.router.navigate(['/admin/work-orders', notification.referenceId]);
      return;
    }

    if (notification.referenceType === 'task' && notification.referenceId) {
      this.router.navigate(['/admin/work-orders', notification.referenceId]);
      return;
    }

    const routes: Record<string, string> = {
      payment: '/admin/payments',
      pending_item: '/admin/pending-items',
      inquiry: '/admin/inquiries',
    };

    const baseRoute = routes[notification.referenceType];
    if (!baseRoute) return;

    this.router.navigate([baseRoute], { queryParams: { fromNotification: 'true' } });
  }
}
