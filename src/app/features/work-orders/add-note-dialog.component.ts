import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { NoteType, WorkOrderNote } from '../../core/models/work-order.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  workOrderId: string;
  note?: WorkOrderNote;
}

@Component({
  selector: 'app-note-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      @if (data.note) {
        <mat-icon>edit_note</mat-icon>
        {{ 'workOrders.notes.editNote' | translate }}
      } @else {
        <mat-icon>note_add</mat-icon>
        {{ 'workOrders.notes.addNote' | translate }}
      }
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.notes.noteType' | translate }}</mat-label>
          <mat-select [value]="noteType()" (selectionChange)="noteType.set($event.value)">
            <mat-option value="diagnosis">{{
              'workOrders.notes.types.diagnosis' | translate
            }}</mat-option>
            <mat-option value="issue">{{ 'workOrders.notes.types.issue' | translate }}</mat-option>
            <mat-option value="observation">{{
              'workOrders.notes.types.observation' | translate
            }}</mat-option>
            <mat-option value="internal">{{
              'workOrders.notes.types.internal' | translate
            }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.notes.content' | translate }}</mat-label>
          <textarea
            matInput
            [value]="content()"
            (input)="content.set(getInputValue($event))"
            rows="4"
            [placeholder]="'workOrders.notes.contentPlaceholder' | translate"
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event)"
        [disabled]="saving() || !content()"
      >
        {{
          saving()
            ? ('common.saving' | translate)
            : (data.note ? ('workOrders.notes.saveNote' | translate) : ('workOrders.notes.saveNote' | translate))
        }}
      </button>
    </mat-dialog-actions>
  `,
})
export class NoteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<NoteDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly noteType = signal<NoteType>(this.data.note?.type || 'observation');
  readonly content = signal(this.data.note?.content || '');
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.content()) return;

    this.saving.set(true);

    const dto = { type: this.noteType(), content: this.content() };

    if (this.data.note) {
      this.workOrdersService.updateNote(this.data.workOrderId, this.data.note.id, dto).subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      this.workOrdersService.addNote(this.data.workOrderId, dto).subscribe({
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
}
