import { Component, input, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PortalTask } from '../../core/models/portal.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-portal-tasks',
  imports: [MatIconModule, MatCardModule, MatProgressBarModule, TranslatePipe, DatePipe],
  template: `
    <mat-card>
      <mat-card-content class="!p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ 'portal.tasks.title' | translate }}
          </h3>
          <span class="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            {{ completedCount() }}/{{ tasks().length }}
          </span>
        </div>

        <mat-progress-bar mode="determinate" [value]="progressPercent()" class="!h-1.5 mb-4" />

        <div class="space-y-2.5">
          @for (task of tasks(); track task.title) {
            <div class="flex items-start gap-3 group">
              <div
                class="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5"
                [class]="
                  task.isCompleted
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-200 dark:border-gray-700'
                "
              >
                @if (task.isCompleted) {
                  <mat-icon class="!w-3 !h-3 text-white">check</mat-icon>
                }
              </div>
              <div class="flex-1 min-w-0">
                <span
                  class="text-sm"
                  [class]="
                    task.isCompleted
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-700 dark:text-gray-200'
                  "
                >
                  {{ task.title }}
                </span>
                @if (task.description) {
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {{ task.description }}
                  </p>
                }
              </div>
              @if (task.completedAt) {
                <span
                  class="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 mt-0.5 tabular-nums"
                >
                  {{ task.completedAt | date: 'dd/MM' }}
                </span>
              }
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class PortalTasksComponent {
  readonly tasks = input.required<PortalTask[]>();

  readonly completedCount = computed(() => this.tasks().filter((t) => t.isCompleted).length);

  readonly progressPercent = computed(() => {
    const total = this.tasks().length;
    return total > 0 ? Math.round((this.completedCount() / total) * 100) : 0;
  });
}
