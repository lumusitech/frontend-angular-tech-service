import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-quick-actions-widget',
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {{ 'dashboard.quickActions' | translate }}
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1" (click)="navigate.emit('/admin/work-orders')">
          <mat-icon>add_circle</mat-icon>
          <span class="text-xs">{{ 'dashboard.newOrder' | translate }}</span>
        </button>
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1" (click)="navigate.emit('/admin/clients')">
          <mat-icon>person_add</mat-icon>
          <span class="text-xs">{{ 'dashboard.newClient' | translate }}</span>
        </button>
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1" (click)="navigate.emit('/admin/pending-items')">
          <mat-icon>pending_actions</mat-icon>
          <span class="text-xs">{{ 'dashboard.pendingItems' | translate }}</span>
        </button>
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1" (click)="navigate.emit('/admin/expenses')">
          <mat-icon>money_off</mat-icon>
          <span class="text-xs">{{ 'dashboard.viewExpenses' | translate }}</span>
        </button>
      </div>
    </div>
  `,
})
export class QuickActionsWidgetComponent {
  navigate = output<string>();
}
