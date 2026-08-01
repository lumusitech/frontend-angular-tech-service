import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { form, FormField, required } from '@angular/forms/signals';
import { PaymentsService } from '../../core/services/payments.service';
import {
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentMethod,
} from '../../core/models/payment.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { toLocalDateString } from '../../core/utils/date.utils';

interface DialogData {
  mode: 'create' | 'edit';
  payment?: Payment;
  workOrderId?: string;
}

interface PaymentFormModel {
  amount: string;
  method: PaymentMethod;
  provider: string;
  description: string;
  installmentNumber: string;
  totalInstallments: string;
}

@Component({
  selector: 'app-payment-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormField,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>payment</mat-icon>
      {{
        data.mode === 'create'
          ? ('payments.newPayment' | translate)
          : ('payments.editPayment' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'payments.amount' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [formField]="paymentForm.amount"
              step="0.01"
            />
            @if (paymentForm.amount().invalid() && paymentForm.amount().touched()) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'payments.method' | translate }}</mat-label>
            <mat-select [formField]="paymentForm.method">
              <mat-option value="cash">{{ 'payments.methods.cash' | translate }}</mat-option>
              <mat-option value="transfer">{{ 'payments.methods.transfer' | translate }}</mat-option>
              <mat-option value="credit_card">{{ 'payments.methods.creditCard' | translate }}</mat-option>
              <mat-option value="debit_card">{{ 'payments.methods.debitCard' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'payments.provider' | translate }}</mat-label>
          <input
            matInput
            [formField]="paymentForm.provider"
          />
          @if (paymentForm.provider().invalid() && paymentForm.provider().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'payments.description' | translate }}</mat-label>
          <textarea
            matInput
            [formField]="paymentForm.description"
            rows="2"
          ></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'payments.installmentNumber' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [formField]="paymentForm.installmentNumber"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'payments.totalInstallments' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [formField]="paymentForm.totalInstallments"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'payments.dueDate' | translate }}</mat-label>
          <input
            matInput
            [matDatepicker]="dueDatePicker"
            [value]="dueDateValue()"
            (dateChange)="dueDateValue.set($any($event).value)"
            (click)="dueDatePicker.open()"
          />
          <mat-datepicker-toggle matIconSuffix [for]="dueDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #dueDatePicker></mat-datepicker>
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="saving() || paymentForm().invalid()">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class PaymentFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PaymentFormComponent>);
  private readonly paymentsService = inject(PaymentsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly dueDateValue = signal<Date | null>(
    this.data.payment?.dueDate ? new Date(this.data.payment.dueDate) : null
  );

  readonly model = signal<PaymentFormModel>({
    amount: this.data.payment?.amount?.toString() || '',
    method: this.data.payment?.method || 'cash',
    provider: this.data.payment?.provider || '',
    description: this.data.payment?.description || '',
    installmentNumber: this.data.payment?.installmentNumber?.toString() || '',
    totalInstallments: this.data.payment?.totalInstallments?.toString() || '',
  });
  readonly paymentForm = form(this.model, (p) => {
    required(p.amount, { message: 'validation.invalidAmount' });
    required(p.method, { message: 'validation.required' });
    required(p.provider, { message: 'validation.required' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.paymentForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();

    if (this.data.mode === 'create') {
      const dto: CreatePaymentDto = {
        amount: parseFloat(m.amount),
        method: m.method,
        provider: m.provider,
        description: m.description || undefined,
        installmentNumber: m.installmentNumber ? parseInt(m.installmentNumber) : undefined,
        totalInstallments: m.totalInstallments ? parseInt(m.totalInstallments) : undefined,
        dueDate: this.dueDateValue() ? toLocalDateString(this.dueDateValue()!) : undefined,
      };

      const workOrderId = this.data.workOrderId || this.data.payment?.workOrder?.id;
      if (!workOrderId) {
        this.saving.set(false);
        this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        return;
      }

      this.paymentsService.create(workOrderId, dto).subscribe({
        next: (payment) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(payment);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Create payment failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
    } else {
      const dto: UpdatePaymentDto = {
        amount: parseFloat(m.amount),
        method: m.method,
        provider: m.provider,
        description: m.description || undefined,
        installmentNumber: m.installmentNumber ? parseInt(m.installmentNumber) : undefined,
        totalInstallments: m.totalInstallments ? parseInt(m.totalInstallments) : undefined,
        dueDate: this.dueDateValue() ? toLocalDateString(this.dueDateValue()!) : undefined,
      };

      this.paymentsService.update(this.data.payment!.id, dto).subscribe({
        next: (payment) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(payment);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Update payment failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
      });
    }
  }
}
