import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import {
  WorkOrder,
  WorkOrderStatus,
  UpdateWorkOrderDto,
} from '../../core/models/work-order.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { StatusTransitionComponent } from './status-transition.component';
import { AddNoteDialogComponent } from './add-note-dialog.component';
import { AddMaterialDialogComponent } from './add-material-dialog.component';
import { AddTaskDialogComponent } from './add-task-dialog.component';
import { TechnicianAssignmentDialogComponent } from './technician-assignment-dialog.component';

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
    CurrencyArsPipe,
    DatePipe,
    TranslatePipe,
    StatusTransitionComponent,
  ],
  template: `
    @if (workOrderResource.status() === 'loading' && !workOrderResource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (workOrderResource.error()) {
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
                  <app-tracking-code [code]="workOrderResource.value().trackingCode" />
                </h1>
                <app-status-badge
                  [value]="workOrderResource.value().status"
                  type="workOrderStatus"
                />
                <app-status-badge
                  [value]="workOrderResource.value().priority"
                  type="workOrderPriority"
                />
              </div>
              <p class="text-gray-500 dark:text-gray-400 mt-1">
                {{ workOrderResource.value().serviceType.name }} -
                {{ workOrderResource.value().client.name }}
              </p>
            </div>
          </div>

          <app-status-transition
            [status]="workOrderResource.value().status"
            (transition)="onStatusTransition($event)"
            (openTechnicianAssignment)="openTechnicianDialog()"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <mat-tab-group>
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">info</mat-icon>
                  {{ 'workOrders.detail.generalInfo' | translate }}
                </ng-template>
                <div class="p-4 space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ 'workOrders.detail.client' | translate }}
                      </p>
                      <p class="font-medium">{{ workOrderResource.value().client.name }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ workOrderResource.value().client.email }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ workOrderResource.value().client.phone }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ 'workOrders.detail.location' | translate }}
                      </p>
                      <p class="font-medium">
                        {{
                          workOrderResource.value().location === 'workshop'
                            ? ('workOrders.locations.workshop' | translate)
                            : ('workOrders.locations.onSite' | translate)
                        }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ 'workOrders.detail.scheduledDate' | translate }}
                      </p>
                      <p class="font-medium">
                        {{
                          workOrderResource.value().scheduledDate
                            ? (workOrderResource.value().scheduledDate | date: 'dd/MM/yyyy')
                            : '-'
                        }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ 'workOrders.detail.warrantyUntil' | translate }}
                      </p>
                      <p class="font-medium">
                        {{
                          workOrderResource.value().warrantyUntil
                            ? (workOrderResource.value().warrantyUntil | date: 'dd/MM/yyyy')
                            : '-'
                        }}
                      </p>
                    </div>
                  </div>
                  @if (workOrderResource.value().diagnosis) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ 'workOrders.detail.diagnosis' | translate }}
                      </p>
                      <p class="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {{ workOrderResource.value().diagnosis }}
                      </p>
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">checklist</mat-icon>
                  {{ 'workOrders.detail.tasks' | translate }} ({{ getCompletedTasks() }}/{{
                    workOrderResource.value().tasks?.length || 0
                  }})
                </ng-template>
                <div class="p-4">
                  <div class="flex justify-end mb-4">
                    <button mat-stroked-button color="primary" (click)="openAddTaskDialog()">
                      <mat-icon>add</mat-icon>
                      {{ 'workOrders.tasks.addTask' | translate }}
                    </button>
                  </div>
                  @if (!workOrderResource.value().tasks || workOrderResource.value().tasks.length === 0) {
                    <p class="text-gray-500 dark:text-gray-400 text-center py-8">
                      {{ 'workOrders.tasks.noTasks' | translate }}
                    </p>
                  } @else {
                    <div class="space-y-3">
                      @for (task of workOrderResource.value().tasks; track task.id) {
                        <div
                          class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <button mat-icon-button (click)="toggleTask(task.id, !task.isCompleted)">
                            <mat-icon>
                              {{ task.isCompleted ? 'check_circle' : 'radio_button_unchecked' }}
                            </mat-icon>
                          </button>
                          <div class="flex-1">
                            <p
                              [class.line-through]="task.isCompleted"
                              [class.text-gray-400]="task.isCompleted"
                            >
                              {{ task.title }}
                            </p>
                            @if (task.description) {
                              <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ task.description }}
                              </p>
                            }
                          </div>
                          @if (task.assignedTo) {
                            <span class="text-xs text-gray-400 dark:text-gray-500">{{
                              task.assignedTo.name
                            }}</span>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">build</mat-icon>
                  {{ 'workOrders.detail.materials' | translate }}
                </ng-template>
                <div class="p-4">
                  <div class="flex justify-end mb-4">
                    <button mat-stroked-button color="primary" (click)="openAddMaterialDialog()">
                      <mat-icon>add</mat-icon>
                      {{ 'workOrders.materials.addMaterial' | translate }}
                    </button>
                  </div>
                  @if (!workOrderResource.value().materials || workOrderResource.value().materials.length === 0) {
                    <p class="text-gray-500 dark:text-gray-400 text-center py-8">
                      {{ 'workOrders.materials.noMaterials' | translate }}
                    </p>
                  } @else {
                    <div class="overflow-x-auto">
                      <table class="w-full text-sm">
                        <thead>
                          <tr class="border-b border-gray-200 dark:border-gray-700">
                            <th
                              class="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400"
                            >
                              {{ 'workOrders.materials.description' | translate }}
                            </th>
                            <th
                              class="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400"
                            >
                              {{ 'workOrders.materials.supplier' | translate }}
                            </th>
                            <th
                              class="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400"
                            >
                              {{ 'workOrders.materials.qty' | translate }}
                            </th>
                            <th
                              class="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400"
                            >
                              {{ 'workOrders.materials.unitCost' | translate }}
                            </th>
                            <th
                              class="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400"
                            >
                              {{ 'workOrders.materials.total' | translate }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (
                            material of workOrderResource.value().materials;
                            track material.id
                          ) {
                            <tr class="border-b border-gray-200 dark:border-gray-700">
                              <td class="py-2 px-3">{{ material.description }}</td>
                              <td class="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                                {{ material.supplier?.name || '-' }}
                              </td>
                              <td class="py-2 px-3 text-right">{{ material.quantity }}</td>
                              <td class="py-2 px-3 text-right">
                                {{ material.unitCost | currencyArs }}
                              </td>
                              <td class="py-2 px-3 text-right font-medium">
                                {{ material.totalCost | currencyArs }}
                              </td>
                            </tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="font-medium">
                            <td colspan="4" class="py-2 px-3 text-right">
                              {{ 'workOrders.materials.totalMaterials' | translate }}:
                            </td>
                            <td class="py-2 px-3 text-right">
                              {{ getMaterialsTotal() | currencyArs }}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">notes</mat-icon>
                  {{ 'workOrders.detail.notes' | translate }}
                </ng-template>
                <div class="p-4">
                  <div class="flex justify-end mb-4">
                    <button mat-stroked-button color="primary" (click)="openAddNoteDialog()">
                      <mat-icon>add</mat-icon>
                      {{ 'workOrders.notes.addNote' | translate }}
                    </button>
                  </div>
                  @if (!workOrderResource.value().notes || workOrderResource.value().notes.length === 0) {
                    <p class="text-gray-500 dark:text-gray-400 text-center py-8">
                      {{ 'workOrders.notes.noNotes' | translate }}
                    </p>
                  } @else {
                    <div class="space-y-3">
                      @for (note of workOrderResource.value().notes; track note.id) {
                        <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div class="flex items-center gap-2 mb-1">
                            <app-status-badge [value]="note.type" type="noteType" />
                            <span class="text-xs text-gray-400 dark:text-gray-500">
                              {{ note.createdBy.name }} -
                              {{ note.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                            </span>
                          </div>
                          <p class="text-sm">{{ note.content }}</p>
                        </div>
                      }
                    </div>
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>

          <div class="space-y-4">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-medium text-gray-900 dark:text-gray-100">
                  {{ 'workOrders.detail.assignedTechnicians' | translate }}
                </h3>
                <button mat-button color="primary" (click)="openTechnicianDialog()">
                  <mat-icon>edit</mat-icon>
                  {{ 'common.edit' | translate }}
                </button>
              </div>
              @if (workOrderResource.value().technicians.length === 0) {
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ 'workOrders.technicians.noTechnicians' | translate }}
                </p>
              } @else {
                <div class="space-y-2">
                  @for (tech of workOrderResource.value().technicians; track tech.id) {
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                      >
                        <span class="text-blue-600 dark:text-blue-400 text-sm font-medium">{{
                          tech.name.charAt(0)
                        }}</span>
                      </div>
                      <span class="text-sm">{{ tech.name }}</span>
                    </div>
                  }
                </div>
              }
            </div>

            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">
                {{ 'workOrders.detail.summary' | translate }}
              </h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">{{
                    'workOrders.detail.completedTasks' | translate
                  }}</span>
                  <span class="font-medium"
                    >{{ getCompletedTasks() }}/{{ workOrderResource.value().tasks?.length || 0 }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">{{
                    'workOrders.detail.materialsCost' | translate
                  }}</span>
                  <span class="font-medium">{{ getMaterialsTotal() | currencyArs }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">{{
                    'workOrders.detail.created' | translate
                  }}</span>
                  <span>{{ workOrderResource.value().createdAt | date: 'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
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

  readonly workOrderResource = httpResource<WorkOrder>(
    () => ({
      url: `/api/work-orders/${this.orderId()}`,
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<WorkOrder>).data,
    },
  );

  getCompletedTasks(): number {
    return this.workOrderResource.value()?.tasks.filter((t) => t.isCompleted).length || 0;
  }

  getMaterialsTotal(): number {
    return this.workOrderResource.value()?.materials.reduce((sum, m) => sum + m.totalCost, 0) || 0;
  }

  goBack(): void {
    this.router.navigate(['/admin/work-orders']);
  }

  toggleTask(taskId: string, isCompleted: boolean): void {
    const id = this.workOrderResource.value()?.id;
    if (id) {
      this.workOrdersService.updateTask(id, taskId, { isCompleted }).subscribe({
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

    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
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
