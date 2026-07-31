import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { WebsocketService } from '../../core/services/websocket.service';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  WorkOrder,
  WorkOrderStatus,
  UpdateWorkOrderDto,
} from '../../core/models/work-order.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { UrgencyIndicatorComponent } from '../../shared/components/urgency-indicator/urgency-indicator.component';
import {
  StatusChangeDialogComponent,
  StatusChangeDialogResult,
} from '../../shared/components/status-change-dialog/status-change-dialog.component';
import { NoteDialogComponent } from '../work-orders/add-note-dialog.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';
import { TimelineTabComponent } from '../../shared/components/timeline-tab/timeline-tab.component';

interface TechStatusAction {
  labelKey: string;
  icon: string;
  color: string;
  nextStatus: string;
}

const ACTIONS_BY_STATUS: Record<string, TechStatusAction[]> = {
  assigned: [
    {
      labelKey: 'workOrders.actions.onTheWay',
      icon: 'directions_car',
      color: 'primary',
      nextStatus: 'on_the_way',
    },
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  on_the_way: [
    {
      labelKey: 'workOrders.actions.startWork',
      icon: 'play_arrow',
      color: 'primary',
      nextStatus: 'in_progress',
    },
    {
      labelKey: 'workOrders.actions.reAssign',
      icon: 'assignment_return',
      color: '',
      nextStatus: 'assigned',
    },
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  in_progress: [
    {
      labelKey: 'workOrders.actions.complete',
      icon: 'check_circle',
      color: 'primary',
      nextStatus: 'completed',
    },
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  completed: [
    { labelKey: 'workOrders.actions.reopen', icon: 'replay', color: '', nextStatus: 'in_progress' },
  ],
  cancelled: [
    {
      labelKey: 'workOrders.actions.reopen',
      icon: 'replay',
      color: 'primary',
      nextStatus: 'pending',
    },
  ],
};

@Component({
  selector: 'app-tech-work-order-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    PageHeaderComponent,
    UrgencyIndicatorComponent,
    DatePipe,
    DecimalPipe,
    TranslatePipe,
    StatusLabelPipe,
    RelativeDatePipe,
    TimelineTabComponent,
  ],
  template: `
    @if (unassigned()) {
      <div class="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <mat-icon class="!w-16 !h-16">info</mat-icon>
        <p class="text-gray-500 dark:text-gray-400">
          {{ 'technician.unassignedMessage' | translate }}
        </p>
        <button mat-flat-button color="primary" (click)="goBack()">
          {{ 'common.back' | translate }}
        </button>
      </div>
    } @else if (currentOrder() !== null) {
      @let order = currentOrder()!;

      <div class="space-y-4">
        <app-page-header [title]="order.trackingCode" [subtitle]="order.client?.name || ''">
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            {{ 'common.back' | translate }}
          </button>
        </app-page-header>

        <!-- Status + urgency + priority -->
        <div class="flex items-center gap-3 flex-wrap">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            [class]="getStatusColor(order.status)"
          >
            {{ order.status | statusLabel: 'workOrderStatus' }}
          </span>
          <app-urgency-indicator [scheduledDate]="order.scheduledDate || null" />
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ order.serviceType?.name || '-' }}
          </span>
          @if (order.location) {
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ order.location === 'workshop' ? 'Taller' : 'Domicilio' }}
            </span>
          }
        </div>

        <!-- Action buttons -->
        @if (getActions(order.status); as actions) {
          @if (actions.length > 0) {
            <div class="flex gap-2 flex-wrap">
              @for (action of actions; track action.nextStatus) {
                <button
                  mat-flat-button
                  [color]="action.color"
                  (click)="changeStatus(order, action)"
                >
                  <mat-icon>{{ action.icon }}</mat-icon>
                  {{ action.labelKey | translate }}
                </button>
              }
            </div>
          }
        }

        <!-- Tasks checklist -->
        @if (order.tasks && order.tasks.length > 0) {
          <mat-card class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ 'technician.tasks' | translate }}
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ getCompletedTasks(order) }}/{{ order.tasks.length }}
              </span>
            </div>
            <!-- Progress bar -->
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
              <div
                class="h-full bg-green-500 rounded-full transition-all"
                [style.width.%]="getTaskProgress(order)"
              ></div>
            </div>
            <div class="space-y-2">
              @for (task of order.tasks; track task.id) {
                <div
                  class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  (click)="toggleTask(order.id, task)"
                >
                  <div
                    class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                    [class]="
                      task.isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    "
                  >
                    @if (task.isCompleted) {
                      <mat-icon class="text-white !w-3.5 !h-3.5">check</mat-icon>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm"
                      [class]="
                        task.isCompleted
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-gray-100'
                      "
                    >
                      {{ task.title }}
                    </p>
                    @if (task.description) {
                      <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {{ task.description }}
                      </p>
                    }
                  </div>
                </div>
              }
            </div>
          </mat-card>
        }

        <!-- Materials -->
        @if (order.materials && order.materials.length > 0) {
          <mat-card class="p-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {{ 'technician.materials' | translate }}
            </h3>
            <div class="space-y-2">
              @for (material of order.materials; track material.id) {
                <div
                  class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <p class="text-sm text-gray-900 dark:text-gray-100">
                      {{ material.description }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ material.quantity }} x {{ material.unitCost | number: '1.2-2' }}
                    </p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {{ material.quantity * material.unitCost | number: '1.2-2' }}
                  </p>
                </div>
              }
            </div>
          </mat-card>
        }

        <!-- Notes -->
        <mat-card class="p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ 'technician.notes' | translate }}
            </h3>
            <button mat-button color="primary" (click)="addNote(order.id)">
              <mat-icon>add</mat-icon>
              {{ 'technician.addNote' | translate }}
            </button>
          </div>
          @if (order.notes && order.notes.length > 0) {
            <div class="space-y-2">
              @for (note of order.notes; track note.id) {
                <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div class="flex items-center gap-2 mb-1">
                    <span
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                      [class]="getNoteTypeClass(note.type)"
                    >
                      {{ note.type | statusLabel: 'noteType' }}
                    </span>
                    <span class="text-xs text-gray-400 dark:text-gray-500">
                      {{ note.createdAt | relativeDate }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ note.content }}</p>
                </div>
              }
            </div>
          } @else {
            <p class="text-sm text-gray-400 dark:text-gray-500">
              {{ 'common.noResults' | translate }}
            </p>
          }
        </mat-card>

        <!-- Info -->
        <mat-card class="p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {{ 'common.details' | translate }}
          </h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{
                'workOrders.scheduledDate' | translate
              }}</span>
              <p class="text-gray-900 dark:text-gray-100">
                {{ order.scheduledDate ? (order.scheduledDate | date: 'dd/MM/yyyy') : '-' }}
              </p>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{
                'workOrders.diagnosis' | translate
              }}</span>
              <p class="text-gray-900 dark:text-gray-100">{{ order.diagnosis || '-' }}</p>
            </div>
          </div>
        </mat-card>

        <!-- Client contact -->
        <mat-card class="p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {{ 'common.clientContact' | translate }}
          </h3>
          <div class="space-y-3">
            @if (order.client?.phone) {
              <div class="flex items-center gap-3">
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-gray-400">phone</mat-icon>
                <a
                  [href]="'tel:' + order.client.phone"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ order.client.phone }}
                </a>
                <a
                  [href]="'tel:' + order.client.phone"
                  mat-icon-button
                  class="!min-w-0 !p-1"
                  [title]="'common.call' | translate"
                >
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] !text-blue-500">phone</mat-icon>
                </a>
                <a
                  [href]="'https://wa.me/' + encodeURIComponent(order.client.phone)"
                  target="_blank"
                  rel="noopener"
                  mat-icon-button
                  class="!min-w-0 !p-1"
                  [title]="'common.whatsapp' | translate"
                >
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] !text-green-500">chat</mat-icon>
                </a>
              </div>
            }
            @if (order.client?.email) {
              <div class="flex items-center gap-3">
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-gray-400">email</mat-icon>
                <a
                  [href]="'mailto:' + order.client.email"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ order.client.email }}
                </a>
              </div>
            }
            @if (order.location === 'on_site' && (order.workAddress || order.client?.address)) {
              <div class="flex items-center gap-3">
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-gray-400"
                  >location_on</mat-icon
                >
                <a
                  [href]="
                    'https://maps.google.com/?q=' +
                    encodeURIComponent(order.workAddress || order.client.address!)
                  "
                  target="_blank"
                  rel="noopener"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ order.workAddress || order.client.address }}
                </a>
                <a
                  [href]="
                    'https://maps.google.com/?q=' +
                    encodeURIComponent(order.workAddress || order.client.address!)
                  "
                  target="_blank"
                  rel="noopener"
                  mat-icon-button
                  class="!min-w-0 !p-1"
                  [title]="'common.openInMaps' | translate"
                >
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] !text-green-500">map</mat-icon>
                </a>
              </div>
            }
          </div>
        </mat-card>

        <!-- Status Timeline -->
        <mat-card class="p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {{ 'workOrders.detail.statusTimeline' | translate }}
          </h3>
          <app-timeline-tab [orderId]="orderId" />
        </mat-card>
      </div>
    }
  `,
})
export class TechWorkOrderDetailComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly dialog = inject(MatDialog);
  private readonly websocketService = inject(WebsocketService);
  private readonly translationService = inject(TranslationService);
  readonly orderId = this.route.snapshot.paramMap.get('id') || '';
  readonly orderData = signal<WorkOrder>(this.route.snapshot.data['workOrder']);

  private readonly _refreshKey = signal(0);

  readonly resource = httpResource<WorkOrder>(() => {
    this._refreshKey();
    this.websocketService.workOrderRefreshKey();
    return `/api/work-orders/${this.orderId}`;
  });

  readonly currentOrder = computed(() => {
    return this.resource.hasValue() ? this.resource.value() : this.orderData();
  });

  loadOrder(): void {
    this._refreshKey.update((k) => k + 1);
  }

  readonly unassigned = computed(() => {
    const notification = this.websocketService.lastNotification();
    return (
      notification?.type === ('work_order.technician_unassigned' as any) &&
      notification?.referenceId === this.orderId
    );
  });

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/15 text-yellow-400',
      assigned: 'bg-blue-500/15 text-blue-400',
      on_the_way: 'bg-cyan-500/15 text-cyan-400',
      in_progress: 'bg-purple-500/15 text-purple-400',
      completed: 'bg-green-500/15 text-green-400',
      delivered: 'bg-gray-500/15 text-gray-400',
      cancelled: 'bg-red-500/15 text-red-400',
    };
    return colors[status] || 'bg-gray-500/15 text-gray-400';
  }

  getActions(status: string): TechStatusAction[] {
    return ACTIONS_BY_STATUS[status] || [];
  }

  getCompletedTasks(order: WorkOrder): number {
    return order.tasks?.filter((t) => t.isCompleted).length || 0;
  }

  getTaskProgress(order: WorkOrder): number {
    if (!order.tasks || order.tasks.length === 0) return 0;
    return (this.getCompletedTasks(order) / order.tasks.length) * 100;
  }

  getNoteTypeClass(type: string): string {
    const classes: Record<string, string> = {
      diagnosis: 'bg-blue-500/15 text-blue-400',
      issue: 'bg-red-500/15 text-red-400',
      observation: 'bg-gray-500/15 text-gray-400',
      internal: 'bg-yellow-500/15 text-yellow-400',
    };
    return classes[type] || 'bg-gray-500/15 text-gray-400';
  }

  goBack(): void {
    this.router.navigate(['/tech']);
  }

  toggleTask(workOrderId: string, task: { id: string; isCompleted: boolean }): void {
    this.workOrdersService
      .updateTask(workOrderId, task.id, { isCompleted: !task.isCompleted })
      .subscribe({
        next: () => this.loadOrder(),
      });
  }

  changeStatus(order: WorkOrder, action: TechStatusAction): void {
    const key = action.nextStatus.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    const label = this.translationService.instant(`workOrders.statuses.${key}`);

    const dialogRef = this.dialog.open(StatusChangeDialogComponent, {
      width: '420px',
      data: {
        titleKey: 'workOrders.changeStatus',
        message: `¿Cambiar estado a "${label}"?`,
        confirmLabel: 'Confirmar',
        color: action.nextStatus === 'cancelled' ? 'warn' : 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((result: StatusChangeDialogResult | undefined) => {
      if (result?.confirmed) {
        const dto: UpdateWorkOrderDto = {
          status: action.nextStatus as WorkOrderStatus,
        };
        if (result.detail) dto.statusDetail = result.detail;

        this.workOrdersService.update(order.id, dto).subscribe({
          next: () => this.loadOrder(),
        });
      }
    });
  }

  addNote(workOrderId: string): void {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '500px',
      data: { workOrderId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadOrder();
    });
  }

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }
}
