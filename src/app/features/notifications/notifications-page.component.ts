import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsListComponent } from './notifications-list.component';
import { AppNotification } from '../../core/models/notification.interfaces';

@Component({
  selector: 'app-notifications-page',
  imports: [NotificationsListComponent],
  template: ` <app-notifications-list (notificationClick)="handleClick($event)" /> `,
})
export class NotificationsPageComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  handleClick(notification: AppNotification): void {
    if (!notification.referenceType) return;

    if (this.authService.isAdmin()) {
      this.handleAdminClick(notification);
    } else if (this.authService.isTechnician()) {
      this.handleTechClick(notification);
    }
  }

  private handleAdminClick(notification: AppNotification): void {
    const refType = notification.referenceType;
    if (!refType) return;

    if ((refType === 'work_order' || refType === 'task') && notification.referenceId) {
      this.router.navigate(['/admin/work-orders', notification.referenceId]);
      return;
    }

    const routes: Record<string, string> = {
      payment: '/admin/payments',
      pending_item: '/admin/pending-items',
      inquiry: '/admin/inquiries',
    };

    const baseRoute = routes[refType];
    if (!baseRoute) return;

    this.router.navigate([baseRoute], { queryParams: { fromNotification: 'true' } });
  }

  private handleTechClick(notification: AppNotification): void {
    const refType = notification.referenceType;
    if (!refType) return;

    if ((refType === 'work_order' || refType === 'task') && notification.referenceId) {
      this.router.navigate(['/tech', notification.referenceId]);
      return;
    }
  }
}
