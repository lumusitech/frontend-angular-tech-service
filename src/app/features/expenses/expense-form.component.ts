import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ExpensesService } from '../../core/services/expenses.service';
import {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseCategory,
} from '../../core/models/expense.interfaces';

interface DialogData {
  mode: 'create' | 'edit';
  expense?: Expense;
}

@Component({
  selector: 'app-expense-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>receipt_long</mat-icon>
      {{ data.mode === 'create' ? 'Nuevo Gasto' : 'Editar Gasto' }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Descripción</mat-label>
          <input
            matInput
            [value]="description()"
            (input)="description.set(getInputValue($event))"
            required
          />
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Monto</mat-label>
            <input
              matInput
              type="number"
              [value]="amount()"
              (input)="amount.set(getInputValue($event))"
              min="0"
              step="0.01"
              required
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Fecha</mat-label>
            <input
              matInput
              type="date"
              [value]="date()"
              (input)="date.set(getInputValue($event))"
              required
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Categoría</mat-label>
          <mat-select [value]="category()" (selectionChange)="category.set($event.value)">
            <mat-option value="rent">Alquiler</mat-option>
            <mat-option value="utilities">Servicios</mat-option>
            <mat-option value="salaries">Sueldos</mat-option>
            <mat-option value="tools">Herramientas</mat-option>
            <mat-option value="transport">Transporte</mat-option>
            <mat-option value="advertising">Publicidad</mat-option>
            <mat-option value="supplies">Insumos</mat-option>
            <mat-option value="maintenance">Mantenimiento</mat-option>
            <mat-option value="hosting">Hosting</mat-option>
            <mat-option value="other">Otros</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Notas</mat-label>
          <textarea
            matInput
            [value]="notes()"
            (input)="notes.set(getInputValue($event))"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-checkbox [checked]="isRecurring()" (change)="isRecurring.set($event.checked)">
          Gasto recurrente
        </mat-checkbox>
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
export class ExpenseFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ExpenseFormComponent>);
  private readonly expensesService = inject(ExpensesService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly description = signal(this.data.expense?.description || '');
  readonly amount = signal(this.data.expense?.amount?.toString() || '');
  readonly date = signal(this.data.expense?.date || new Date().toISOString().split('T')[0]);
  readonly category = signal<ExpenseCategory>(this.data.expense?.category || 'other');
  readonly notes = signal(this.data.expense?.notes || '');
  readonly isRecurring = signal(this.data.expense?.isRecurring ?? false);
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.saving.set(true);

    if (this.data.mode === 'create') {
      const dto: CreateExpenseDto = {
        description: this.description(),
        amount: parseFloat(this.amount()),
        date: this.date(),
        category: this.category(),
        isRecurring: this.isRecurring(),
        notes: this.notes() || undefined,
      };

      this.expensesService.create(dto).subscribe({
        next: (expense) => {
          this.saving.set(false);
          this.dialogRef.close(expense);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      const dto: UpdateExpenseDto = {
        description: this.description(),
        amount: parseFloat(this.amount()),
        date: this.date(),
        category: this.category(),
        isRecurring: this.isRecurring(),
        notes: this.notes() || undefined,
      };

      this.expensesService.update(this.data.expense!.id, dto).subscribe({
        next: (expense) => {
          this.saving.set(false);
          this.dialogRef.close(expense);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    }
  }
}
