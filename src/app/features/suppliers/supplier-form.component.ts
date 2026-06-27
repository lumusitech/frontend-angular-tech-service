import { Component, inject, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
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
      <form (submit)="onSubmit($event)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.name' | translate }}</mat-label>
            <input
              matInput
              [value]="name()"
              (input)="name.set(getInputValue($event))"
              (blur)="nameTouched.set(true)"
              required
            />
            @if (nameTouched() && !nameValid()) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.contact' | translate }}</mat-label>
            <input
              matInput
              [value]="contact()"
              (input)="contact.set(getInputValue($event))"
              (blur)="contactTouched.set(true)"
              required
            />
            @if (contactTouched() && !contactValid()) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.phone' | translate }}</mat-label>
            <input
              matInput
              [value]="phone()"
              (input)="phone.set(getInputValue($event))"
              (blur)="phoneTouched.set(true)"
              required
            />
            @if (phoneTouched() && !phoneValid()) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'suppliers.email' | translate }}</mat-label>
            <input
              matInput
              type="email"
              [value]="email()"
              (input)="email.set(getInputValue($event))"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.address' | translate }}</mat-label>
          <input
            matInput
            [value]="address()"
            (input)="address.set(getInputValue($event))"
            (blur)="addressTouched.set(true)"
            required
          />
          @if (addressTouched() && !addressValid()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.notes' | translate }}</mat-label>
          <textarea
            matInput
            [value]="notes()"
            (input)="notes.set(getInputValue($event))"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-checkbox [checked]="isActive()" (change)="isActive.set($event.checked)">
          {{ 'suppliers.activeSupplier' | translate }}
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving() || !isFormValid()">
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

  readonly name = signal(this.data.supplier?.name || '');
  readonly contact = signal(this.data.supplier?.contact || '');
  readonly phone = signal(this.data.supplier?.phone || '');
  readonly email = signal(this.data.supplier?.email || '');
  readonly address = signal(this.data.supplier?.address || '');
  readonly notes = signal(this.data.supplier?.notes || '');
  readonly isActive = signal(this.data.supplier?.isActive ?? true);
  readonly saving = signal(false);

  readonly nameTouched = signal(false);
  readonly contactTouched = signal(false);
  readonly phoneTouched = signal(false);
  readonly addressTouched = signal(false);

  readonly nameValid = computed(() => this.name().trim().length > 0);
  readonly contactValid = computed(() => this.contact().trim().length > 0);
  readonly phoneValid = computed(() => this.phone().trim().length > 0);
  readonly addressValid = computed(() => this.address().trim().length > 0);
  readonly isFormValid = computed(() =>
    this.nameValid() && this.contactValid() && this.phoneValid() && this.addressValid()
  );

  t(key: string): string {
    return this.translationService.instant(key);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.saving.set(true);

    if (this.data.mode === 'create') {
      const dto: CreateSupplierDto = {
        name: this.name(),
        contact: this.contact(),
        phone: this.phone(),
        email: this.email() || undefined,
        address: this.address(),
        notes: this.notes() || undefined,
        isActive: this.isActive(),
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
        name: this.name(),
        contact: this.contact(),
        phone: this.phone(),
        email: this.email() || undefined,
        address: this.address(),
        notes: this.notes() || undefined,
        isActive: this.isActive(),
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
