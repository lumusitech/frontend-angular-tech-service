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
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { SuppliersService } from '../../core/services/suppliers.service';
import { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../../core/models/supplier.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  mode: 'create' | 'edit';
  supplier?: Supplier;
}
@Component({
  selector: 'app-supplier-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, FormsModule, TranslatePipe],
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
  `
})
export class SupplierFormComponent {
  private readonly dialogRef = inject(MatDialogRef<SupplierFormComponent>);
  private readonly suppliersService = inject(SuppliersService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  name = stryMutAct_9fa48("4648") ? this.data.supplier?.name && '' : stryMutAct_9fa48("4647") ? false : stryMutAct_9fa48("4646") ? true : (stryCov_9fa48("4646", "4647", "4648"), (stryMutAct_9fa48("4649") ? this.data.supplier.name : (stryCov_9fa48("4649"), this.data.supplier?.name)) || (stryMutAct_9fa48("4650") ? "Stryker was here!" : (stryCov_9fa48("4650"), '')));
  contact = stryMutAct_9fa48("4653") ? this.data.supplier?.contact && '' : stryMutAct_9fa48("4652") ? false : stryMutAct_9fa48("4651") ? true : (stryCov_9fa48("4651", "4652", "4653"), (stryMutAct_9fa48("4654") ? this.data.supplier.contact : (stryCov_9fa48("4654"), this.data.supplier?.contact)) || (stryMutAct_9fa48("4655") ? "Stryker was here!" : (stryCov_9fa48("4655"), '')));
  phone = stryMutAct_9fa48("4658") ? this.data.supplier?.phone && '' : stryMutAct_9fa48("4657") ? false : stryMutAct_9fa48("4656") ? true : (stryCov_9fa48("4656", "4657", "4658"), (stryMutAct_9fa48("4659") ? this.data.supplier.phone : (stryCov_9fa48("4659"), this.data.supplier?.phone)) || (stryMutAct_9fa48("4660") ? "Stryker was here!" : (stryCov_9fa48("4660"), '')));
  email = stryMutAct_9fa48("4663") ? this.data.supplier?.email && '' : stryMutAct_9fa48("4662") ? false : stryMutAct_9fa48("4661") ? true : (stryCov_9fa48("4661", "4662", "4663"), (stryMutAct_9fa48("4664") ? this.data.supplier.email : (stryCov_9fa48("4664"), this.data.supplier?.email)) || (stryMutAct_9fa48("4665") ? "Stryker was here!" : (stryCov_9fa48("4665"), '')));
  address = stryMutAct_9fa48("4668") ? this.data.supplier?.address && '' : stryMutAct_9fa48("4667") ? false : stryMutAct_9fa48("4666") ? true : (stryCov_9fa48("4666", "4667", "4668"), (stryMutAct_9fa48("4669") ? this.data.supplier.address : (stryCov_9fa48("4669"), this.data.supplier?.address)) || (stryMutAct_9fa48("4670") ? "Stryker was here!" : (stryCov_9fa48("4670"), '')));
  notes = stryMutAct_9fa48("4673") ? this.data.supplier?.notes && '' : stryMutAct_9fa48("4672") ? false : stryMutAct_9fa48("4671") ? true : (stryCov_9fa48("4671", "4672", "4673"), (stryMutAct_9fa48("4674") ? this.data.supplier.notes : (stryCov_9fa48("4674"), this.data.supplier?.notes)) || (stryMutAct_9fa48("4675") ? "Stryker was here!" : (stryCov_9fa48("4675"), '')));
  isActive = stryMutAct_9fa48("4676") ? this.data.supplier?.isActive && true : (stryCov_9fa48("4676"), (stryMutAct_9fa48("4677") ? this.data.supplier.isActive : (stryCov_9fa48("4677"), this.data.supplier?.isActive)) ?? (stryMutAct_9fa48("4678") ? false : (stryCov_9fa48("4678"), true)));
  readonly saving = signal(stryMutAct_9fa48("4679") ? true : (stryCov_9fa48("4679"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("4680")) {
      {}
    } else {
      stryCov_9fa48("4680");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("4681")) {
      {}
    } else {
      stryCov_9fa48("4681");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("4683") ? false : stryMutAct_9fa48("4682") ? true : (stryCov_9fa48("4682", "4683"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("4684") ? false : (stryCov_9fa48("4684"), true));
      if (stryMutAct_9fa48("4687") ? this.data.mode !== 'create' : stryMutAct_9fa48("4686") ? false : stryMutAct_9fa48("4685") ? true : (stryCov_9fa48("4685", "4686", "4687"), this.data.mode === (stryMutAct_9fa48("4688") ? "" : (stryCov_9fa48("4688"), 'create')))) {
        if (stryMutAct_9fa48("4689")) {
          {}
        } else {
          stryCov_9fa48("4689");
          const dto: CreateSupplierDto = stryMutAct_9fa48("4690") ? {} : (stryCov_9fa48("4690"), {
            name: this.name,
            contact: this.contact,
            phone: this.phone,
            email: stryMutAct_9fa48("4693") ? this.email && undefined : stryMutAct_9fa48("4692") ? false : stryMutAct_9fa48("4691") ? true : (stryCov_9fa48("4691", "4692", "4693"), this.email || undefined),
            address: this.address,
            notes: stryMutAct_9fa48("4696") ? this.notes && undefined : stryMutAct_9fa48("4695") ? false : stryMutAct_9fa48("4694") ? true : (stryCov_9fa48("4694", "4695", "4696"), this.notes || undefined),
            isActive: this.isActive
          });
          this.suppliersService.create(dto).subscribe(stryMutAct_9fa48("4697") ? {} : (stryCov_9fa48("4697"), {
            next: supplier => {
              if (stryMutAct_9fa48("4698")) {
                {}
              } else {
                stryCov_9fa48("4698");
                this.saving.set(stryMutAct_9fa48("4699") ? true : (stryCov_9fa48("4699"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("4700") ? "" : (stryCov_9fa48("4700"), 'common.toast.created')), stryMutAct_9fa48("4701") ? "" : (stryCov_9fa48("4701"), 'success'));
                this.dialogRef.close(supplier);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("4702")) {
                {}
              } else {
                stryCov_9fa48("4702");
                this.saving.set(stryMutAct_9fa48("4703") ? true : (stryCov_9fa48("4703"), false));
                console.error(stryMutAct_9fa48("4704") ? "" : (stryCov_9fa48("4704"), 'Create supplier failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("4705") ? "" : (stryCov_9fa48("4705"), 'common.toast.errorCreated')), stryMutAct_9fa48("4706") ? "" : (stryCov_9fa48("4706"), 'error'));
              }
            }
          }));
        }
      } else {
        if (stryMutAct_9fa48("4707")) {
          {}
        } else {
          stryCov_9fa48("4707");
          const dto: UpdateSupplierDto = stryMutAct_9fa48("4708") ? {} : (stryCov_9fa48("4708"), {
            name: this.name,
            contact: this.contact,
            phone: this.phone,
            email: stryMutAct_9fa48("4711") ? this.email && undefined : stryMutAct_9fa48("4710") ? false : stryMutAct_9fa48("4709") ? true : (stryCov_9fa48("4709", "4710", "4711"), this.email || undefined),
            address: this.address,
            notes: stryMutAct_9fa48("4714") ? this.notes && undefined : stryMutAct_9fa48("4713") ? false : stryMutAct_9fa48("4712") ? true : (stryCov_9fa48("4712", "4713", "4714"), this.notes || undefined),
            isActive: this.isActive
          });
          this.suppliersService.update(this.data.supplier!.id, dto).subscribe(stryMutAct_9fa48("4715") ? {} : (stryCov_9fa48("4715"), {
            next: supplier => {
              if (stryMutAct_9fa48("4716")) {
                {}
              } else {
                stryCov_9fa48("4716");
                this.saving.set(stryMutAct_9fa48("4717") ? true : (stryCov_9fa48("4717"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("4718") ? "" : (stryCov_9fa48("4718"), 'common.toast.updated')), stryMutAct_9fa48("4719") ? "" : (stryCov_9fa48("4719"), 'success'));
                this.dialogRef.close(supplier);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("4720")) {
                {}
              } else {
                stryCov_9fa48("4720");
                this.saving.set(stryMutAct_9fa48("4721") ? true : (stryCov_9fa48("4721"), false));
                console.error(stryMutAct_9fa48("4722") ? "" : (stryCov_9fa48("4722"), 'Update supplier failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("4723") ? "" : (stryCov_9fa48("4723"), 'common.toast.errorUpdated')), stryMutAct_9fa48("4724") ? "" : (stryCov_9fa48("4724"), 'error'));
              }
            }
          }));
        }
      }
    }
  }
}