import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { PendingItemSummary } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-pending-items-widget',
  imports: [MatIconModule, MatButtonModule, DatePipe, TranslatePipe, StatusLabelPipe],
  template: `
    @if (items().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'dashboard.pendingItems' | translate }}
          </h3>
          <button mat-button color="primary" (click)="viewAll.emit()">
            {{ 'common.details' | translate }}
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
        <div class="space-y-3">
          @for (item of items(); track item.id) {
            <div
              class="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
              (click)="itemClick.emit(item.id)"
              [class.border-red-200]="item.priority === 'urgent'"
              [class.dark:border-red-800]="item.priority === 'urgent'"
              [class.bg-red-50]="item.priority === 'urgent'"
              [class.dark:bg-red-900/20]="item.priority === 'urgent'"
              [class.border-orange-200]="item.priority === 'high'"
              [class.dark:border-orange-800]="item.priority === 'high'"
              [class.bg-orange-50]="item.priority === 'high'"
              [class.dark:bg-orange-900/20]="item.priority === 'high'"
              [class.border-gray-200]="item.priority !== 'urgent' && item.priority !== 'high'"
              [class.dark:border-gray-700]="item.priority !== 'urgent' && item.priority !== 'high'"
            >
              <div class="flex items-center gap-3">
                <mat-icon
                  [class.text-red-500]="item.priority === 'urgent'"
                  [class.text-orange-500]="item.priority === 'high'"
                  [class.text-gray-400]="item.priority !== 'urgent' && item.priority !== 'high'"
                >
                  {{ item.status === 'completed' ? 'check_circle' : 'pending_actions' }}
                </mat-icon>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ 'pendingItems.dueDate' | translate }}: {{ item.dueDate | date: 'dd/MM/yyyy' }}
                    @if (item.assignedTo) {
                      &middot; {{ item.assignedTo.name }}
                    }
                  </p>
                </div>
              </div>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                [class.bg-red-100]="item.priority === 'urgent'"
                [class.dark:bg-red-900/30]="item.priority === 'urgent'"
                [class.text-red-700]="item.priority === 'urgent'"
                [class.dark:text-red-400]="item.priority === 'urgent'"
                [class.bg-orange-100]="item.priority === 'high'"
                [class.dark:bg-orange-900/30]="item.priority === 'high'"
                [class.text-orange-700]="item.priority === 'high'"
                [class.dark:text-orange-400]="item.priority === 'high'"
                [class.bg-gray-100]="item.priority !== 'urgent' && item.priority !== 'high'"
                [class.dark:bg-gray-700]="item.priority !== 'urgent' && item.priority !== 'high'"
                [class.text-gray-700]="item.priority !== 'urgent' && item.priority !== 'high'"
                [class.dark:text-gray-300]="item.priority !== 'urgent' && item.priority !== 'high'"
              >
                {{ item.priority | statusLabel: 'workOrderPriority' }}
              </span>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class PendingItemsWidgetComponent {
  items = input.required<PendingItemSummary[]>();
  viewAll = output<void>();
  itemClick = output<string>();
}
