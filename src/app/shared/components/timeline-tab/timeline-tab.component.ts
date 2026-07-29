import { Component, inject, input, signal, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkOrderStatusLog } from '../../../core/models/work-order.interfaces';
import { StatusTimelineComponent } from '../status-timeline/status-timeline.component';

@Component({
  selector: 'app-timeline-tab',
  imports: [StatusTimelineComponent],
  template: `
    @if (loading()) {
      <div class="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
        Cargando timeline...
      </div>
    } @else if (logs().length > 0) {
      <div class="p-4">
        <app-status-timeline [logs]="logs()" />
      </div>
    }
  `,
})
export class TimelineTabComponent implements OnInit {
  private readonly http = inject(HttpClient);
  orderId = input.required<string>();

  readonly logs = signal<WorkOrderStatusLog[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.http
      .get<WorkOrderStatusLog[]>(`/api/work-orders/${this.orderId()}/status-logs`, {
        headers: new HttpHeaders({ 'X-Skip-Loading': 'true' }),
      })
      .subscribe({
        next: (data) => {
          this.logs.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
