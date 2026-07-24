import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import {
  WorkOrder,
  WorkOrderStatus,
  UpdateWorkOrderDto,
} from '../../core/models/work-order.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
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
    MatProgressSpinnerModule,
    StatusBadgeComponent,
    ErrorStateComponent,
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
    @if (workOrderResource.error()) {
      <app-error-state
        [title]="'workOrders.detail.loadError' | translate"
        [message]="'workOrders.detail.loadErrorMessage' | translate"
        (retry)="workOrderResource.reload()"
      />
    } @else if (workOrderResource.hasValue()) {
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button mat-icon-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <app-tracking-code [code]="workOrderResource.value()!.trackingCode" />
                </h1>
                <app-status-badge
                  [value]="workOrderResource.value()!.status"
                  type="workOrderStatus"
                />
                <app-status-badge
                  [value]="workOrderResource.value()!.priority"
                  type="workOrderPriority"
                />
              </div>
              <p class="text-gray-500 dark:text-gray-400 mt-1">
                {{ workOrderResource.value()!.serviceType.name }} -
                {{ workOrderResource.value()!.client.name }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <app-export-buttons [workOrderId]="workOrderResource.value()!.id" />
            <app-status-transition
              [status]="workOrderResource.value()!.status"
              [requiresDelivery]="workOrderResource.value()!.serviceType?.requiresDelivery ?? false"
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
                  [workOrder]="workOrderResource.value()!"
                  [editable]="true"
                  [saving]="savingInfo()"
                  (saved)="onInfoSaved($event)"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">checklist</mat-icon>
                  {{ 'workOrders.detail.tasks' | translate }} ({{ getCompletedTasks() }}/{{
                    workOrderResource.value()!.tasks?.length || 0
                  }})
                </ng-template>
                <app-tasks-tab
                  [tasks]="workOrderResource.value()!.tasks || []"
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
                  [materials]="workOrderResource.value()!.materials || []"
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
                  [notes]="workOrderResource.value()!.notes || []"
                  [workOrderId]="workOrderResource.value()!.id"
                  (addNote)="openAddNoteDialog()"
                  (noteChanged)="workOrderResource.reload()"
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
            [technicians]="workOrderResource.value()!.technicians"
            [completedTasks]="getCompletedTasks()"
            [totalTasks]="workOrderResource.value()!.tasks?.length || 0"
            [materialsTotal]="getMaterialsTotal()"
            [createdAt]="workOrderResource.value()!.createdAt"
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

  readonly orderId = signal(this.route.snapshot.paramMap.get('id') || '');

  readonly workOrderResource = httpResource<WorkOrder>(() => ({
    url: `/api/work-orders/${this.orderId()}`,
  }));

  readonly selectedTabIndex = signal(0);
  readonly savingInfo = signal(false);

  onInfoSaved(dto: UpdateWorkOrderDto): void {
    const id = this.workOrderResource.value()?.id;
    if (!id) return;

    this.savingInfo.set(true);
    this.workOrdersService.update(id, dto).subscribe({
      next: () => {
        this.savingInfo.set(false);
        this.workOrderResource.reload();
      },
      error: () => this.savingInfo.set(false),
    });
  }

  getCompletedTasks(): number {
    return this.workOrderResource.value()?.tasks?.filter((t) => t.isCompleted).length || 0;
  }

  getMaterialsTotal(): number {
    return this.workOrderResource.value()?.materials?.reduce((sum, m) => sum + m.totalCost, 0) || 0;
  }

  goBack(): void {
    this.router.navigate(['/admin/work-orders']);
  }

  onToggleTask(event: { taskId: string; isCompleted: boolean }): void {
    const id = this.workOrderResource.value()?.id;
    if (id) {
      this.workOrdersService.updateTask(id, event.taskId, { isCompleted: event.isCompleted }).subscribe({
        next: () => this.workOrderResource.reload(),
      });
    }
  }

  onStatusTransition(event: {
    status: WorkOrderStatus;
    startedAt?: string;
    completedAt?: string;
  }): void {
    const id = this.workOrderResource.value()?.id;
    if (!id) return;

    const dto: UpdateWorkOrderDto = { status: event.status };
    if (event.startedAt) dto.startedAt = event.startedAt;
    if (event.completedAt) dto.completedAt = event.completedAt;

    this.workOrdersService.update(id, dto).subscribe({
      next: () => this.workOrderResource.reload(),
    });
  }

  openTechnicianDialog(): void {
    const workOrder = this.workOrderResource.value();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(TechnicianAssignmentDialogComponent, {
      width: '500px',
      data: {
        workOrderId: workOrder.id,
        currentTechnicianIds: workOrder.technicians.map((t) => t.id),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.workOrderResource.reload();
    });
  }

  openAddNoteDialog(): void {
    const workOrder = this.workOrderResource.value();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '500px',
      data: { workOrderId: workOrder.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.workOrderResource.reload();
    });
  }

  openAddMaterialDialog(): void {
    const workOrder = this.workOrderResource.value();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
      width: '500px',
      data: { workOrderId: workOrder.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.workOrderResource.reload();
    });
  }

  openAddTaskDialog(): void {
    const workOrder = this.workOrderResource.value();
    if (!workOrder) return;

    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: { workOrderId: workOrder.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.workOrderResource.reload();
    });
  }
}
