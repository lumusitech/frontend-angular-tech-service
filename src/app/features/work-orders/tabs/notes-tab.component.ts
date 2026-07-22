import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrderNote } from '../../../core/models/work-order.interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { WorkOrdersService } from '../../../core/services/work-orders.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { NoteDialogComponent } from '../add-note-dialog.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-notes-tab',
  imports: [MatIconModule, MatButtonModule, StatusBadgeComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="p-4">
      <div class="flex justify-end mb-4">
        <button mat-stroked-button color="primary" (click)="addNote.emit()">
          <mat-icon>add</mat-icon>
          {{ 'workOrders.notes.addNote' | translate }}
        </button>
      </div>
      @if (!notes() || notes().length === 0) {
        <p class="text-gray-500 dark:text-gray-400 text-center py-8">
          {{ 'workOrders.notes.noNotes' | translate }}
        </p>
      } @else {
        <div class="space-y-3">
          @for (note of notes(); track note.id) {
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <app-status-badge [value]="note.type" type="noteType" />
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  {{ note.createdBy?.name }} - {{ note.createdAt | relativeDate }}
                </span>
                @if (authService.isAdmin()) {
                  <div class="ml-auto flex items-center gap-1">
                    <button mat-icon-button size="small" (click)="onEditNote(note)" title="Editar nota">
                      <mat-icon class="!w-4 !h-4 text-gray-500">edit</mat-icon>
                    </button>
                    <button mat-icon-button size="small" (click)="onDeleteNote(note)" title="Eliminar nota">
                      <mat-icon class="!w-4 !h-4 text-red-500">delete</mat-icon>
                    </button>
                  </div>
                }
              </div>
              <p class="text-sm">{{ note.content }}</p>
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
        title: 'Eliminar nota',
        message: '¿Estás seguro de que deseas eliminar esta nota?',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
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
