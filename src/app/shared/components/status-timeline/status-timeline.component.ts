import { Component, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkOrderStatusLog } from '../../../core/models/work-order.interfaces';
import { WorkOrdersService } from '../../../core/services/work-orders.service';
import { TranslationService } from '../../../core/services/translation.service';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { StatusClassPipe } from '../../pipes/status-class.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import {
  StatusChangeDialogComponent,
  StatusChangeDialogResult,
} from '../status-change-dialog/status-change-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

@Component({
  selector: 'app-status-timeline',
  imports: [
    DatePipe,
    StatusLabelPipe,
    StatusClassPipe,
    TranslatePipe,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <div class="space-y-0">
      @for (log of logs(); track log.id; let last = $last) {
        <div class="flex gap-3">
          <!-- Circle + line -->
          <div class="flex flex-col items-center">
            <div
              class="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white dark:ring-gray-800"
              [class]="log.toStatus | statusClass: 'workOrderStatus'"
            ></div>
            @if (!last) {
              <div class="w-0.5 flex-1 min-h-[2rem] bg-gray-200 dark:bg-gray-700"></div>
            }
          </div>

          <!-- Content -->
          <div class="pb-4 flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                [class]="log.toStatus | statusClass: 'workOrderStatus'"
              >
                {{ log.toStatus | statusLabel: 'workOrderStatus' }}
              </span>
              <span class="text-xs text-gray-400 dark:text-gray-500">
                {{ log.timestamp | date: 'dd/MM/yy HH:mm' }}
              </span>
            </div>
            @if (log.duration !== null) {
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {{ 'statusTimeline.duration' | translate }}: {{ formatDuration(log.duration) }}
              </p>
            }
            @if (log.changedBy) {
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {{ log.changedBy.name }} ({{ log.changedByRole }})
              </p>
            }
            @if (log.detail) {
              <div class="mt-2 flex items-start gap-2">
                <div
                  class="flex-1 rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                >
                  {{ log.detail }}
                </div>
                <button
                  mat-icon-button
                  type="button"
                  [attr.aria-label]="'statusTimeline.editDetail' | translate"
                  (click)="editDetail(log)"
                >
                  <mat-icon class="!text-base">edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  type="button"
                  [attr.aria-label]="'statusTimeline.deleteDetailTitle' | translate"
                  (click)="removeDetail(log)"
                >
                  <mat-icon class="!text-base">delete</mat-icon>
                </button>
              </div>
            } @else {
              <button mat-button type="button" class="!h-8 !text-xs mt-1" (click)="addDetail(log)">
                <mat-icon class="!text-sm">add_comment</mat-icon>
                {{ 'statusTimeline.addDetail' | translate }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class StatusTimelineComponent {
  private readonly dialog = inject(MatDialog);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly translationService = inject(TranslationService);

  logs = input.required<WorkOrderStatusLog[]>();
  changed = output<void>();
  readonly formatDuration = formatDuration;
  readonly editingId = signal<string | null>(null);

  private openDetailDialog(log: WorkOrderStatusLog): void {
    const dialogRef = this.dialog.open(StatusChangeDialogComponent, {
      width: '420px',
      data: {
        titleKey: 'statusTimeline.editDetail',
        detailLabel: this.translationService.instant('statusTimeline.detail'),
        initialDetail: log.detail ?? undefined,
      },
    });

    dialogRef.afterClosed().subscribe((result: StatusChangeDialogResult | undefined) => {
      if (result?.confirmed) {
        this.workOrdersService
          .updateStatusLogDetail(log.workOrderId, log.id, result.detail)
          .subscribe({ next: () => this.changed.emit() });
      }
    });
  }

  addDetail(log: WorkOrderStatusLog): void {
    this.openDetailDialog(log);
  }

  editDetail(log: WorkOrderStatusLog): void {
    this.openDetailDialog(log);
  }

  removeDetail(log: WorkOrderStatusLog): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        titleKey: 'statusTimeline.deleteDetailTitle',
        messageKey: 'statusTimeline.deleteDetailMessage',
        color: 'warn',
        confirmLabel: this.translationService.instant('common.delete'),
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) return;
      this.workOrdersService
        .removeStatusLogDetail(log.workOrderId, log.id)
        .subscribe({ next: () => this.changed.emit() });
    });
  }
}
