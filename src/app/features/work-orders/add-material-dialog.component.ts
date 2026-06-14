import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';

interface DialogData {
  workOrderId: string;
}

@Component({
  selector: 'app-add-material-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>build</mat-icon>
      Agregar Material
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Descripción</mat-label>
          <input
            matInput
            [value]="description()"
            (input)="description.set(getInputValue($event))"
            placeholder="Ej: Cable UTP Cat6 - 50m"
          />
        </mat-form-field>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Cantidad</mat-label>
            <input
              matInput
              type="number"
              min="1"
              [value]="quantity()"
              (input)="quantity.set(+getInputValue($event))"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Costo Unitario</mat-label>
            <input
              matInput
              type="number"
              min="0"
              step="0.01"
              [value]="unitCost()"
              (input)="unitCost.set(+getInputValue($event))"
            />
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event)"
        [disabled]="saving() || !description() || quantity() <= 0"
      >
        {{ saving() ? 'Guardando...' : 'Guardar Material' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class AddMaterialDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddMaterialDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly description = signal('');
  readonly quantity = signal(1);
  readonly unitCost = signal(0);
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.description() || this.quantity() <= 0) return;

    this.saving.set(true);
    this.workOrdersService
      .addMaterial(this.data.workOrderId, {
        description: this.description(),
        quantity: this.quantity(),
        unitCost: this.unitCost(),
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
