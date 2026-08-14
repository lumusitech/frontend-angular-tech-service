import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrderTask } from '../../../core/models/work-order.interfaces';
import { WorkOrdersService } from '../../../core/services/work-orders.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AddTaskDialogComponent } from '../add-task-dialog.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tasks-tab',
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <div class="p-4">
      <div class="flex justify-end mb-4">
        <button mat-flat-button color="primary" (click)="addTask.emit()" class="!rounded-lg">
          <mat-icon class="!w-4 !h-4 !text-[18px] !leading-none">add</mat-icon>
          {{ 'workOrders.tasks.addTask' | translate }}
        </button>
      </div>
      @if (!tasks() || tasks().length === 0) {
        <div
          class="text-center py-10 px-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700"
        >
          <mat-icon class="!w-10 !h-10 !text-[40px] text-gray-300 dark:text-gray-600 mb-2"
            >task</mat-icon
          >
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ 'workOrders.tasks.noTasks' | translate }}
          </p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (task of tasks(); track task.id) {
            <div
              class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/60 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200"
              [class.opacity-75]="task.isCompleted"
            >
              <!-- Left: Checkbox + Content -->
              <div class="flex items-start gap-3 min-w-0 flex-1">
                <!-- Circular/Custom Checkbox Button -->
                <button
                  type="button"
                  (click)="toggleTask.emit({ taskId: task.id, isCompleted: !task.isCompleted })"
                  class="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  [class]="
                    task.isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-gray-700/50'
                  "
                  [title]="
                    task.isCompleted
                      ? ('workOrders.tasks.markAsPending' | translate)
                      : ('workOrders.tasks.markAsCompleted' | translate)
                  "
                >
                  @if (task.isCompleted) {
                    <mat-icon class="!w-3.5 !h-3.5 !text-[14px] !leading-none font-bold"
                      >check</mat-icon
                    >
                  }
                </button>

                <!-- Text info -->
                <div class="flex-1 min-w-0">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-gray-100 break-words leading-tight"
                    [class.line-through]="task.isCompleted"
                    [class.text-gray-400]="task.isCompleted"
                    [class.dark:text-gray-500]="task.isCompleted"
                  >
                    {{ task.title }}
                  </h4>

                  @if (task.description) {
                    <p
                      class="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words leading-relaxed"
                      [class.line-through]="task.isCompleted"
                    >
                      {{ task.description }}
                    </p>
                  }

                  @if (task.assignedTo) {
                    <div class="mt-2 flex items-center">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-[13px] !leading-none text-blue-500"
                          >person</mat-icon
                        >
                        <span class="truncate max-w-[160px] sm:max-w-[220px]">{{
                          task.assignedTo.name
                        }}</span>
                      </span>
                    </div>
                  }
                </div>
              </div>

              <!-- Right: Actions (Edit / Delete) -->
              <div
                class="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700/50"
              >
                <button
                  mat-icon-button
                  (click)="onEditTask(task)"
                  [title]="'workOrders.tasks.editTask' | translate"
                  class="!w-8 !h-8 !leading-none text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                >
                  <mat-icon class="!w-4.5 !h-4.5 !text-[18px] !leading-none">edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="onDeleteTask(task)"
                  [title]="'workOrders.tasks.deleteTask' | translate"
                  class="!w-8 !h-8 !leading-none text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                >
                  <mat-icon class="!w-4.5 !h-4.5 !text-[18px] !leading-none">delete</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class TasksTabComponent {
  private readonly dialog = inject(MatDialog);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  tasks = input.required<WorkOrderTask[]>();
  completedCount = input.required<number>();
  workOrderId = input<string>('');
  orderTechnicians = input<{ id: string; name: string }[]>([]);

  addTask = output<void>();
  toggleTask = output<{ taskId: string; isCompleted: boolean }>();
  taskChanged = output<void>();

  onEditTask(task: WorkOrderTask): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: {
        workOrderId: this.workOrderId(),
        orderTechnicians: this.orderTechnicians(),
        task,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.taskChanged.emit();
    });
  }

  onDeleteTask(task: WorkOrderTask): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translationService.instant('workOrders.tasks.deleteTask'),
        message: this.translationService.instant('workOrders.tasks.deleteTaskConfirm'),
        confirmLabel: this.translationService.instant('common.delete'),
        cancelLabel: this.translationService.instant('common.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.workOrdersService.deleteTask(this.workOrderId(), task.id).subscribe({
        next: () => {
          this.toastService.show(
            this.translationService.instant('workOrders.tasks.taskDeletedSuccess'),
            'success',
          );
          this.taskChanged.emit();
        },
        error: (err) => {
          const msg =
            err.error?.message ||
            this.translationService.instant('workOrders.tasks.taskDeletedError');
          this.toastService.show(msg, 'error');
        },
      });
    });
  }
}
