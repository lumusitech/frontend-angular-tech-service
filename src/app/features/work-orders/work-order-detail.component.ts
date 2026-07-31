import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  WorkOrder,
  WorkOrderStatus,
  UpdateWorkOrderDto,
} from '../../core/models/work-order.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { StatusTransitionComponent } from './status-transition.component';
import { TimelineTabComponent } from '../../shared/components/timeline-tab/timeline-tab.component';
import { NoteDialogComponent } from './add-note-dialog.component';
import { AddMaterialDialogComponent } from './add-material-dialog.component';
import { AddTaskDialogComponent } from './add-task-dialog.component';
import { TechnicianAssignmentDialogComponent } from './technician-assignment-dialog.component';
import { InfoTabComponent } from './tabs/info-tab.component';
import { TasksTabComponent } from './tabs/tasks-tab.component';
import { MaterialsTabComponent } from './tabs/materials-tab.component';
import { NotesTabComponent } from './tabs/notes-tab.component';
import { WorkOrderSidebarComponent } from './tabs/work-order-sidebar.component';
import { ExportButtonsComponent } from '../../shared/components/export-buttons/export-buttons.component';

@Component({
  selector: 'app-work-order-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    StatusBadgeComponent,
    TrackingCodeComponent,
    TranslatePipe,
    StatusTransitionComponent,
    TimelineTabComponent,
    InfoTabComponent,
    TasksTabComponent,
    MaterialsTabComponent,
    NotesTabComponent,
    WorkOrderSidebarComponent,
    ExportButtonsComponent,
  ],
  template: `
    @if (orderData() !== null) {
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button mat-icon-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <app-tracking-code [code]="orderData()!.trackingCode" />
                </h1>
                <app-status-badge [value]="orderData()!.status" type="workOrderStatus" />
                <app-status-badge [value]="orderData()!.priority" type="workOrderPriority" />
              </div>
              <p class="text-gray-500 dark:text-gray-400 mt-1">
                {{ orderData()!.serviceType.name }} -
                {{ orderData()!.client.name }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <app-export-buttons [workOrderId]="orderData()!.id" />
            <app-status-transition
              [status]="orderData()!.status"
              [requiresDelivery]="orderData()!.serviceType?.requiresDelivery ?? false"
              (transition)="onStatusTransition($event)"
              (openTechnicianAssignment)="openTechnicianDialog()"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <mat-tab-group [(selectedIndex)]="selectedTabIndex">
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">info</mat-icon>
                  {{ 'workOrders.detail.generalInfo' | translate }}
                </ng-template>
                <app-info-tab
                  [workOrder]="orderData()!"
                  [editable]="true"
                  [saving]="savingInfo()"
                  (saved)="onInfoSaved($event)"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">checklist</mat-icon>
                  {{ 'workOrders.detail.tasks' | translate }} ({{ getCompletedTasks() }}/{{
                    orderData()!.tasks?.length || 0
                  }})
                </ng-template>
                <app-tasks-tab
                  [tasks]="orderData()!.tasks || []"
                  [completedCount]="getCompletedTasks()"
                  (addTask)="openAddTaskDialog()"
                  (toggleTask)="onToggleTask($event)"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">build</mat-icon>
                  {{ 'workOrders.detail.materials' | translate }}
                </ng-template>
                <app-materials-tab
                  [materials]="orderData()!.materials || []"
                  [total]="getMaterialsTotal()"
                  (addMaterial)="openAddMaterialDialog()"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">notes</mat-icon>
                  {{ 'workOrders.detail.notes' | translate }}
                </ng-template>
                <app-notes-tab
                  [notes]="orderData()!.notes || []"
                  [workOrderId]="orderData()!.id"
                  (addNote)="openAddNoteDialog()"
                  (noteChanged)="loadOrder()"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">timeline</mat-icon>
                  {{ 'workOrders.detail.statusTimeline' | translate }}
                </ng-template>
                <app-timeline-tab [orderId]="orderId()" />
              </mat-tab>
            </mat-tab-group>
          </div>

          <app-work-order-sidebar
            [technicians]="orderData()!.technicians"
            [completedTasks]="getCompletedTasks()"
            [totalTasks]="orderData()!.tasks?.length || 0"
            [materialsTotal]="getMaterialsTotal()"
            [createdAt]="orderData()!.createdAt"
            (editTechnicians)="openTechnicianDialog()"
          />
        </div>
      </div>
    }
  `,
})
export class WorkOrderDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  readonly orderId = signal(this.route.snapshot.paramMap.get('id') || '');
  readonly orderData = signal<WorkOrder>(this.route.snapshot.data['workOrder']);
  readonly selectedTabIndex = signal(0);
  readonly savingInfo = signal(false);

  onInfoSaved(dto: UpdateWorkOrderDto): void {
    const id = this.orderData()?.id;
    if (!id) return;

    this.savingInfo.set(true);
    this.workOrdersService.update(id, dto).subscribe({
      next: () => {
        this.savingInfo.set(false);
        this.toastService.show(this.translationService.instant('common.toast.updated'), 'success');
        this.loadOrder();
      },
      error: (err) => {
        this.savingInfo.set(false);
        const msg =
          err.error?.message || this.translationService.instant('common.toast.errorUpdated');
        this.toastService.show(msg, 'error');
      },
    });
  }

  loadOrder(): void {
    const id = this.orderId();
    if (!id) return;
    this.workOrdersService.getById(id).subscribe({
      next: (data) => this.orderData.set(data),
    });
  }

  getCompletedTasks(): number {
    return this.orderData()?.tasks?.filter((t) => t.isCompleted).length || 0;
  }

  getMaterialsTotal(): number {
    return this.orderData()?.materials?.reduce((sum, m) => sum + m.totalCost, 0) || 0;
  }

  goBack(): void {
    this.router.navigate(['/admin/work-orders']);
  }

  onToggleTask(event: { taskId: string; isCompleted: boolean }): void {
    const id = this.orderData()?.id;
    if (id) {
      this.workOrdersService
        .updateTask(id, event.taskId, { isCompleted: event.isCompleted })
        .subscribe({
          next: () => this.loadOrder(),
        });
    }
  }

  onStatusTransition(event: {
    status: WorkOrderStatus;
    startedAt?: string;
    completedAt?: string;
  }): void {
    const id = this.orderData()?.id;
    if (!id) return;

    const dto: UpdateWorkOrderDto = { status: event.status };
    if (event.startedAt) dto.startedAt = event.startedAt;
    if (event.completedAt) dto.completedAt = event.completedAt;

    this.workOrdersService.update(id, dto).subscribe({
      next: () => this.loadOrder(),
    });
  }

  openTechnicianDialog(): void {
    const workOrder = this.orderData();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(TechnicianAssignmentDialogComponent, {
      width: '500px',
      data: {
        workOrderId: workOrder.id,
        currentTechnicianIds: workOrder.technicians.map((t) => t.id),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadOrder();
    });
  }

  openAddNoteDialog(): void {
    const workOrder = this.orderData();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '500px',
      data: { workOrderId: workOrder.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadOrder();
    });
  }

  openAddMaterialDialog(): void {
    const workOrder = this.orderData();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
      width: '500px',
      data: { workOrderId: workOrder.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadOrder();
    });
  }

  openAddTaskDialog(): void {
    const workOrder = this.orderData();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: { workOrderId: workOrder.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadOrder();
    });
  }
}
