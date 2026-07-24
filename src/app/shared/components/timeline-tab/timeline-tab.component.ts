import { Component, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkOrderStatusLog } from '../../../core/models/work-order.interfaces';
import { StatusTimelineComponent } from '../status-timeline/status-timeline.component';

@Component({
  selector: 'app-timeline-tab',
  imports: [MatProgressSpinnerModule, StatusTimelineComponent],
  template: `
    @if (logsResource.hasValue() && logsResource.value().length > 0) {
      <div class="p-4">
        <app-status-timeline [logs]="logsResource.value()" />
      </div>
    } @else if (logsResource.isLoading()) {
      <div class="flex justify-center py-8">
        <mat-spinner diameter="32" />
      </div>
    } @else if (logsResource.hasValue() && logsResource.value().length === 0) {
      <div class="flex justify-center py-8">
        <p class="text-sm text-gray-400 dark:text-gray-500">
          No hay cambios de estado registrados.
        </p>
      </div>
    }
  `,
})
export class TimelineTabComponent {
  orderId = input.required<string>();

  readonly logsResource = httpResource<WorkOrderStatusLog[]>(() => ({
    url: `/api/work-orders/${this.orderId()}/status-logs`,
  }));
}
