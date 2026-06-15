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
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

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
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>receipt_long</mat-icon>
      {{
        data.mode === 'create'
          ? ('expenses.newExpense' | translate)
          : ('expenses.editExpense' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.description' | translate }}</mat-label>
          <input
            matInput
            [value]="description()"
            (input)="description.set(getInputValue($event))"
            required
          />
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'expenses.amount' | translate }}</mat-label>
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
            <mat-label>{{ 'expenses.date' | translate }}</mat-label>
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
          <mat-label>{{ 'expenses.category' | translate }}</mat-label>
          <mat-select [value]="category()" (selectionChange)="category.set($event.value)">
            <mat-option value="rent">{{ 'expenses.categories.rent' | translate }}</mat-option>
            <mat-option value="utilities">{{
              'expenses.categories.utilities' | translate
            }}</mat-option>
            <mat-option value="salaries">{{
              'expenses.categories.salaries' | translate
            }}</mat-option>
            <mat-option value="tools">{{ 'expenses.categories.tools' | translate }}</mat-option>
            <mat-option value="transport">{{
              'expenses.categories.transport' | translate
            }}</mat-option>
            <mat-option value="advertising">{{
              'expenses.categories.advertising' | translate
            }}</mat-option>
            <mat-option value="supplies">{{
              'expenses.categories.supplies' | translate
            }}</mat-option>
            <mat-option value="maintenance">{{
              'expenses.categories.maintenance' | translate
            }}</mat-option>
            <mat-option value="hosting">{{ 'expenses.categories.hosting' | translate }}</mat-option>
            <mat-option value="other">{{ 'expenses.categories.other' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.notes' | translate }}</mat-label>
          <textarea
            matInput
            [value]="notes()"
            (input)="notes.set(getInputValue($event))"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-checkbox [checked]="isRecurring()" (change)="isRecurring.set($event.checked)">
          {{ 'expenses.recurringExpense' | translate }}
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
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
