import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import {
  WorkOrder,
  WorkOrderStatus,
} from '../../core/models/work-order.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { UrgencyIndicatorComponent } from '../../shared/components/urgency-indicator/urgency-indicator.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AddNoteDialogComponent } from '../work-orders/add-note-dialog.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';

const VALID_TRANSITIONS: Record<string, string[]> = {
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
};

@Component({
  selector: 'app-tech-work-order-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PageHeaderComponent,
    ErrorStateComponent,
    UrgencyIndicatorComponent,
    DatePipe,
    DecimalPipe,
    TranslatePipe,
    StatusLabelPipe,
  ],
  template: `
    @if (resource.status() === 'loading' && !resource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    } @else if (resource.error()) {
      <app-error-state (retry)="resource.reload()" />
    } @else if (resource.hasValue()) {
      @let order = resource.value();

      <div class="space-y-4">
        <app-page-header
          [title]="order.trackingCode"
          [subtitle]="order.client?.name || ''"
        >
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
        @if (getValidTransitions(order.status).length > 0) {
          <div class="flex gap-2 flex-wrap">
            @for (transition of getValidTransitions(order.status); track transition) {
              <button
                mat-flat-button
                [color]="transition === 'cancelled' ? 'warn' : 'primary'"
                (click)="changeStatus(order, transition)"
              >
                {{ 'workOrders.changeStatus' | translate }} → {{ transition | statusLabel: 'workOrderStatus' }}
              </button>
            }
          </div>
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
                      [class]="task.isCompleted ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'"
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
                <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ material.description }}</p>
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
                      {{ note.createdAt | date: 'dd/MM HH:mm' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ note.content }}</p>
                </div>
              }
            </div>
          } @else {
            <p class="text-sm text-gray-400 dark:text-gray-500">{{ 'common.noResults' | translate }}</p>
          }
        </mat-card>

        <!-- Info -->
        <mat-card class="p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {{ 'common.details' | translate }}
          </h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{ 'workOrders.scheduledDate' | translate }}</span>
              <p class="text-gray-900 dark:text-gray-100">{{ order.scheduledDate ? (order.scheduledDate | date: 'dd/MM/yyyy') : '-' }}</p>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{ 'workOrders.diagnosis' | translate }}</span>
              <p class="text-gray-900 dark:text-gray-100">{{ order.diagnosis || '-' }}</p>
            </div>
          </div>
        </mat-card>
      </div>
    }
  `,
})
export class TechWorkOrderDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly dialog = inject(MatDialog);

  readonly resource = httpResource<WorkOrder>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? `/api/work-orders/${id}` : '';
  });

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/15 text-yellow-400',
      assigned: 'bg-blue-500/15 text-blue-400',
      in_progress: 'bg-purple-500/15 text-purple-400',
      completed: 'bg-green-500/15 text-green-400',
      delivered: 'bg-gray-500/15 text-gray-400',
      cancelled: 'bg-red-500/15 text-red-400',
    };
    return colors[status] || 'bg-gray-500/15 text-gray-400';
  }

  getValidTransitions(status: string): string[] {
    return VALID_TRANSITIONS[status] || [];
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
        next: () => this.resource.reload(),
      });
  }

  changeStatus(order: WorkOrder, newStatus: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'workOrders.changeStatus',
        message: `¿Cambiar estado a "${newStatus}"?`,
        confirmLabel: 'Confirmar',
        color: newStatus === 'cancelled' ? 'warn' : 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.workOrdersService
          .update(order.id, { status: newStatus as WorkOrderStatus })
          .subscribe({
            next: () => this.resource.reload(),
          });
      }
    });
  }

  addNote(workOrderId: string): void {
    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      width: '500px',
      data: { workOrderId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }
}
