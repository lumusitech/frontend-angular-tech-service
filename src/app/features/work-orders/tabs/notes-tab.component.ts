import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrderNote } from '../../../core/models/work-order.interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { WorkOrdersService } from '../../../core/services/work-orders.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { NoteDialogComponent } from '../add-note-dialog.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-notes-tab',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    StatusBadgeComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ 'workOrders.notes.notesList' | translate }}
        </h3>
        <button
          mat-stroked-button
          color="primary"
          (click)="addNote.emit()"
          class="px-3! min-h-9! rounded-xl!"
        >
          <mat-icon class="text-sm shrink-0">add</mat-icon>
          <span class="text-xs sm:text-sm font-medium">{{
            'workOrders.notes.addNote' | translate
          }}</span>
        </button>
      </div>

      @if (!notes() || notes().length === 0) {
        <div
          class="text-center py-8 px-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700"
        >
          <mat-icon class="text-gray-400 dark:text-gray-500 text-2xl mb-1">description</mat-icon>
          <p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">
            {{ 'workOrders.notes.noNotes' | translate }}
          </p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (note of notes(); track note.id) {
            <div
              class="p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-2 shadow-2xs"
            >
              <div class="flex items-center gap-2 flex-wrap">
                <app-status-badge [value]="note.type" type="noteType" />
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ note.createdBy?.name }} • {{ note.createdAt | relativeDate }}
                </span>
                @if (authService.isAdmin()) {
                  <div class="ml-auto flex items-center gap-0.5 shrink-0">
                    <button
                      mat-icon-button
                      (click)="onEditNote(note)"
                      class="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                      [matTooltip]="'common.edit' | translate"
                    >
                      <mat-icon class="text-lg">edit</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      (click)="onDeleteNote(note)"
                      class="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      [matTooltip]="'common.delete' | translate"
                    >
                      <mat-icon class="text-lg">delete</mat-icon>
                    </button>
                  </div>
                }
              </div>
              <p
                class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed"
              >
                {{ note.content }}
              </p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class NotesTabComponent {
  private readonly dialog = inject(MatDialog);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly translationService = inject(TranslationService);
  readonly authService = inject(AuthService);

  notes = input.required<WorkOrderNote[]>();
  workOrderId = input<string>('');
  addNote = output<void>();
  noteChanged = output<void>();

  onEditNote(note: WorkOrderNote): void {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '500px',
      data: { workOrderId: this.workOrderId(), note },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.noteChanged.emit();
    });
  }

  onDeleteNote(note: WorkOrderNote): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translationService.instant('workOrders.notes.deleteTitle'),
        message: this.translationService.instant('workOrders.notes.deleteMessage'),
        confirmLabel: this.translationService.instant('common.delete'),
        cancelLabel: this.translationService.instant('common.cancel'),
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.workOrdersService.deleteNote(this.workOrderId(), note.id).subscribe({
        next: () => this.noteChanged.emit(),
      });
    });
  }
}
