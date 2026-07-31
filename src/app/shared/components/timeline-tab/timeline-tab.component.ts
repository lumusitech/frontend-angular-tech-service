import { Component, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { WorkOrderStatusLog } from '../../../core/models/work-order.interfaces';
import { StatusTimelineComponent } from '../status-timeline/status-timeline.component';
import { WebsocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-timeline-tab',
  imports: [StatusTimelineComponent],
  template: `
    @if (resource.isLoading() && !resource.hasValue()) {
      <div class="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
        Cargando timeline...
      </div>
    } @else if (resource.hasValue() && resource.value().length > 0) {
      <div class="p-4">
        <app-status-timeline [logs]="resource.value()" />
      </div>
    }
  `,
})
export class TimelineTabComponent {
  private readonly websocketService = inject(WebsocketService);
  orderId = input.required<string>();

  readonly resource = httpResource<WorkOrderStatusLog[]>(() => {
    this.websocketService.workOrderRefreshKey();
    return `/api/work-orders/${this.orderId()}/status-logs`;
  });
}
