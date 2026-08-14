import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  CdkDragDrop,
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CdkDragStart,
  CdkDragPreview,
  CdkDragPlaceholder,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrder, WorkOrderStatus } from '../../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../../core/models/client.interfaces';
import { WorkOrdersService } from '../../../core/services/work-orders.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { getAllowedTargetStatuses } from '../../../core/utils/work-order-transitions.util';
import { KanbanCardComponent } from './kanban-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';

interface KanbanColumn {
  status: WorkOrderStatus;
  orders: WorkOrder[];
}

const KANBAN_STATUSES: WorkOrderStatus[] = [
  'pending',
  'assigned',
  'on_the_way',
  'in_progress',
  'postponed',
  'completed',
  'delivered',
  'cancelled',
];

@Component({
  selector: 'app-kanban-board',
  imports: [
    CdkScrollable,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPreview,
    CdkDragPlaceholder,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    KanbanCardComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    TranslatePipe,
    StatusLabelPipe,
  ],
  styles: [
    `
      .cdk-drag-kanban-card {
        transition:
          transform 150ms cubic-bezier(0, 0, 0.2, 1),
          opacity 150ms ease;
      }

      .cdk-drop-list-dragging .cdk-drag-kanban-card:not(.cdk-drag-placeholder) {
        transition: transform 150ms cubic-bezier(0, 0, 0.2, 1);
      }

      .kanban-drag-preview {
        border-radius: 12px;
        box-shadow:
          0 12px 28px rgba(0, 0, 0, 0.18),
          0 4px 10px rgba(0, 0, 0, 0.1);
        transform: rotate(2deg);
        cursor: grabbing;
        z-index: 1000;
      }

      .kanban-drag-placeholder {
        border-radius: 12px;
        border: 2px dashed rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.08);
        min-height: 96px;
        transition: transform 150ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'workOrders.kanban.title' | translate"
        [subtitle]="'workOrders.kanban.subtitle' | translate"
        [actionLabel]="'workOrders.viewToggle.viewTable' | translate"
        actionIcon="table_chart"
        [action]="goToList.bind(this)"
      />

      @if (boardResource.status() === 'loading' && !boardResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (boardResource.error()) {
        <app-error-state (retry)="boardResource.reload()" />
      } @else if (boardResource.hasValue() && totalCount() === 0) {
        <app-empty-state
          [title]="'workOrders.noOrders' | translate"
          [message]="'workOrders.noOrdersMessage' | translate"
        />
      } @else if (boardResource.hasValue()) {
        <div cdkScrollable cdkDropListGroup class="flex gap-4 overflow-x-auto pb-4 min-h-[60vh]">
          @for (column of columns(); track column.status) {
            <div
              class="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[80vh]"
            >
              <div
                class="px-3 py-2.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="w-2.5 h-2.5 rounded-full shrink-0"
                    [class]="statusDotClass(column.status)"
                  ></span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {{ column.status | statusLabel: 'workOrderStatus' }}
                  </span>
                </div>
                <span
                  class="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                >
                  {{ column.orders.length }}
                </span>
              </div>

              <div
                [id]="columnId(column.status)"
                cdkDropList
                [cdkDropListData]="column.orders"
                [cdkDropListEnterPredicate]="enterPredicate"
                (cdkDropListDropped)="onDrop($event)"
                class="flex-1 overflow-y-auto p-2 space-y-2 min-h-16 transition-colors rounded-b-xl"
                [class.bg-blue-50/50]="isDropAllowedFor(column.status)"
              >
                @for (order of column.orders; track order.id) {
                  <div
                    cdkDrag
                    [cdkDragData]="order"
                    (cdkDragStarted)="onDragStarted($event)"
                    (cdkDragEnded)="onDragEnded()"
                    class="cdk-drag-kanban-card"
                  >
                    <app-kanban-card [order]="order" (cardClick)="viewDetail($event)" />
                    <div *cdkDragPreview class="kanban-drag-preview w-72">
                      <app-kanban-card [order]="order" />
                    </div>
                    <div *cdkDragPlaceholder class="kanban-drag-placeholder"></div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class KanbanBoardComponent {
  private readonly router = inject(Router);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly websocketService = inject(WebsocketService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly draggedOrder = signal<WorkOrder | null>(null);

  readonly boardResource = httpResource<PaginatedResponse<WorkOrder>>(() => {
    this.websocketService.workOrderRefreshKey();
    return {
      url: '/api/work-orders',
      params: {
        page: 1,
        limit: 200,
        sortBy: 'updatedAt',
        order: 'DESC',
      },
    };
  });

  readonly totalCount = computed(() => this.boardResource.value()?.total ?? 0);

  readonly columns = computed<KanbanColumn[]>(() => {
    const orders = this.boardResource.value()?.data ?? [];
    return KANBAN_STATUSES.map((status) => ({
      status,
      orders: orders.filter((order) => order.status === status),
    }));
  });

  private requiresDelivery(order: WorkOrder): boolean {
    return order.serviceType?.requiresDelivery ?? false;
  }

  columnId(status: WorkOrderStatus): string {
    return `kanban-${status}`;
  }

  private isAllowed(order: WorkOrder, status: WorkOrderStatus): boolean {
    if (order.status === status) return true;
    return getAllowedTargetStatuses(order.status, this.requiresDelivery(order)).includes(status);
  }

  isDropAllowedFor(status: WorkOrderStatus): boolean {
    const order = this.draggedOrder();
    return order ? this.isAllowed(order, status) : false;
  }

  readonly enterPredicate = (drag: CdkDrag<WorkOrder>, drop: CdkDropList<WorkOrder[]>): boolean => {
    const order = drag.data;
    const id = drop.id;
    const status = this.statusFromId(id);
    if (!order || !status) return false;
    return this.isAllowed(order, status);
  };

  onDragStarted(_event: CdkDragStart): void {
    const drag = _event.source;
    this.draggedOrder.set(drag.data ?? null);
  }

  onDragEnded(): void {
    this.draggedOrder.set(null);
  }

  statusDotClass(status: WorkOrderStatus): string {
    switch (status) {
      case 'pending':
        return 'bg-gray-400';
      case 'assigned':
        return 'bg-blue-400';
      case 'on_the_way':
        return 'bg-cyan-400';
      case 'in_progress':
        return 'bg-amber-400';
      case 'postponed':
        return 'bg-orange-400';
      case 'completed':
        return 'bg-emerald-400';
      case 'delivered':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  }

  onDrop(event: CdkDragDrop<WorkOrder[]>): void {
    const order = event.item.data as WorkOrder;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const targetStatus = this.statusFromId(event.container.id);
    if (!targetStatus || !this.isAllowed(order, targetStatus)) {
      return;
    }

    this.workOrdersService.update(order.id, { status: targetStatus }).subscribe({
      next: () => {
        this.toastService.show(
          this.translationService.instant('workOrders.kanban.toast.statusChanged'),
          'success',
        );
        this.boardResource.reload();
      },
      error: () => {
        this.toastService.show(
          this.translationService.instant('workOrders.kanban.toast.error'),
          'error',
        );
        this.boardResource.reload();
      },
    });
  }

  private statusFromId(id: string): WorkOrderStatus | null {
    if (!id.startsWith('kanban-')) return null;
    const status = id.slice('kanban-'.length) as WorkOrderStatus;
    return (KANBAN_STATUSES as string[]).includes(status) ? status : null;
  }

  viewDetail(id: string): void {
    this.router.navigate(['/admin/work-orders', id]);
  }

  goToList(): void {
    this.router.navigate(['/admin/work-orders']);
  }
}
