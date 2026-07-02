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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PaymentsService } from '../../core/services/payments.service';
import { Payment, CreatePaymentDto, UpdatePaymentDto, PaymentMethod } from '../../core/models/payment.interfaces';
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
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, FormsModule, TranslatePipe],
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
  `
})
export class PaymentFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PaymentFormComponent>);
  private readonly paymentsService = inject(PaymentsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  amount = stryMutAct_9fa48("2963") ? this.data.payment?.amount?.toString() && '' : stryMutAct_9fa48("2962") ? false : stryMutAct_9fa48("2961") ? true : (stryCov_9fa48("2961", "2962", "2963"), (stryMutAct_9fa48("2965") ? this.data.payment.amount?.toString() : stryMutAct_9fa48("2964") ? this.data.payment?.amount.toString() : (stryCov_9fa48("2964", "2965"), this.data.payment?.amount?.toString())) || (stryMutAct_9fa48("2966") ? "Stryker was here!" : (stryCov_9fa48("2966"), '')));
  method: PaymentMethod = stryMutAct_9fa48("2969") ? this.data.payment?.method && 'cash' : stryMutAct_9fa48("2968") ? false : stryMutAct_9fa48("2967") ? true : (stryCov_9fa48("2967", "2968", "2969"), (stryMutAct_9fa48("2970") ? this.data.payment.method : (stryCov_9fa48("2970"), this.data.payment?.method)) || (stryMutAct_9fa48("2971") ? "" : (stryCov_9fa48("2971"), 'cash')));
  provider = stryMutAct_9fa48("2974") ? this.data.payment?.provider && '' : stryMutAct_9fa48("2973") ? false : stryMutAct_9fa48("2972") ? true : (stryCov_9fa48("2972", "2973", "2974"), (stryMutAct_9fa48("2975") ? this.data.payment.provider : (stryCov_9fa48("2975"), this.data.payment?.provider)) || (stryMutAct_9fa48("2976") ? "Stryker was here!" : (stryCov_9fa48("2976"), '')));
  description = stryMutAct_9fa48("2979") ? this.data.payment?.description && '' : stryMutAct_9fa48("2978") ? false : stryMutAct_9fa48("2977") ? true : (stryCov_9fa48("2977", "2978", "2979"), (stryMutAct_9fa48("2980") ? this.data.payment.description : (stryCov_9fa48("2980"), this.data.payment?.description)) || (stryMutAct_9fa48("2981") ? "Stryker was here!" : (stryCov_9fa48("2981"), '')));
  installmentNumber = stryMutAct_9fa48("2984") ? this.data.payment?.installmentNumber?.toString() && '' : stryMutAct_9fa48("2983") ? false : stryMutAct_9fa48("2982") ? true : (stryCov_9fa48("2982", "2983", "2984"), (stryMutAct_9fa48("2986") ? this.data.payment.installmentNumber?.toString() : stryMutAct_9fa48("2985") ? this.data.payment?.installmentNumber.toString() : (stryCov_9fa48("2985", "2986"), this.data.payment?.installmentNumber?.toString())) || (stryMutAct_9fa48("2987") ? "Stryker was here!" : (stryCov_9fa48("2987"), '')));
  totalInstallments = stryMutAct_9fa48("2990") ? this.data.payment?.totalInstallments?.toString() && '' : stryMutAct_9fa48("2989") ? false : stryMutAct_9fa48("2988") ? true : (stryCov_9fa48("2988", "2989", "2990"), (stryMutAct_9fa48("2992") ? this.data.payment.totalInstallments?.toString() : stryMutAct_9fa48("2991") ? this.data.payment?.totalInstallments.toString() : (stryCov_9fa48("2991", "2992"), this.data.payment?.totalInstallments?.toString())) || (stryMutAct_9fa48("2993") ? "Stryker was here!" : (stryCov_9fa48("2993"), '')));
  dueDateValue: Date | null = (stryMutAct_9fa48("2994") ? this.data.payment.dueDate : (stryCov_9fa48("2994"), this.data.payment?.dueDate)) ? new Date(this.data.payment.dueDate) : null;
  readonly saving = signal(stryMutAct_9fa48("2995") ? true : (stryCov_9fa48("2995"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("2996")) {
      {}
    } else {
      stryCov_9fa48("2996");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("2997")) {
      {}
    } else {
      stryCov_9fa48("2997");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("2999") ? false : stryMutAct_9fa48("2998") ? true : (stryCov_9fa48("2998", "2999"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("3000") ? false : (stryCov_9fa48("3000"), true));
      if (stryMutAct_9fa48("3003") ? this.data.mode !== 'create' : stryMutAct_9fa48("3002") ? false : stryMutAct_9fa48("3001") ? true : (stryCov_9fa48("3001", "3002", "3003"), this.data.mode === (stryMutAct_9fa48("3004") ? "" : (stryCov_9fa48("3004"), 'create')))) {
        if (stryMutAct_9fa48("3005")) {
          {}
        } else {
          stryCov_9fa48("3005");
          const dto: CreatePaymentDto = stryMutAct_9fa48("3006") ? {} : (stryCov_9fa48("3006"), {
            amount: parseFloat(this.amount),
            method: this.method,
            provider: this.provider,
            description: stryMutAct_9fa48("3009") ? this.description && undefined : stryMutAct_9fa48("3008") ? false : stryMutAct_9fa48("3007") ? true : (stryCov_9fa48("3007", "3008", "3009"), this.description || undefined),
            installmentNumber: this.installmentNumber ? parseInt(this.installmentNumber) : undefined,
            totalInstallments: this.totalInstallments ? parseInt(this.totalInstallments) : undefined,
            dueDate: this.dueDateValue ? this.dueDateValue.toISOString().split(stryMutAct_9fa48("3010") ? "" : (stryCov_9fa48("3010"), 'T'))[0] : undefined
          });
          const workOrderId = stryMutAct_9fa48("3013") ? this.data.workOrderId && this.data.payment?.workOrder?.id : stryMutAct_9fa48("3012") ? false : stryMutAct_9fa48("3011") ? true : (stryCov_9fa48("3011", "3012", "3013"), this.data.workOrderId || (stryMutAct_9fa48("3015") ? this.data.payment.workOrder?.id : stryMutAct_9fa48("3014") ? this.data.payment?.workOrder.id : (stryCov_9fa48("3014", "3015"), this.data.payment?.workOrder?.id)));
          if (stryMutAct_9fa48("3018") ? false : stryMutAct_9fa48("3017") ? true : stryMutAct_9fa48("3016") ? workOrderId : (stryCov_9fa48("3016", "3017", "3018"), !workOrderId)) {
            if (stryMutAct_9fa48("3019")) {
              {}
            } else {
              stryCov_9fa48("3019");
              this.saving.set(stryMutAct_9fa48("3020") ? true : (stryCov_9fa48("3020"), false));
              this.toastService.show(this.t(stryMutAct_9fa48("3021") ? "" : (stryCov_9fa48("3021"), 'common.toast.errorCreated')), stryMutAct_9fa48("3022") ? "" : (stryCov_9fa48("3022"), 'error'));
              return;
            }
          }
          this.paymentsService.create(workOrderId, dto).subscribe(stryMutAct_9fa48("3023") ? {} : (stryCov_9fa48("3023"), {
            next: payment => {
              if (stryMutAct_9fa48("3024")) {
                {}
              } else {
                stryCov_9fa48("3024");
                this.saving.set(stryMutAct_9fa48("3025") ? true : (stryCov_9fa48("3025"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("3026") ? "" : (stryCov_9fa48("3026"), 'common.toast.created')), stryMutAct_9fa48("3027") ? "" : (stryCov_9fa48("3027"), 'success'));
                this.dialogRef.close(payment);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("3028")) {
                {}
              } else {
                stryCov_9fa48("3028");
                this.saving.set(stryMutAct_9fa48("3029") ? true : (stryCov_9fa48("3029"), false));
                console.error(stryMutAct_9fa48("3030") ? "" : (stryCov_9fa48("3030"), 'Create payment failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("3031") ? "" : (stryCov_9fa48("3031"), 'common.toast.errorCreated')), stryMutAct_9fa48("3032") ? "" : (stryCov_9fa48("3032"), 'error'));
              }
            }
          }));
        }
      } else {
        if (stryMutAct_9fa48("3033")) {
          {}
        } else {
          stryCov_9fa48("3033");
          const dto: UpdatePaymentDto = stryMutAct_9fa48("3034") ? {} : (stryCov_9fa48("3034"), {
            amount: parseFloat(this.amount),
            method: this.method,
            provider: this.provider,
            description: stryMutAct_9fa48("3037") ? this.description && undefined : stryMutAct_9fa48("3036") ? false : stryMutAct_9fa48("3035") ? true : (stryCov_9fa48("3035", "3036", "3037"), this.description || undefined),
            installmentNumber: this.installmentNumber ? parseInt(this.installmentNumber) : undefined,
            totalInstallments: this.totalInstallments ? parseInt(this.totalInstallments) : undefined,
            dueDate: this.dueDateValue ? this.dueDateValue.toISOString().split(stryMutAct_9fa48("3038") ? "" : (stryCov_9fa48("3038"), 'T'))[0] : undefined
          });
          this.paymentsService.update(this.data.payment!.id, dto).subscribe(stryMutAct_9fa48("3039") ? {} : (stryCov_9fa48("3039"), {
            next: payment => {
              if (stryMutAct_9fa48("3040")) {
                {}
              } else {
                stryCov_9fa48("3040");
                this.saving.set(stryMutAct_9fa48("3041") ? true : (stryCov_9fa48("3041"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("3042") ? "" : (stryCov_9fa48("3042"), 'common.toast.updated')), stryMutAct_9fa48("3043") ? "" : (stryCov_9fa48("3043"), 'success'));
                this.dialogRef.close(payment);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("3044")) {
                {}
              } else {
                stryCov_9fa48("3044");
                this.saving.set(stryMutAct_9fa48("3045") ? true : (stryCov_9fa48("3045"), false));
                console.error(stryMutAct_9fa48("3046") ? "" : (stryCov_9fa48("3046"), 'Update payment failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("3047") ? "" : (stryCov_9fa48("3047"), 'common.toast.errorUpdated')), stryMutAct_9fa48("3048") ? "" : (stryCov_9fa48("3048"), 'error'));
              }
            }
          }));
        }
      }
    }
  }
}