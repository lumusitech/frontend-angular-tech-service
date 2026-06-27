import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
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

@Component({
  selector: 'app-supplier-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
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
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.name' | translate }}</mat-label>
            <input
              matInput
              [(ngModel)]="name"
              name="name"
              #nameRef="ngModel"
              required
            />
            @if (nameRef.invalid && nameRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.contact' | translate }}</mat-label>
            <input
              matInput
              [(ngModel)]="contact"
              name="contact"
              #contactRef="ngModel"
              required
            />
            @if (contactRef.invalid && contactRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.phone' | translate }}</mat-label>
            <input
              matInput
              [(ngModel)]="phone"
              name="phone"
              #phoneRef="ngModel"
              required
            />
            @if (phoneRef.invalid && phoneRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.email' | translate }}</mat-label>
            <input
              matInput
              type="email"
              [(ngModel)]="email"
              name="email"
              #emailRef="ngModel"
              email
            />
            @if (emailRef.invalid && emailRef.touched) {
              <mat-error>{{ emailRef.hasError('required') ? ('validation.required' | translate) : ('validation.invalidEmail' | translate) }}</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.address' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="address"
            name="address"
            #addressRef="ngModel"
            required
          />
          @if (addressRef.invalid && addressRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.notes' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="notes"
            name="notes"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-checkbox [(ngModel)]="isActive" name="isActive">
          {{ 'suppliers.activeSupplier' | translate }}
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
export class SupplierFormComponent {
  private readonly dialogRef = inject(MatDialogRef<SupplierFormComponent>);
  private readonly suppliersService = inject(SuppliersService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  name = this.data.supplier?.name || '';
  contact = this.data.supplier?.contact || '';
  phone = this.data.supplier?.phone || '';
  email = this.data.supplier?.email || '';
  address = this.data.supplier?.address || '';
  notes = this.data.supplier?.notes || '';
  isActive = this.data.supplier?.isActive ?? true;
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
      const dto: CreateSupplierDto = {
        name: this.name,
        contact: this.contact,
        phone: this.phone,
        email: this.email || undefined,
        address: this.address,
        notes: this.notes || undefined,
        isActive: this.isActive,
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
        name: this.name,
        contact: this.contact,
        phone: this.phone,
        email: this.email || undefined,
        address: this.address,
        notes: this.notes || undefined,
        isActive: this.isActive,
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
