import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { NoteType } from '../../core/models/work-order.interfaces';

interface DialogData {
  workOrderId: string;
}

@Component({
  selector: 'app-add-note-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>note_add</mat-icon>
      Agregar Nota
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Tipo de Nota</mat-label>
          <mat-select [value]="noteType()" (selectionChange)="noteType.set($event.value)">
            <mat-option value="diagnosis">Diagnóstico</mat-option>
            <mat-option value="issue">Problema</mat-option>
            <mat-option value="observation">Observación</mat-option>
            <mat-option value="internal">Interna</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Contenido</mat-label>
          <textarea
            matInput
            [value]="content()"
            (input)="content.set(getInputValue($event))"
            rows="4"
            placeholder="Escribí el contenido de la nota..."
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event)"
        [disabled]="saving() || !content()"
      >
        {{ saving() ? 'Guardando...' : 'Guardar Nota' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class AddNoteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddNoteDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly noteType = signal<NoteType>('observation');
  readonly content = signal('');
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.content()) return;

    this.saving.set(true);
    this.workOrdersService
      .addNote(this.data.workOrderId, {
        type: this.noteType(),
        content: this.content(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving.set(false);
        },
      });
  }
}
