import { Component, computed, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-bulk-actions',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  template: `
    <div
      class="sticky top-[4.5rem] z-10 flex flex-wrap items-center gap-3 rounded-lg border
                border-gray-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur
                dark:border-gray-800 dark:bg-gray-900/95"
    >
      <mat-checkbox
        color="primary"
        [checked]="allSelected()"
        [indeterminate]="someSelected()"
        (change)="selectAll.emit($event.checked)"
      >
        {{ 'bulk.selectAll' | translate }}
      </mat-checkbox>

      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ selectedCount() }} {{ 'bulk.selected' | translate }}
      </span>

      <mat-divider vertical class="!h-6 hidden sm:block" />

      <button
        mat-button
        type="button"
        [disabled]="selectedCount() === 0 || loading()"
        (click)="clearSelection.emit()"
      >
        <mat-icon>deselect</mat-icon>
        {{ 'bulk.clearSelection' | translate }}
      </button>

      @if (showExport()) {
        <button
          mat-stroked-button
          type="button"
          [disabled]="selectedCount() === 0 || loading()"
          (click)="exportCsv.emit()"
        >
          <mat-icon>file_download</mat-icon>
          {{ 'bulk.exportCsv' | translate }}
        </button>
      }

      @if (showStatusChange()) {
        <button
          mat-stroked-button
          type="button"
          color="primary"
          [disabled]="selectedCount() === 0 || loading()"
          (click)="statusChange.emit()"
        >
          <mat-icon>swap_horiz</mat-icon>
          {{ statusChangeLabel() }}
        </button>
      }

      @if (showActivateDeactivate()) {
        <button
          mat-stroked-button
          type="button"
          [disabled]="selectedCount() === 0 || loading()"
          (click)="activate.emit(true)"
        >
          <mat-icon>check_circle_outline</mat-icon>
          {{ 'bulk.activate' | translate }}
        </button>
        <button
          mat-stroked-button
          type="button"
          [disabled]="selectedCount() === 0 || loading()"
          (click)="activate.emit(false)"
        >
          <mat-icon>highlight_off</mat-icon>
          {{ 'bulk.deactivate' | translate }}
        </button>
      }

      @if (showDelete()) {
        <button
          mat-stroked-button
          type="button"
          color="warn"
          [disabled]="selectedCount() === 0 || loading()"
          (click)="deleteSelected.emit()"
        >
          <mat-icon>delete_outline</mat-icon>
          {{ 'bulk.deleteSelected' | translate }}
        </button>
      }

      @if (loading()) {
        <mat-progress-spinner diameter="20" mode="indeterminate" class="ml-auto" />
      }
    </div>
  `,
})
export class BulkActionsComponent {
  readonly selectedCount = input(0);
  readonly totalCount = input(0);
  readonly showExport = input(true);
  readonly showStatusChange = input(false);
  readonly showActivateDeactivate = input(false);
  readonly showDelete = input(true);
  readonly statusChangeLabel = input('');
  readonly loading = input(false);

  readonly selectAll = output<boolean>();
  readonly clearSelection = output<void>();
  readonly exportCsv = output<void>();
  readonly statusChange = output<void>();
  readonly activate = output<boolean>();
  readonly deleteSelected = output<void>();

  readonly allSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() >= this.totalCount(),
  );
  readonly someSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.totalCount(),
  );
}
