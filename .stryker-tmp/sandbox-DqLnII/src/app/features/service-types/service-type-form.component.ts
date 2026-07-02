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
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ServiceType, CreateServiceTypeDto, UpdateServiceTypeDto } from '../../core/models/service-type.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  mode: 'create' | 'edit';
  serviceType?: ServiceType;
}
@Component({
  selector: 'app-service-type-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>build</mat-icon>
      {{
        data.mode === 'create'
          ? ('serviceTypes.newServiceType' | translate)
          : ('serviceTypes.editServiceType' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.name' | translate }}</mat-label>
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
          <mat-label>{{ 'serviceTypes.description' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="description"
            name="description"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.estimatedDurationLabel' | translate }}</mat-label>
          <input
            matInput
            type="number"
            [(ngModel)]="estimatedDuration"
            name="estimatedDuration"
            min="0"
          />
        </mat-form-field>

        <mat-checkbox [(ngModel)]="isActive" name="isActive">
          {{ 'serviceTypes.activeService' | translate }}
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
export class ServiceTypeFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ServiceTypeFormComponent>);
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  name = stryMutAct_9fa48("4156") ? this.data.serviceType?.name && '' : stryMutAct_9fa48("4155") ? false : stryMutAct_9fa48("4154") ? true : (stryCov_9fa48("4154", "4155", "4156"), (stryMutAct_9fa48("4157") ? this.data.serviceType.name : (stryCov_9fa48("4157"), this.data.serviceType?.name)) || (stryMutAct_9fa48("4158") ? "Stryker was here!" : (stryCov_9fa48("4158"), '')));
  description = stryMutAct_9fa48("4161") ? this.data.serviceType?.description && '' : stryMutAct_9fa48("4160") ? false : stryMutAct_9fa48("4159") ? true : (stryCov_9fa48("4159", "4160", "4161"), (stryMutAct_9fa48("4162") ? this.data.serviceType.description : (stryCov_9fa48("4162"), this.data.serviceType?.description)) || (stryMutAct_9fa48("4163") ? "Stryker was here!" : (stryCov_9fa48("4163"), '')));
  estimatedDuration = stryMutAct_9fa48("4166") ? this.data.serviceType?.estimatedDuration?.toString() && '' : stryMutAct_9fa48("4165") ? false : stryMutAct_9fa48("4164") ? true : (stryCov_9fa48("4164", "4165", "4166"), (stryMutAct_9fa48("4168") ? this.data.serviceType.estimatedDuration?.toString() : stryMutAct_9fa48("4167") ? this.data.serviceType?.estimatedDuration.toString() : (stryCov_9fa48("4167", "4168"), this.data.serviceType?.estimatedDuration?.toString())) || (stryMutAct_9fa48("4169") ? "Stryker was here!" : (stryCov_9fa48("4169"), '')));
  isActive = stryMutAct_9fa48("4170") ? this.data.serviceType?.isActive && true : (stryCov_9fa48("4170"), (stryMutAct_9fa48("4171") ? this.data.serviceType.isActive : (stryCov_9fa48("4171"), this.data.serviceType?.isActive)) ?? (stryMutAct_9fa48("4172") ? false : (stryCov_9fa48("4172"), true)));
  readonly saving = signal(stryMutAct_9fa48("4173") ? true : (stryCov_9fa48("4173"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("4174")) {
      {}
    } else {
      stryCov_9fa48("4174");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("4175")) {
      {}
    } else {
      stryCov_9fa48("4175");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("4177") ? false : stryMutAct_9fa48("4176") ? true : (stryCov_9fa48("4176", "4177"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("4178") ? false : (stryCov_9fa48("4178"), true));
      const duration = this.estimatedDuration ? parseInt(this.estimatedDuration, 10) : undefined;
      if (stryMutAct_9fa48("4181") ? this.data.mode !== 'create' : stryMutAct_9fa48("4180") ? false : stryMutAct_9fa48("4179") ? true : (stryCov_9fa48("4179", "4180", "4181"), this.data.mode === (stryMutAct_9fa48("4182") ? "" : (stryCov_9fa48("4182"), 'create')))) {
        if (stryMutAct_9fa48("4183")) {
          {}
        } else {
          stryCov_9fa48("4183");
          const dto: CreateServiceTypeDto = stryMutAct_9fa48("4184") ? {} : (stryCov_9fa48("4184"), {
            name: this.name,
            description: stryMutAct_9fa48("4187") ? this.description && undefined : stryMutAct_9fa48("4186") ? false : stryMutAct_9fa48("4185") ? true : (stryCov_9fa48("4185", "4186", "4187"), this.description || undefined),
            estimatedDuration: duration,
            isActive: this.isActive
          });
          this.serviceTypesService.create(dto).subscribe(stryMutAct_9fa48("4188") ? {} : (stryCov_9fa48("4188"), {
            next: serviceType => {
              if (stryMutAct_9fa48("4189")) {
                {}
              } else {
                stryCov_9fa48("4189");
                this.saving.set(stryMutAct_9fa48("4190") ? true : (stryCov_9fa48("4190"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("4191") ? "" : (stryCov_9fa48("4191"), 'common.toast.created')), stryMutAct_9fa48("4192") ? "" : (stryCov_9fa48("4192"), 'success'));
                this.dialogRef.close(serviceType);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("4193")) {
                {}
              } else {
                stryCov_9fa48("4193");
                this.saving.set(stryMutAct_9fa48("4194") ? true : (stryCov_9fa48("4194"), false));
                console.error(stryMutAct_9fa48("4195") ? "" : (stryCov_9fa48("4195"), 'Create service type failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("4196") ? "" : (stryCov_9fa48("4196"), 'common.toast.errorCreated')), stryMutAct_9fa48("4197") ? "" : (stryCov_9fa48("4197"), 'error'));
              }
            }
          }));
        }
      } else {
        if (stryMutAct_9fa48("4198")) {
          {}
        } else {
          stryCov_9fa48("4198");
          const dto: UpdateServiceTypeDto = stryMutAct_9fa48("4199") ? {} : (stryCov_9fa48("4199"), {
            name: this.name,
            description: stryMutAct_9fa48("4202") ? this.description && undefined : stryMutAct_9fa48("4201") ? false : stryMutAct_9fa48("4200") ? true : (stryCov_9fa48("4200", "4201", "4202"), this.description || undefined),
            estimatedDuration: duration,
            isActive: this.isActive
          });
          this.serviceTypesService.update(this.data.serviceType!.id, dto).subscribe(stryMutAct_9fa48("4203") ? {} : (stryCov_9fa48("4203"), {
            next: serviceType => {
              if (stryMutAct_9fa48("4204")) {
                {}
              } else {
                stryCov_9fa48("4204");
                this.saving.set(stryMutAct_9fa48("4205") ? true : (stryCov_9fa48("4205"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("4206") ? "" : (stryCov_9fa48("4206"), 'common.toast.updated')), stryMutAct_9fa48("4207") ? "" : (stryCov_9fa48("4207"), 'success'));
                this.dialogRef.close(serviceType);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("4208")) {
                {}
              } else {
                stryCov_9fa48("4208");
                this.saving.set(stryMutAct_9fa48("4209") ? true : (stryCov_9fa48("4209"), false));
                console.error(stryMutAct_9fa48("4210") ? "" : (stryCov_9fa48("4210"), 'Update service type failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("4211") ? "" : (stryCov_9fa48("4211"), 'common.toast.errorUpdated')), stryMutAct_9fa48("4212") ? "" : (stryCov_9fa48("4212"), 'error'));
              }
            }
          }));
        }
      }
    }
  }
}