import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { form, FormField, required, email } from '@angular/forms/signals';
import { SuppliersService } from '../../core/services/suppliers.service';
import {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../../core/models/supplier.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  supplier?: Supplier;
}

interface SupplierFormModel {
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  isActive: boolean;
}

@Component({
  selector: 'app-supplier-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    FormField,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>local_shipping</mat-icon>
      {{
        data.mode === 'create'
          ? ('suppliers.newSupplier' | translate)
          : ('suppliers.editSupplier' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.name' | translate }}</mat-label>
          <input matInput [formField]="supplierForm.name" />
          @if (supplierForm.name().invalid() && supplierForm.name().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.contact' | translate }}</mat-label>
          <input matInput [formField]="supplierForm.contact" />
          @if (supplierForm.contact().invalid() && supplierForm.contact().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.phone' | translate }}</mat-label>
          <input matInput [formField]="supplierForm.phone" />
          @if (supplierForm.phone().invalid() && supplierForm.phone().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.email' | translate }}</mat-label>
          <input matInput type="email" [formField]="supplierForm.email" />
          @if (supplierForm.email().invalid() && supplierForm.email().touched()) {
            <mat-error>{{ t('validation.invalidEmail') }}</mat-error>
          }
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>{{ 'suppliers.address' | translate }}</mat-label>
        <input matInput [formField]="supplierForm.address" />
        @if (supplierForm.address().invalid() && supplierForm.address().touched()) {
          <mat-error>{{ t('validation.required') }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>{{ 'suppliers.notes' | translate }}</mat-label>
        <textarea matInput [formField]="supplierForm.notes" rows="3"></textarea>
      </mat-form-field>

      <mat-checkbox [formField]="supplierForm.isActive">
        {{ 'suppliers.activeSupplier' | translate }}
      </mat-checkbox>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="saving() || supplierForm().invalid()"
      >
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class SupplierFormComponent {
  private readonly dialogRef = inject(MatDialogRef<SupplierFormComponent>);
  private readonly suppliersService = inject(SuppliersService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly model = signal<SupplierFormModel>({
    name: this.data.supplier?.name || '',
    contact: this.data.supplier?.contact || '',
    phone: this.data.supplier?.phone || '',
    email: this.data.supplier?.email || '',
    address: this.data.supplier?.address || '',
    notes: this.data.supplier?.notes || '',
    isActive: this.data.supplier?.isActive ?? true,
  });
  readonly supplierForm = form(this.model, (p) => {
    required(p.name, { message: 'validation.required' });
    required(p.contact, { message: 'validation.required' });
    required(p.phone, { message: 'validation.required' });
    required(p.address, { message: 'validation.required' });
    email(p.email, { message: 'validation.invalidEmail' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.supplierForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();

    if (this.data.mode === 'create') {
      const dto: CreateSupplierDto = {
        name: m.name,
        contact: m.contact,
        phone: m.phone,
        email: m.email || undefined,
        address: m.address,
        notes: m.notes || undefined,
        isActive: m.isActive,
      };

      this.suppliersService.create(dto).subscribe({
        next: (supplier) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(supplier);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Create supplier failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
    } else {
      const dto: UpdateSupplierDto = {
        name: m.name,
        contact: m.contact,
        phone: m.phone,
        email: m.email || undefined,
        address: m.address,
        notes: m.notes || undefined,
        isActive: m.isActive,
      };

      this.suppliersService.update(this.data.supplier!.id, dto).subscribe({
        next: (supplier) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(supplier);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Update supplier failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
      });
    }
  }
}
