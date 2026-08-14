import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WorkOrderMaterial } from '../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { Supplier } from '../../core/models/supplier.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  workOrderId: string;
  material?: WorkOrderMaterial;
}

@Component({
  selector: 'app-add-material-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>{{ isEditing() ? 'edit' : 'build' }}</mat-icon>
      {{
        (isEditing() ? 'workOrders.materials.editMaterial' : 'workOrders.materials.addMaterial')
          | translate
      }}
    </h2>

    <mat-dialog-content class="p-6!">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.materials.description' | translate }}</mat-label>
          <input
            matInput
            [value]="description()"
            (input)="description.set(getInputValue($event))"
            [placeholder]="'workOrders.materials.descriptionPlaceholder' | translate"
          />
        </mat-form-field>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.materials.quantity' | translate }}</mat-label>
            <input
              matInput
              type="number"
              min="1"
              [value]="quantity()"
              (input)="quantity.set(+getInputValue($event))"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.materials.unitCost' | translate }}</mat-label>
            <input
              matInput
              type="number"
              min="0"
              step="0.01"
              [value]="unitCost()"
              (input)="unitCost.set(+getInputValue($event))"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.materials.supplierOptional' | translate }}</mat-label>
          <mat-select [value]="supplierId()" (selectionChange)="supplierId.set($event.value)">
            <mat-option [value]="''">{{
              'workOrders.materials.noSupplier' | translate
            }}</mat-option>
            @if (suppliersResource.hasValue()) {
              @for (supplier of suppliersResource.value().data; track supplier.id) {
                <mat-option [value]="supplier.id">{{ supplier.name }}</mat-option>
              }
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event)"
        [disabled]="saving() || !description() || quantity() <= 0"
      >
        {{
          saving()
            ? ('common.saving' | translate)
            : isEditing()
              ? ('workOrders.materials.updateMaterial' | translate)
              : ('workOrders.materials.saveMaterial' | translate)
        }}
      </button>
    </mat-dialog-actions>
  `,
})
export class AddMaterialDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddMaterialDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly isEditing = signal(!!this.data.material);
  readonly description = signal(this.data.material?.description || '');
  readonly quantity = signal(this.data.material?.quantity ?? 1);
  readonly unitCost = signal(this.data.material?.unitCost ?? 0);
  readonly supplierId = signal(this.data.material?.supplier?.id || '');
  readonly saving = signal(false);

  readonly suppliersResource = httpResource<PaginatedResponse<Supplier>>(() => ({
    url: '/api/suppliers?limit=100',
  }));

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.description() || this.quantity() <= 0) return;

    this.saving.set(true);

    const dto = {
      description: this.description(),
      quantity: this.quantity(),
      unitCost: this.unitCost(),
      supplierId: this.supplierId() || undefined,
    };

    const request$ =
      this.isEditing() && this.data.material
        ? this.workOrdersService.updateMaterial(this.data.workOrderId, this.data.material.id, dto)
        : this.workOrdersService.addMaterial(this.data.workOrderId, dto);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }
}
