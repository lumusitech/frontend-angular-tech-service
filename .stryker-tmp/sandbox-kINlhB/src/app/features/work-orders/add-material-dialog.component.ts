// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { Supplier } from '../../core/models/supplier.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  workOrderId: string;
}
@Component({
  selector: 'app-add-material-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>build</mat-icon>
      {{ 'workOrders.materials.addMaterial' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
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
            <mat-option>{{ 'workOrders.materials.noSupplier' | translate }}</mat-option>
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
            : ('workOrders.materials.saveMaterial' | translate)
        }}
      </button>
    </mat-dialog-actions>
  `
})
export class AddMaterialDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddMaterialDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly description = signal(stryMutAct_9fa48("5307") ? "Stryker was here!" : (stryCov_9fa48("5307"), ''));
  readonly quantity = signal(1);
  readonly unitCost = signal(0);
  readonly supplierId = signal(stryMutAct_9fa48("5308") ? "Stryker was here!" : (stryCov_9fa48("5308"), ''));
  readonly saving = signal(stryMutAct_9fa48("5309") ? true : (stryCov_9fa48("5309"), false));
  readonly suppliersResource = httpResource<PaginatedResponse<Supplier>>(stryMutAct_9fa48("5310") ? () => undefined : (stryCov_9fa48("5310"), () => stryMutAct_9fa48("5311") ? {} : (stryCov_9fa48("5311"), {
    url: stryMutAct_9fa48("5312") ? "" : (stryCov_9fa48("5312"), '/api/suppliers?limit=100')
  })));
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("5313")) {
      {}
    } else {
      stryCov_9fa48("5313");
      return (event.target as HTMLInputElement).value;
    }
  }
  onSubmit(event: Event): void {
    if (stryMutAct_9fa48("5314")) {
      {}
    } else {
      stryCov_9fa48("5314");
      event.preventDefault();
      if (stryMutAct_9fa48("5317") ? !this.description() && this.quantity() <= 0 : stryMutAct_9fa48("5316") ? false : stryMutAct_9fa48("5315") ? true : (stryCov_9fa48("5315", "5316", "5317"), (stryMutAct_9fa48("5318") ? this.description() : (stryCov_9fa48("5318"), !this.description())) || (stryMutAct_9fa48("5321") ? this.quantity() > 0 : stryMutAct_9fa48("5320") ? this.quantity() < 0 : stryMutAct_9fa48("5319") ? false : (stryCov_9fa48("5319", "5320", "5321"), this.quantity() <= 0)))) return;
      this.saving.set(stryMutAct_9fa48("5322") ? false : (stryCov_9fa48("5322"), true));
      this.workOrdersService.addMaterial(this.data.workOrderId, stryMutAct_9fa48("5323") ? {} : (stryCov_9fa48("5323"), {
        description: this.description(),
        quantity: this.quantity(),
        unitCost: this.unitCost(),
        supplierId: stryMutAct_9fa48("5326") ? this.supplierId() && undefined : stryMutAct_9fa48("5325") ? false : stryMutAct_9fa48("5324") ? true : (stryCov_9fa48("5324", "5325", "5326"), this.supplierId() || undefined)
      })).subscribe(stryMutAct_9fa48("5327") ? {} : (stryCov_9fa48("5327"), {
        next: () => {
          if (stryMutAct_9fa48("5328")) {
            {}
          } else {
            stryCov_9fa48("5328");
            this.saving.set(stryMutAct_9fa48("5329") ? true : (stryCov_9fa48("5329"), false));
            this.dialogRef.close(stryMutAct_9fa48("5330") ? false : (stryCov_9fa48("5330"), true));
          }
        },
        error: () => {
          if (stryMutAct_9fa48("5331")) {
            {}
          } else {
            stryCov_9fa48("5331");
            this.saving.set(stryMutAct_9fa48("5332") ? true : (stryCov_9fa48("5332"), false));
          }
        }
      }));
    }
  }
}