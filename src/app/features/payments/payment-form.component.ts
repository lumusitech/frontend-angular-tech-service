import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, NgForm } from '@angular/forms';
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

interface DialogData {
  mode: 'create' | 'edit';
  payment?: Payment;
  workOrderId?: string;
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
    FormsModule,
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
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'payments.amount' | translate }}</mat-label>
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
            <mat-label>{{ 'payments.method' | translate }}</mat-label>
            <mat-select [(ngModel)]="method" name="method" required>
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
            [(ngModel)]="provider"
            name="provider"
            #providerRef="ngModel"
            required
          />
          @if (providerRef.invalid && providerRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'payments.description' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="description"
            name="description"
            rows="2"
          ></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'payments.installmentNumber' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="installmentNumber"
              name="installmentNumber"
              min="1"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'payments.totalInstallments' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="totalInstallments"
              name="totalInstallments"
              min="1"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'payments.dueDate' | translate }}</mat-label>
          <input
            matInput
            [matDatepicker]="dueDatePicker"
            [(ngModel)]="dueDateValue"
            name="dueDate"
            (click)="dueDatePicker.open()"
          />
          <mat-datepicker-toggle matIconSuffix [for]="dueDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #dueDatePicker></mat-datepicker>
        </mat-form-field>
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
export class PaymentFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PaymentFormComponent>);
  private readonly paymentsService = inject(PaymentsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  amount = this.data.payment?.amount?.toString() || '';
  method: PaymentMethod = this.data.payment?.method || 'cash';
  provider = this.data.payment?.provider || '';
  description = this.data.payment?.description || '';
  installmentNumber = this.data.payment?.installmentNumber?.toString() || '';
  totalInstallments = this.data.payment?.totalInstallments?.toString() || '';
  dueDateValue: Date | null = this.data.payment?.dueDate ? new Date(this.data.payment.dueDate) : null;
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(event: Event, form: NgForm): void {
    event.preventDefault();
    form.control.markAllAsTouched();

    if (form.invalid) return;

    this.saving.set(true);

    if (this.data.mode === 'create') {
      const dto: CreatePaymentDto = {
        amount: parseFloat(this.amount),
        method: this.method,
        provider: this.provider,
        description: this.description || undefined,
        installmentNumber: this.installmentNumber ? parseInt(this.installmentNumber) : undefined,
        totalInstallments: this.totalInstallments ? parseInt(this.totalInstallments) : undefined,
        dueDate: this.dueDateValue ? this.dueDateValue.toISOString().split('T')[0] : undefined,
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
        amount: parseFloat(this.amount),
        method: this.method,
        provider: this.provider,
        description: this.description || undefined,
        installmentNumber: this.installmentNumber ? parseInt(this.installmentNumber) : undefined,
        totalInstallments: this.totalInstallments ? parseInt(this.totalInstallments) : undefined,
        dueDate: this.dueDateValue ? this.dueDateValue.toISOString().split('T')[0] : undefined,
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
