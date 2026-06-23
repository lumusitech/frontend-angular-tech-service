import { Component, input, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface TimelineStep {
  key: string;
  labelKey: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'pending', labelKey: 'portal.timeline.pending' },
  { key: 'assigned', labelKey: 'portal.timeline.assigned' },
  { key: 'in_progress', labelKey: 'portal.timeline.inProgress' },
  { key: 'completed', labelKey: 'portal.timeline.completed' },
  { key: 'delivered', labelKey: 'portal.timeline.delivered' },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  assigned: 1,
  in_progress: 2,
  completed: 3,
  delivered: 4,
  postponed: 2,
  cancelled: -1,
};

@Component({
  selector: 'app-portal-status-timeline',
  imports: [MatIconModule, MatCardModule, TranslatePipe],
  template: `
    @if (isCancelled()) {
      <div class="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 px-4 py-3 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
          <mat-icon class="!w-4 !h-4 text-red-600 dark:text-red-400">close</mat-icon>
        </div>
        <span class="text-sm font-medium text-red-700 dark:text-red-300">
          {{ 'portal.timeline.cancelled' | translate }}
        </span>
      </div>
    } @else if (isPostponed()) {
      <div class="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 px-4 py-3 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
          <mat-icon class="!w-4 !h-4 text-amber-600 dark:text-amber-400">pause</mat-icon>
        </div>
        <span class="text-sm font-medium text-amber-700 dark:text-amber-300">
          {{ 'portal.timeline.postponed' | translate }}
        </span>
      </div>
    } @else {
      <mat-card>
        <mat-card-content class="!p-5">
          <div class="flex justify-between relative">
            <div class="absolute top-[18px] left-[18px] right-[18px] h-[2px] bg-gray-200 dark:bg-gray-700 z-0 rounded-full"></div>
            @for (step of steps(); track step.key; let i = $index) {
              <div class="flex flex-col items-center gap-2.5 relative z-10 w-[36px]">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                  [class]="getStepClasses(i)"
                >
                  @if (isCompleted(i)) {
                    <mat-icon class="!w-[18px] !h-[18px] !text-[18px]">check</mat-icon>
                  } @else if (isCurrent(i)) {
                    <span class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                  } @else {
                    <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ i + 1 }}</span>
                  }
                </div>
                <span
                  class="text-[10px] font-medium whitespace-nowrap text-center leading-tight"
                  [class]="getLabelClasses(i)"
                >
                  {{ step.labelKey | translate }}
                </span>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class PortalStatusTimelineComponent {
  readonly status = input.required<string>();

  readonly steps = computed(() => TIMELINE_STEPS);
  readonly currentIndex = computed(() => STATUS_INDEX[this.status()] ?? 0);
  readonly isCancelled = computed(() => this.status() === 'cancelled');
  readonly isPostponed = computed(() => this.status() === 'postponed');

  isCompleted(index: number): boolean {
    return index < this.currentIndex();
  }

  isCurrent(index: number): boolean {
    return index === this.currentIndex();
  }

  getStepClasses(index: number): string {
    if (this.isCompleted(index)) {
      return 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20';
    }
    if (this.isCurrent(index)) {
      return 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100 dark:ring-blue-900/50 animate-pulse';
    }
    return 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
  }

  getLabelClasses(index: number): string {
    if (this.isCompleted(index)) {
      return 'text-emerald-600 dark:text-emerald-400';
    }
    if (this.isCurrent(index)) {
      return 'text-blue-600 dark:text-blue-400';
    }
    return 'text-gray-500 dark:text-gray-400';
  }
}
