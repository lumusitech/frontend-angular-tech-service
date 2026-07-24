import { Component, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { WorkOrderStatusLog } from '../../../core/models/work-order.interfaces';
import { StatusTimelineComponent } from '../status-timeline/status-timeline.component';

@Component({
  selector: 'app-timeline-tab',
  imports: [StatusTimelineComponent],
  template: `
    @if (logsResource.value(); as logs) {
      @if (logs.length > 0) {
        <div class="p-4">
          <app-status-timeline [logs]="logs" />
        </div>
      }
    }
  `,
})
export class TimelineTabComponent {
  orderId = input.required<string>();

  readonly logsResource = httpResource<WorkOrderStatusLog[]>(() => ({
    url: `/api/work-orders/${this.orderId()}/status-logs`,
  }));
}
