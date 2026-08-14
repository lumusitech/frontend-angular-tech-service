import { Component, computed, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-bulk-actions',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  styles: `
    :host {
      display: block;
    }

    .count-chip {
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      color: var(--color-primary);
    }
    :host-context(.dark) .count-chip {
      background: color-mix(in srgb, var(--color-primary) 20%, transparent);
      color: #bfdbfe;
    }

    .select-hint {
      color: #6b7280;
    }
    :host-context(.dark) .select-hint {
      color: #9ca3af;
    }

    .mobile-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      min-height: 3rem;
      padding: 0.375rem 0.25rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(107, 114, 128, 0.35);
      background: transparent;
      color: #374151;
      font-size: 0.625rem;
      line-height: 1.25;
      font-weight: 500;
      cursor: pointer;
      transition:
        background-color 0.15s ease-out,
        transform 0.15s ease-out;
    }
    .mobile-action:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .mobile-action:not(:disabled):active {
      transform: scale(0.97);
    }

    .mobile-action-primary {
      color: var(--color-primary);
      border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
      background: color-mix(in srgb, var(--color-primary) 8%, transparent);
    }

    .mobile-action-danger {
      color: var(--color-danger);
      border-color: color-mix(in srgb, var(--color-danger) 45%, transparent);
      background: color-mix(in srgb, var(--color-danger) 8%, transparent);
    }

    :host-context(.dark) .mobile-action {
      color: #d1d5db;
      border-color: rgba(107, 114, 128, 0.5);
    }
    :host-context(.dark) .mobile-action-primary {
      color: #bfdbfe;
    }
    :host-context(.dark) .mobile-action-danger {
      color: #fecaca;
    }

    .mobile-toolbar {
      animation: bulk-toolbar-in 0.2s ease-out;
    }
    @keyframes bulk-toolbar-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .mobile-toolbar {
        animation: none;
      }
    }
  `,
  template: `
    <div class="bulk-root">
      <!-- Desktop toolbar -->
      <div
        class="hidden md:flex sticky top-[4.5rem] z-10 relative items-center gap-3 rounded-lg border
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

        @if (selectedCount() > 0) {
          <span
            class="count-chip text-xs font-semibold rounded-full px-2.5 py-1 whitespace-nowrap"
            aria-live="polite"
          >
            {{ selectedCount() }} {{ 'bulk.selected' | translate }}
          </span>

          <mat-divider vertical class="!h-6 hidden sm:block" />

          <div class="ml-auto flex items-center gap-2 whitespace-nowrap">
            <button
              mat-icon-button
              type="button"
              [matTooltip]="'bulk.clearSelection' | translate"
              [attr.aria-label]="'bulk.clearSelection' | translate"
              [disabled]="loading()"
              (click)="clearSelection.emit()"
            >
              <mat-icon>deselect</mat-icon>
            </button>

            @if (showExport()) {
              <button
                mat-stroked-button
                type="button"
                [disabled]="loading()"
                (click)="exportCsv.emit()"
              >
                <mat-icon>file_download</mat-icon>
                {{ 'bulk.exportCsv' | translate }}
              </button>
            }

            @if (showStatusChange()) {
              <button
                mat-flat-button
                type="button"
                color="primary"
                [disabled]="loading()"
                (click)="statusChange.emit()"
              >
                <mat-icon>swap_horiz</mat-icon>
                {{ statusChangeLabel() }}
              </button>
            }

            @if (showIssue()) {
              <button
                mat-flat-button
                type="button"
                color="primary"
                [disabled]="loading()"
                (click)="issue.emit()"
              >
                <mat-icon>fact_check</mat-icon>
                {{ 'bulk.issue' | translate }}
              </button>
            }

            @if (showCancel()) {
              <button
                mat-stroked-button
                type="button"
                color="warn"
                [disabled]="loading()"
                (click)="cancelSelected.emit()"
              >
                <mat-icon>block</mat-icon>
                {{ 'bulk.cancel' | translate }}
              </button>
            }

            @if (showMarkRead()) {
              <button
                mat-flat-button
                type="button"
                color="primary"
                [disabled]="loading()"
                (click)="markRead.emit()"
              >
                <mat-icon>mark_email_read</mat-icon>
                {{ 'bulk.markRead' | translate }}
              </button>
            }

            @if (showActivateDeactivate()) {
              <button
                mat-stroked-button
                type="button"
                color="primary"
                [disabled]="loading()"
                (click)="activate.emit(true)"
              >
                <mat-icon>check_circle_outline</mat-icon>
                {{ 'bulk.activate' | translate }}
              </button>
              <button
                mat-stroked-button
                type="button"
                color="warn"
                [disabled]="loading()"
                (click)="activate.emit(false)"
              >
                <mat-icon>highlight_off</mat-icon>
                {{ 'bulk.deactivate' | translate }}
              </button>
            }

            @if (showDelete()) {
              <button
                mat-flat-button
                type="button"
                color="warn"
                [disabled]="loading()"
                (click)="deleteSelected.emit()"
              >
                <mat-icon>delete_outline</mat-icon>
                {{ 'bulk.deleteSelected' | translate }}
              </button>
            }
          </div>
        } @else {
          <span class="select-hint text-sm">
            {{ 'bulk.selectHint' | translate }}
          </span>
        }

        @if (loading()) {
          <mat-progress-bar
            mode="indeterminate"
            class="!absolute !bottom-0 !left-0 !right-0 !h-0.5 !rounded-b-lg"
          />
        }
      </div>

      <!-- Mobile floating toolbar -->
      @if (selectedCount() > 0) {
        <div
          class="mobile-toolbar md:hidden fixed bottom-20 left-0 right-0 z-40 mx-auto w-[calc(100%-2rem)]
                     max-w-lg rounded-xl border border-gray-200 bg-white/95 shadow-lg backdrop-blur
                     dark:border-gray-800 dark:bg-gray-900/95"
          role="toolbar"
          aria-label="bulk actions"
        >
          <div class="flex items-center gap-2 px-3 pt-2">
            <mat-checkbox
              color="primary"
              [checked]="allSelected()"
              [indeterminate]="someSelected()"
              (change)="selectAll.emit($event.checked)"
            >
              {{ 'bulk.selectAll' | translate }}
            </mat-checkbox>

            <span
              class="count-chip text-xs font-semibold rounded-full px-2.5 py-1"
              aria-live="polite"
            >
              {{ selectedCount() }} {{ 'bulk.selected' | translate }}
            </span>

            <button
              mat-icon-button
              type="button"
              class="ml-auto"
              [attr.aria-label]="'bulk.clearSelection' | translate"
              [disabled]="loading()"
              (click)="clearSelection.emit()"
            >
              <mat-icon>deselect</mat-icon>
            </button>
          </div>

          <div class="grid grid-flow-col auto-cols-fr gap-1 p-2 pt-1">
            @if (showExport()) {
              <button
                type="button"
                class="mobile-action"
                [disabled]="loading()"
                (click)="exportCsv.emit()"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">file_download</mat-icon>
                <span class="truncate w-full text-center">{{ 'bulk.exportCsv' | translate }}</span>
              </button>
            }

            @if (showStatusChange()) {
              <button
                type="button"
                class="mobile-action mobile-action-primary"
                [disabled]="loading()"
                (click)="statusChange.emit()"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">swap_horiz</mat-icon>
                <span class="truncate w-full text-center">{{ statusChangeLabel() }}</span>
              </button>
            }

            @if (showIssue()) {
              <button
                type="button"
                class="mobile-action mobile-action-primary"
                [disabled]="loading()"
                (click)="issue.emit()"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">fact_check</mat-icon>
                <span class="truncate w-full text-center">{{ 'bulk.issue' | translate }}</span>
              </button>
            }

            @if (showCancel()) {
              <button
                type="button"
                class="mobile-action mobile-action-danger"
                [disabled]="loading()"
                (click)="cancelSelected.emit()"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">block</mat-icon>
                <span class="truncate w-full text-center">{{ 'bulk.cancel' | translate }}</span>
              </button>
            }

            @if (showMarkRead()) {
              <button
                type="button"
                class="mobile-action mobile-action-primary"
                [disabled]="loading()"
                (click)="markRead.emit()"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">mark_email_read</mat-icon>
                <span class="truncate w-full text-center">{{ 'bulk.markRead' | translate }}</span>
              </button>
            }

            @if (showActivateDeactivate()) {
              <button
                type="button"
                class="mobile-action mobile-action-primary"
                [disabled]="loading()"
                (click)="activate.emit(true)"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">check_circle_outline</mat-icon>
                <span class="truncate w-full text-center">{{ 'bulk.activate' | translate }}</span>
              </button>
              <button
                type="button"
                class="mobile-action mobile-action-danger"
                [disabled]="loading()"
                (click)="activate.emit(false)"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">highlight_off</mat-icon>
                <span class="truncate w-full text-center">{{ 'bulk.deactivate' | translate }}</span>
              </button>
            }

            @if (showDelete()) {
              <button
                type="button"
                class="mobile-action mobile-action-danger"
                [disabled]="loading()"
                (click)="deleteSelected.emit()"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px]">delete_outline</mat-icon>
                <span class="truncate w-full text-center">{{
                  'bulk.deleteSelected' | translate
                }}</span>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class BulkActionsComponent {
  readonly selectedCount = input(0);
  readonly totalCount = input(0);
  readonly showExport = input(true);
  readonly showStatusChange = input(false);
  readonly showIssue = input(false);
  readonly showCancel = input(false);
  readonly showMarkRead = input(false);
  readonly showActivateDeactivate = input(false);
  readonly showDelete = input(true);
  readonly statusChangeLabel = input('');
  readonly loading = input(false);

  readonly selectAll = output<boolean>();
  readonly clearSelection = output<void>();
  readonly exportCsv = output<void>();
  readonly statusChange = output<void>();
  readonly issue = output<void>();
  readonly cancelSelected = output<void>();
  readonly markRead = output<void>();
  readonly activate = output<boolean>();
  readonly deleteSelected = output<void>();

  readonly allSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() >= this.totalCount(),
  );
  readonly someSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.totalCount(),
  );
}
