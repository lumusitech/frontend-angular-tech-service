import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { SuppliersService } from '../../core/services/suppliers.service';
import {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../../core/models/supplier.interfaces';

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
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>local_shipping</mat-icon>
      {{ data.mode === 'create' ? 'Nuevo Proveedor' : 'Editar Proveedor' }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nombre</mat-label>
            <input matInput [value]="name()" (input)="name.set(getInputValue($event))" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Contacto</mat-label>
            <input
              matInput
              [value]="contact()"
              (input)="contact.set(getInputValue($event))"
              required
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Teléfono</mat-label>
            <input matInput [value]="phone()" (input)="phone.set(getInputValue($event))" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              [value]="email()"
              (input)="email.set(getInputValue($event))"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Dirección</mat-label>
          <input
            matInput
            [value]="address()"
            (input)="address.set(getInputValue($event))"
            required
          />
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

        <mat-checkbox [checked]="isActive()" (change)="isActive.set($event.checked)">
          Proveedor activo
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
export class SupplierFormComponent {
  private readonly dialogRef = inject(MatDialogRef<SupplierFormComponent>);
  private readonly suppliersService = inject(SuppliersService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly name = signal(this.data.supplier?.name || '');
  readonly contact = signal(this.data.supplier?.contact || '');
  readonly phone = signal(this.data.supplier?.phone || '');
  readonly email = signal(this.data.supplier?.email || '');
  readonly address = signal(this.data.supplier?.address || '');
  readonly notes = signal(this.data.supplier?.notes || '');
  readonly isActive = signal(this.data.supplier?.isActive ?? true);
  readonly saving = signal(false);

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
          this.dialogRef.close(supplier);
        },
        error: () => {
          this.saving.set(false);
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
          this.dialogRef.close(supplier);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    }
  }
}
