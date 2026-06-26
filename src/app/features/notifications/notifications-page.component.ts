import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsListComponent } from './notifications-list.component';
import { AppNotification } from '../../core/models/notification.interfaces';
import { getSearchTerm } from '../../core/utils/notification.utils';

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

    const routes: Record<string, string> = {
      work_order: '/admin/work-orders',
      task: '/admin/work-orders',
      payment: '/admin/payments',
      pending_item: '/admin/pending-items',
      inquiry: '/admin/inquiries',
    };

    const baseRoute = routes[notification.referenceType];
    if (!baseRoute) return;

    const search = getSearchTerm(notification);

    const queryParams: Record<string, string> = {};

    if (notification.referenceId) {
      queryParams['highlight'] = notification.referenceId;
    } else if (search) {
      queryParams['highlight'] = search;
    }

    if (search) {
      queryParams['search'] = search;
    }

    queryParams['fromNotification'] = 'true';

    this.router.navigate([baseRoute], { queryParams });
  }
}
