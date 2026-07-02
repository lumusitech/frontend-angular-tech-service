// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, effect, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WebsocketService } from '../../../core/services/websocket.service';
import { NotificationType } from '../../../core/models/notification.interfaces';
const TYPE_ICONS: Record<string, string> = stryMutAct_9fa48("6024") ? {} : (stryCov_9fa48("6024"), {
  [NotificationType.WORK_ORDER_CREATED]: stryMutAct_9fa48("6025") ? "" : (stryCov_9fa48("6025"), 'assignment'),
  [NotificationType.WORK_ORDER_STATUS_CHANGED]: stryMutAct_9fa48("6026") ? "" : (stryCov_9fa48("6026"), 'sync'),
  [NotificationType.WORK_ORDER_TECHNICIAN_ASSIGNED]: stryMutAct_9fa48("6027") ? "" : (stryCov_9fa48("6027"), 'person_add'),
  [NotificationType.TASK_CREATED]: stryMutAct_9fa48("6028") ? "" : (stryCov_9fa48("6028"), 'task'),
  [NotificationType.TASK_COMPLETED]: stryMutAct_9fa48("6029") ? "" : (stryCov_9fa48("6029"), 'task_alt'),
  [NotificationType.PAYMENT_CREATED]: stryMutAct_9fa48("6030") ? "" : (stryCov_9fa48("6030"), 'payment'),
  [NotificationType.PAYMENT_APPROVED]: stryMutAct_9fa48("6031") ? "" : (stryCov_9fa48("6031"), 'check_circle'),
  [NotificationType.PAYMENT_REJECTED]: stryMutAct_9fa48("6032") ? "" : (stryCov_9fa48("6032"), 'cancel'),
  [NotificationType.PENDING_ITEM_CREATED]: stryMutAct_9fa48("6033") ? "" : (stryCov_9fa48("6033"), 'pending_actions'),
  [NotificationType.PENDING_ITEM_DUE_TODAY]: stryMutAct_9fa48("6034") ? "" : (stryCov_9fa48("6034"), 'alarm'),
  [NotificationType.PENDING_ITEM_OVERDUE]: stryMutAct_9fa48("6035") ? "" : (stryCov_9fa48("6035"), 'warning'),
  [NotificationType.INQUIRY_CREATED]: stryMutAct_9fa48("6036") ? "" : (stryCov_9fa48("6036"), 'help_outline'),
  [NotificationType.INQUIRY_ASSIGNED]: stryMutAct_9fa48("6037") ? "" : (stryCov_9fa48("6037"), 'person_add'),
  [NotificationType.INQUIRY_CONTACTED]: stryMutAct_9fa48("6038") ? "" : (stryCov_9fa48("6038"), 'phone'),
  [NotificationType.INQUIRY_REVIEWED]: stryMutAct_9fa48("6039") ? "" : (stryCov_9fa48("6039"), 'rate_review')
});
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
  host: {
    class: 'block'
  }
})
export class ToastContentComponent {
  readonly data: ToastData = inject(MAT_SNACK_BAR_DATA);
  private readonly snackBar = inject(MatSnackBar);
  dismiss(): void {
    if (stryMutAct_9fa48("6040")) {
      {}
    } else {
      stryCov_9fa48("6040");
      this.snackBar.dismiss();
    }
  }
}
@Component({
  selector: 'app-notification-toast',
  imports: [],
  template: ''
})
export class NotificationToastComponent {
  private readonly websocketService = inject(WebsocketService);
  private readonly snackBar = inject(MatSnackBar);
  constructor() {
    if (stryMutAct_9fa48("6041")) {
      {}
    } else {
      stryCov_9fa48("6041");
      effect(() => {
        if (stryMutAct_9fa48("6042")) {
          {}
        } else {
          stryCov_9fa48("6042");
          const notification = this.websocketService.lastNotification();
          if (stryMutAct_9fa48("6045") ? false : stryMutAct_9fa48("6044") ? true : stryMutAct_9fa48("6043") ? notification : (stryCov_9fa48("6043", "6044", "6045"), !notification)) return;
          const icon = stryMutAct_9fa48("6048") ? TYPE_ICONS[notification.type] && 'notifications' : stryMutAct_9fa48("6047") ? false : stryMutAct_9fa48("6046") ? true : (stryCov_9fa48("6046", "6047", "6048"), TYPE_ICONS[notification.type] || (stryMutAct_9fa48("6049") ? "" : (stryCov_9fa48("6049"), 'notifications')));
          this.snackBar.openFromComponent(ToastContentComponent, stryMutAct_9fa48("6050") ? {} : (stryCov_9fa48("6050"), {
            duration: 5000,
            horizontalPosition: stryMutAct_9fa48("6051") ? "" : (stryCov_9fa48("6051"), 'end'),
            verticalPosition: stryMutAct_9fa48("6052") ? "" : (stryCov_9fa48("6052"), 'top'),
            panelClass: stryMutAct_9fa48("6053") ? [] : (stryCov_9fa48("6053"), [stryMutAct_9fa48("6054") ? "" : (stryCov_9fa48("6054"), 'notification-toast-panel')]),
            data: (stryMutAct_9fa48("6055") ? {} : (stryCov_9fa48("6055"), {
              title: notification.title,
              message: notification.message,
              icon
            })) satisfies ToastData
          }));
        }
      });
    }
  }
}