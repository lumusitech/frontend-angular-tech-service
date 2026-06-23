import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrderTask } from '../../../core/models/work-order.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tasks-tab',
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <div class="p-4">
      <div class="flex justify-end mb-4">
        <button mat-stroked-button color="primary" (click)="addTask.emit()">
          <mat-icon>add</mat-icon>
          {{ 'workOrders.tasks.addTask' | translate }}
        </button>
      </div>
      @if (!tasks() || tasks().length === 0) {
        <p class="text-gray-500 dark:text-gray-400 text-center py-8">
          {{ 'workOrders.tasks.noTasks' | translate }}
        </p>
      } @else {
        <div class="space-y-3">
          @for (task of tasks(); track task.id) {
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <button mat-icon-button (click)="toggleTask.emit({ taskId: task.id, isCompleted: !task.isCompleted })">
                <mat-icon>
                  {{ task.isCompleted ? 'check_circle' : 'radio_button_unchecked' }}
                </mat-icon>
              </button>
              <div class="flex-1">
                <p [class.line-through]="task.isCompleted" [class.text-gray-400]="task.isCompleted">
                  {{ task.title }}
                </p>
                @if (task.description) {
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ task.description }}</p>
                }
              </div>
              @if (task.assignedTo) {
                <span class="text-xs text-gray-400 dark:text-gray-500">{{ task.assignedTo.name }}</span>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class TasksTabComponent {
  tasks = input.required<WorkOrderTask[]>();
  completedCount = input.required<number>();
  addTask = output<void>();
  toggleTask = output<{ taskId: string; isCompleted: boolean }>();
}
