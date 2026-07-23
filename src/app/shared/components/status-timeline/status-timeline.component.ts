import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkOrderStatusLog } from '../../../core/models/work-order.interfaces';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { StatusClassPipe } from '../../pipes/status-class.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

@Component({
  selector: 'app-status-timeline',
  imports: [DatePipe, StatusLabelPipe, StatusClassPipe, TranslatePipe],
  template: `
    <div class="space-y-0">
      @for (log of logs(); track log.id; let last = $last) {
        <div class="flex gap-3">
          <!-- Circle + line -->
          <div class="flex flex-col items-center">
            <div
              class="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white dark:ring-gray-800"
              [class]="log.toStatus | statusClass: 'workOrderStatus'"
            ></div>
            @if (!last) {
              <div class="w-0.5 flex-1 min-h-[2rem] bg-gray-200 dark:bg-gray-700"></div>
            }
          </div>

          <!-- Content -->
          <div class="pb-4 flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                [class]="log.toStatus | statusClass: 'workOrderStatus'"
              >
                {{ log.toStatus | statusLabel: 'workOrderStatus' }}
              </span>
              <span class="text-xs text-gray-400 dark:text-gray-500">
                {{ log.timestamp | date: 'dd/MM/yy HH:mm' }}
              </span>
            </div>
            @if (log.duration != null) {
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {{ 'statusTimeline.duration' | translate }}: {{ formatDuration(log.duration) }}
              </p>
            }
            @if (log.changedBy) {
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {{ log.changedBy.name }} ({{ log.changedByRole }})
              </p>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class StatusTimelineComponent {
  logs = input.required<WorkOrderStatusLog[]>();
  readonly formatDuration = formatDuration;
}
