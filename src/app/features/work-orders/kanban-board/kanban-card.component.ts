import { Component, input, output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrder } from '../../../core/models/work-order.interfaces';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../../shared/components/tracking-code/tracking-code.component';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-kanban-card',
  imports: [
    DragDropModule,
    MatIconModule,
    StatusBadgeComponent,
    TrackingCodeComponent,
    RelativeDatePipe,
  ],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 space-y-2 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-shadow"
      role="button"
      tabindex="0"
      (click)="cardClick.emit(order().id)"
      (keydown.enter)="cardClick.emit(order().id)"
      (keydown.space)="cardClick.emit(order().id)"
    >
      <div class="flex items-center justify-between gap-2">
        <app-tracking-code [code]="order().trackingCode" />
        <app-status-badge [value]="order().priority" type="workOrderPriority" />
      </div>

      <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
        {{ order().client?.name || '-' }}
      </div>

      <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <mat-icon class="!w-3.5 !h-3.5 !text-sm">build</mat-icon>
        <span class="truncate">{{ order().serviceType?.name || '-' }}</span>
      </div>

      <div class="flex items-center justify-between gap-2 pt-1">
        @if (order().scheduledDate) {
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ order().scheduledDate | relativeDate }}
          </span>
        } @else {
          <span></span>
        }
        @if (order().technicians.length > 0) {
          <div class="flex items-center -space-x-1.5">
            @for (tech of order().technicians.slice(0, 3); track tech.id) {
              <div
                class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-semibold border-2 border-white dark:border-gray-800"
                [title]="tech.name"
              >
                {{ tech.name.charAt(0).toUpperCase() }}
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class KanbanCardComponent {
  order = input.required<WorkOrder>();
  cardClick = output<string>();
}
