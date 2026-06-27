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
import { FormsModule, NgForm } from '@angular/forms';
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
    FormsModule,
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
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.description' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="description"
            name="description"
            #descriptionRef="ngModel"
            required
          />
          @if (descriptionRef.invalid && descriptionRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'expenses.amount' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="amount"
              name="amount"
              #amountRef="ngModel"
              min="0.01"
              step="0.01"
              required
            />
            @if (amountRef.invalid && amountRef.touched) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'expenses.date' | translate }}</mat-label>
            <input
              matInput
              [matDatepicker]="datePicker"
              [(ngModel)]="dateValue"
              name="date"
              #dateRef="ngModel"
              (click)="datePicker.open()"
              required
            />
            <mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
            @if (dateRef.invalid && dateRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.category' | translate }}</mat-label>
          <mat-select [(ngModel)]="category" name="category" required>
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
            [(ngModel)]="notes"
            name="notes"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-checkbox [(ngModel)]="isRecurring" name="isRecurring">
          {{ 'expenses.recurringExpense' | translate }}
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event, formRef)" [disabled]="saving() || formRef.invalid">
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

  description = this.data.expense?.description || '';
  amount = this.data.expense?.amount?.toString() || '';
  dateValue: Date | null = this.data.expense?.date ? new Date(this.data.expense.date) : new Date();
  category: ExpenseCategory = this.data.expense?.category || 'other';
  notes = this.data.expense?.notes || '';
  isRecurring = this.data.expense?.isRecurring ?? false;
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(event: Event, form: NgForm): void {
    event.preventDefault();
    form.control.markAllAsTouched();

    if (form.invalid) return;

    this.saving.set(true);

    const dateStr = this.dateValue ? toLocalDateString(this.dateValue) : '';

    if (this.data.mode === 'create') {
      const dto: CreateExpenseDto = {
        description: this.description,
        amount: parseFloat(this.amount),
        date: dateStr,
        category: this.category,
        isRecurring: this.isRecurring,
        notes: this.notes || undefined,
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
        description: this.description,
        amount: parseFloat(this.amount),
        date: dateStr,
        category: this.category,
        isRecurring: this.isRecurring,
        notes: this.notes || undefined,
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
