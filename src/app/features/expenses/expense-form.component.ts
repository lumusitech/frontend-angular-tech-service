import { Component, inject, signal } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ExpensesService } from '../../core/services/expenses.service';
import {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseCategory,
} from '../../core/models/expense.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  expense?: Expense;
}

interface ExpenseFormModel {
  description: string;
  amount: string;
  category: ExpenseCategory;
  notes: string;
  isRecurring: boolean;
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
    MatDatepickerModule,
    MatNativeDateModule,
    FormField,
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
      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.description' | translate }}</mat-label>
          <input matInput [formField]="expenseForm.description" />
          @if (expenseForm.description().invalid() && expenseForm.description().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'expenses.amount' | translate }}</mat-label>
            <input matInput type="number" [formField]="expenseForm.amount" step="0.01" />
            @if (expenseForm.amount().invalid() && expenseForm.amount().touched()) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'expenses.date' | translate }}</mat-label>
            <input
              matInput
              [matDatepicker]="datePicker"
              [value]="dateValue()"
              (dateChange)="dateValue.set($any($event).value)"
              (click)="datePicker.open()"
            />
            <mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.category' | translate }}</mat-label>
          <mat-select [formField]="expenseForm.category">
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
          <textarea matInput [formField]="expenseForm.notes" rows="3"></textarea>
        </mat-form-field>

        <mat-checkbox [formField]="expenseForm.isRecurring">
          {{ 'expenses.recurringExpense' | translate }}
        </mat-checkbox>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="saving() || expenseForm().invalid()"
      >
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ExpenseFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ExpenseFormComponent>);
  private readonly expensesService = inject(ExpensesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly dateValue = signal<Date | null>(
    this.data.expense?.date ? new Date(this.data.expense.date) : new Date(),
  );

  readonly model = signal<ExpenseFormModel>({
    description: this.data.expense?.description || '',
    amount: this.data.expense?.amount?.toString() || '',
    category: this.data.expense?.category || 'other',
    notes: this.data.expense?.notes || '',
    isRecurring: this.data.expense?.isRecurring ?? false,
  });
  readonly expenseForm = form(this.model, (p) => {
    required(p.description, { message: 'validation.required' });
    required(p.amount, { message: 'validation.invalidAmount' });
    required(p.category, { message: 'validation.required' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.expenseForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();
    const dateStr = this.dateValue() ? toLocalDateString(this.dateValue()!) : '';

    if (this.data.mode === 'create') {
      const dto: CreateExpenseDto = {
        description: m.description,
        amount: parseFloat(m.amount),
        date: dateStr,
        category: m.category,
        isRecurring: m.isRecurring,
        notes: m.notes || undefined,
      };

      this.expensesService.create(dto).subscribe({
        next: (expense) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(expense);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Create expense failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
    } else {
      const dto: UpdateExpenseDto = {
        description: m.description,
        amount: parseFloat(m.amount),
        date: dateStr,
        category: m.category,
        isRecurring: m.isRecurring,
        notes: m.notes || undefined,
      };

      this.expensesService.update(this.data.expense!.id, dto).subscribe({
        next: (expense) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(expense);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Update expense failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
      });
    }
  }
}
