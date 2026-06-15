import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PendingItemsService } from '../../core/services/pending-items.service';
import {
  PendingItem,
  PendingItemType,
  PendingItemPriority,
  PendingItemStatus,
  CreatePendingItemDto,
  UpdatePendingItemDto,
} from '../../core/models/pending-item.interfaces';

interface DialogData {
  mode: 'create' | 'edit';
  item?: PendingItem;
}

@Component({
  selector: 'app-pending-item-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>pending_actions</mat-icon>
      {{ data.mode === 'create' ? 'Nuevo Pendiente' : 'Editar Pendiente' }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Título</mat-label>
          <input matInput [value]="title()" (input)="title.set(getInputValue($event))" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Descripción</mat-label>
          <textarea
            matInput
            rows="3"
            [value]="description()"
            (input)="description.set(getInputValue($event))"
          ></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Tipo</mat-label>
            <mat-select [value]="type()" (selectionChange)="type.set($event.value)" required>
              <mat-option value="work_order">Orden de trabajo</mat-option>
              <mat-option value="inquiry">Consulta</mat-option>
              <mat-option value="maintenance">Mantenimiento</mat-option>
              <mat-option value="follow_up">Seguimiento</mat-option>
              <mat-option value="other">Otro</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Prioridad</mat-label>
            <mat-select [value]="priority()" (selectionChange)="priority.set($event.value)">
              <mat-option value="low">Baja</mat-option>
              <mat-option value="medium">Media</mat-option>
              <mat-option value="high">Alta</mat-option>
              <mat-option value="urgent">Urgente</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Fecha de vencimiento</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            [value]="dueDate()"
            (dateChange)="onDateChange($event)"
            required
          />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>

        @if (data.mode === 'edit') {
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Estado</mat-label>
            <mat-select [value]="status()" (selectionChange)="status.set($event.value)">
              <mat-option value="pending">Pendiente</mat-option>
              <mat-option value="in_progress">En progreso</mat-option>
              <mat-option value="completed">Completado</mat-option>
              <mat-option value="cancelled">Cancelado</mat-option>
            </mat-select>
          </mat-form-field>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
        {{ saving() ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class PendingItemFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PendingItemFormComponent>);
  private readonly pendingItemsService = inject(PendingItemsService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly title = signal(this.data.item?.title || '');
  readonly description = signal(this.data.item?.description || '');
  readonly type = signal(this.data.item?.type || PendingItemType.WORK_ORDER);
  readonly priority = signal(this.data.item?.priority || PendingItemPriority.MEDIUM);
  readonly status = signal(this.data.item?.status || PendingItemStatus.PENDING);
  readonly dueDate = signal<Date | null>(
    this.data.item?.dueDate ? new Date(this.data.item.dueDate) : null,
  );
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onDateChange(event: { value: Date | null }): void {
    this.dueDate.set(event.value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.title() || !this.dueDate()) return;

    this.saving.set(true);

    const dueDateStr = this.dueDate()!.toISOString().split('T')[0];

    if (this.data.mode === 'create') {
      const dto: CreatePendingItemDto = {
        title: this.title(),
        description: this.description() || undefined,
        dueDate: dueDateStr,
        type: this.type() as PendingItemType,
        priority: this.priority() as PendingItemPriority,
      };

      this.pendingItemsService.create(dto).subscribe({
        next: (item) => {
          this.saving.set(false);
          this.dialogRef.close(item);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      const dto: UpdatePendingItemDto = {
        title: this.title(),
        description: this.description() || undefined,
        dueDate: dueDateStr,
        type: this.type() as PendingItemType,
        priority: this.priority() as PendingItemPriority,
        status: this.status() as PendingItemStatus,
      };

      this.pendingItemsService.update(this.data.item!.id, dto).subscribe({
        next: (item) => {
          this.saving.set(false);
          this.dialogRef.close(item);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    }
  }
}
