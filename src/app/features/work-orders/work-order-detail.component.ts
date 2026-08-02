import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { WebsocketService } from '../../core/services/websocket.service';
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
      <div class="space-y-6 pb-48 lg:pb-0">
        <!-- Hero Header Card -->
        <div class="p-4 sm:p-6 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700/70 shadow-xs backdrop-blur-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3 min-w-0">
              <button mat-icon-button (click)="goBack()" class="shrink-0 -ml-1">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    <app-tracking-code [code]="orderData()!.trackingCode" />
                  </h1>
                  <app-status-badge [value]="orderData()!.status" type="workOrderStatus" />
                  <app-status-badge [value]="orderData()!.priority" type="workOrderPriority" />
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ orderData()!.serviceType.name }}</span>
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ orderData()!.client.name }}
                </p>
              </div>
              <!-- Export icon button (all viewports) -->
              <app-export-buttons [workOrderId]="orderData()!.id" [iconOnly]="true" class="shrink-0" />
            </div>

            <!-- Desktop Action Bar -->
            <div class="hidden lg:flex flex-wrap items-center gap-2">
              <app-status-transition
                [status]="orderData()!.status"
                [requiresDelivery]="orderData()!.serviceType?.requiresDelivery ?? false"
                (transition)="onStatusTransition($event)"
              />
            </div>
          </div>
        </div>

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            class="lg:col-span-2 space-y-6 min-w-0 touch-manipulation"
            (touchstart)="onTouchStart($event)"
            (touchend)="onTouchEnd($event)"
            (touchcancel)="onTouchEnd($event)"
          >
            <mat-tab-group [(selectedIndex)]="selectedTabIndex" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/70 shadow-xs overflow-hidden">
              <mat-tab>
                <ng-template mat-tab-label>
                  <div
                    class="flex items-center gap-1.5 transition-all duration-200"
                    [class]="
                      selectedTabIndex() === 0
                        ? 'text-blue-600 dark:text-blue-400 font-bold opacity-100 scale-[1.02]'
                        : 'text-gray-400 dark:text-gray-500 font-medium opacity-50 hover:opacity-85'
                    "
                  >
                    <mat-icon class="text-base">info</mat-icon>
                    <span class="text-xs sm:text-sm">{{ 'workOrders.detail.generalInfo' | translate }}</span>
                  </div>
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
                  <div
                    class="flex items-center gap-1.5 transition-all duration-200"
                    [class]="
                      selectedTabIndex() === 1
                        ? 'text-blue-600 dark:text-blue-400 font-bold opacity-100 scale-[1.02]'
                        : 'text-gray-400 dark:text-gray-500 font-medium opacity-50 hover:opacity-85'
                    "
                  >
                    <mat-icon class="text-base">checklist</mat-icon>
                    <span class="text-xs sm:text-sm"
                      >{{ 'workOrders.detail.tasks' | translate }} ({{ getCompletedTasks() }}/{{
                        orderData()!.tasks?.length || 0
                      }})</span
                    >
                  </div>
                </ng-template>
                <app-tasks-tab
                  [tasks]="orderData()!.tasks || []"
                  [completedCount]="getCompletedTasks()"
                  [workOrderId]="orderData()!.id"
                  [orderTechnicians]="orderData()!.technicians || []"
                  (addTask)="openAddTaskDialog()"
                  (toggleTask)="onToggleTask($event)"
                  (taskChanged)="loadOrder()"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <div
                    class="flex items-center gap-1.5 transition-all duration-200"
                    [class]="
                      selectedTabIndex() === 2
                        ? 'text-blue-600 dark:text-blue-400 font-bold opacity-100 scale-[1.02]'
                        : 'text-gray-400 dark:text-gray-500 font-medium opacity-50 hover:opacity-85'
                    "
                  >
                    <mat-icon class="text-base">build</mat-icon>
                    <span class="text-xs sm:text-sm">{{ 'workOrders.detail.materials' | translate }}</span>
                  </div>
                </ng-template>
                <app-materials-tab
                  [materials]="orderData()!.materials || []"
                  [total]="getMaterialsTotal()"
                  (addMaterial)="openAddMaterialDialog()"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <div
                    class="flex items-center gap-1.5 transition-all duration-200"
                    [class]="
                      selectedTabIndex() === 3
                        ? 'text-blue-600 dark:text-blue-400 font-bold opacity-100 scale-[1.02]'
                        : 'text-gray-400 dark:text-gray-500 font-medium opacity-50 hover:opacity-85'
                    "
                  >
                    <mat-icon class="text-base">notes</mat-icon>
                    <span class="text-xs sm:text-sm">{{ 'workOrders.detail.notes' | translate }}</span>
                  </div>
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
                  <div
                    class="flex items-center gap-1.5 transition-all duration-200"
                    [class]="
                      selectedTabIndex() === 4
                        ? 'text-blue-600 dark:text-blue-400 font-bold opacity-100 scale-[1.02]'
                        : 'text-gray-400 dark:text-gray-500 font-medium opacity-50 hover:opacity-85'
                    "
                  >
                    <mat-icon class="text-base">timeline</mat-icon>
                    <span class="text-xs sm:text-sm">{{ 'workOrders.detail.statusTimeline' | translate }}</span>
                  </div>
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

        <!-- Mobile Floating Bottom Action Dock (Floating Island at bottom-20 above AdminBottomNavComponent) -->
        <div class="fixed bottom-20 left-3 right-3 z-30 p-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/70 shadow-2xl lg:hidden">
          <div
            #dockScroll
            class="flex items-center gap-2.5 overflow-x-scroll no-scrollbar"
            (touchstart)="onDockTouchStart($event)"
            (touchmove)="onDockTouchMove($event, dockScroll)"
            (touchend)="onDockTouchEnd()"
          >
            <app-status-transition
              [status]="orderData()!.status"
              [requiresDelivery]="orderData()!.serviceType?.requiresDelivery ?? false"
              (transition)="onStatusTransition($event)"
              class="shrink-0 contents"
            />
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
  private readonly websocketService = inject(WebsocketService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  readonly orderId = signal(this.route.snapshot.paramMap.get('id') || '');
  readonly orderData = signal<WorkOrder>(this.route.snapshot.data['workOrder']);
  readonly selectedTabIndex = signal(0);
  readonly savingInfo = signal(false);

  constructor() {
    effect(() => {
      const refreshKey = this.websocketService.workOrderRefreshKey();
      if (refreshKey > 0) {
        this.loadOrder();
      }
    });
  }

  // --- Tab swipe gesture state ---
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;

  // --- Dock horizontal drag-scroll state ---
  private dockTouchStartX = 0;
  private dockInitialScrollLeft = 0;
  private isDockDragging = false;

  onTouchStart(event: TouchEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, textarea, select, mat-select, [contenteditable="true"], [role="button"], [role="menuitem"], app-export-buttons, app-status-transition')) {
      this.touchStartTime = 0;
      return;
    }
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.touchStartTime = Date.now();
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.touchStartTime) return;
    const duration = Date.now() - this.touchStartTime;
    this.touchStartTime = 0;

    if (duration > 800 || event.changedTouches.length === 0) return;

    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const deltaY = event.changedTouches[0].clientY - this.touchStartY;

    if (Math.abs(deltaX) >= 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      const direction = deltaX < 0 ? 1 : -1;
      const totalTabs = 5;
      const nextIndex = (this.selectedTabIndex() + direction + totalTabs) % totalTabs;
      this.selectedTabIndex.set(nextIndex);
    }
  }

  onDockTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.dockTouchStartX = event.touches[0].clientX;
      const container = (event.currentTarget as HTMLElement);
      this.dockInitialScrollLeft = container.scrollLeft;
      this.isDockDragging = false;
    }
  }

  onDockTouchMove(event: TouchEvent, container: HTMLElement): void {
    if (event.touches.length !== 1) return;
    const deltaX = this.dockTouchStartX - event.touches[0].clientX;
    if (Math.abs(deltaX) > 5) {
      this.isDockDragging = true;
      container.scrollLeft = this.dockInitialScrollLeft + deltaX;
      event.preventDefault();
    }
  }

  onDockTouchEnd(): void {
    this.isDockDragging = false;
  }

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
    statusDetail?: string;
  }): void {
    const id = this.orderData()?.id;
    if (!id) return;

    const dto: UpdateWorkOrderDto = { status: event.status };
    if (event.startedAt) dto.startedAt = event.startedAt;
    if (event.completedAt) dto.completedAt = event.completedAt;
    if (event.statusDetail) dto.statusDetail = event.statusDetail;

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
      data: {
        workOrderId: workOrder.id,
        orderTechnicians: workOrder.technicians,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadOrder();
    });
  }
}
