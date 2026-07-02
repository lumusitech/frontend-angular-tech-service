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
import { FormsModule, NgForm } from '@angular/forms';
import { InquiriesService } from '../../core/services/inquiries.service';
import { Inquiry, InquirySource, CreateInquiryDto, UpdateInquiryDto } from '../../core/models/inquiry.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  mode: 'create' | 'edit';
  inquiry?: Inquiry;
}
@Component({
  selector: 'app-inquiry-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>help_outline</mat-icon>
      {{ data.mode === 'create' ? ('inquiries.newInquiry' | translate) : ('inquiries.editInquiry' | translate) }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.clientName' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="clientName"
            name="clientName"
            #clientNameRef="ngModel"
            required
          />
          @if (clientNameRef.invalid && clientNameRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.phone' | translate }}</mat-label>
            <input
              matInput
              [(ngModel)]="clientPhone"
              name="clientPhone"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.email' | translate }}</mat-label>
            <input
              matInput
              type="email"
              [(ngModel)]="clientEmail"
              name="clientEmail"
              #clientEmailRef="ngModel"
              email
            />
            @if (clientEmailRef.invalid && clientEmailRef.touched) {
              <mat-error>{{ clientEmailRef.hasError('required') ? ('validation.required' | translate) : ('validation.invalidEmail' | translate) }}</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.address' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="clientAddress"
            name="clientAddress"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.description' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="description"
            name="description"
            #descriptionRef="ngModel"
            rows="3"
            required
          ></textarea>
          @if (descriptionRef.invalid && descriptionRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.source' | translate }}</mat-label>
            <mat-select [(ngModel)]="source" name="source" #sourceRef="ngModel" required>
              <mat-option value="phone">{{ 'statusLabels.phone' | translate }}</mat-option>
              <mat-option value="whatsapp">{{ 'statusLabels.whatsapp' | translate }}</mat-option>
              <mat-option value="email">{{ 'statusLabels.email' | translate }}</mat-option>
              <mat-option value="walk_in">{{ 'statusLabels.walk_in' | translate }}</mat-option>
              <mat-option value="social_media">{{ 'statusLabels.social_media' | translate }}</mat-option>
              <mat-option value="referral">{{ 'statusLabels.referral' | translate }}</mat-option>
            </mat-select>
            @if (sourceRef.invalid && sourceRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.priority' | translate }}</mat-label>
            <mat-select [(ngModel)]="priority" name="priority">
              <mat-option value="low">{{ 'statusLabels.low' | translate }}</mat-option>
              <mat-option value="medium">{{ 'statusLabels.medium' | translate }}</mat-option>
              <mat-option value="high">{{ 'statusLabels.high' | translate }}</mat-option>
              <mat-option value="urgent">{{ 'statusLabels.urgent' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
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
export class InquiryFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  clientName = stryMutAct_9fa48("2712") ? this.data.inquiry?.clientName && '' : stryMutAct_9fa48("2711") ? false : stryMutAct_9fa48("2710") ? true : (stryCov_9fa48("2710", "2711", "2712"), (stryMutAct_9fa48("2713") ? this.data.inquiry.clientName : (stryCov_9fa48("2713"), this.data.inquiry?.clientName)) || (stryMutAct_9fa48("2714") ? "Stryker was here!" : (stryCov_9fa48("2714"), '')));
  clientPhone = stryMutAct_9fa48("2717") ? this.data.inquiry?.clientPhone && '' : stryMutAct_9fa48("2716") ? false : stryMutAct_9fa48("2715") ? true : (stryCov_9fa48("2715", "2716", "2717"), (stryMutAct_9fa48("2718") ? this.data.inquiry.clientPhone : (stryCov_9fa48("2718"), this.data.inquiry?.clientPhone)) || (stryMutAct_9fa48("2719") ? "Stryker was here!" : (stryCov_9fa48("2719"), '')));
  clientEmail = stryMutAct_9fa48("2722") ? this.data.inquiry?.clientEmail && '' : stryMutAct_9fa48("2721") ? false : stryMutAct_9fa48("2720") ? true : (stryCov_9fa48("2720", "2721", "2722"), (stryMutAct_9fa48("2723") ? this.data.inquiry.clientEmail : (stryCov_9fa48("2723"), this.data.inquiry?.clientEmail)) || (stryMutAct_9fa48("2724") ? "Stryker was here!" : (stryCov_9fa48("2724"), '')));
  clientAddress = stryMutAct_9fa48("2727") ? this.data.inquiry?.clientAddress && '' : stryMutAct_9fa48("2726") ? false : stryMutAct_9fa48("2725") ? true : (stryCov_9fa48("2725", "2726", "2727"), (stryMutAct_9fa48("2728") ? this.data.inquiry.clientAddress : (stryCov_9fa48("2728"), this.data.inquiry?.clientAddress)) || (stryMutAct_9fa48("2729") ? "Stryker was here!" : (stryCov_9fa48("2729"), '')));
  description = stryMutAct_9fa48("2732") ? this.data.inquiry?.description && '' : stryMutAct_9fa48("2731") ? false : stryMutAct_9fa48("2730") ? true : (stryCov_9fa48("2730", "2731", "2732"), (stryMutAct_9fa48("2733") ? this.data.inquiry.description : (stryCov_9fa48("2733"), this.data.inquiry?.description)) || (stryMutAct_9fa48("2734") ? "Stryker was here!" : (stryCov_9fa48("2734"), '')));
  source: string = stryMutAct_9fa48("2737") ? this.data.inquiry?.source && InquirySource.PHONE : stryMutAct_9fa48("2736") ? false : stryMutAct_9fa48("2735") ? true : (stryCov_9fa48("2735", "2736", "2737"), (stryMutAct_9fa48("2738") ? this.data.inquiry.source : (stryCov_9fa48("2738"), this.data.inquiry?.source)) || InquirySource.PHONE);
  priority = stryMutAct_9fa48("2741") ? this.data.inquiry?.priority && 'medium' : stryMutAct_9fa48("2740") ? false : stryMutAct_9fa48("2739") ? true : (stryCov_9fa48("2739", "2740", "2741"), (stryMutAct_9fa48("2742") ? this.data.inquiry.priority : (stryCov_9fa48("2742"), this.data.inquiry?.priority)) || (stryMutAct_9fa48("2743") ? "" : (stryCov_9fa48("2743"), 'medium')));
  readonly saving = signal(stryMutAct_9fa48("2744") ? true : (stryCov_9fa48("2744"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("2745")) {
      {}
    } else {
      stryCov_9fa48("2745");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("2746")) {
      {}
    } else {
      stryCov_9fa48("2746");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("2748") ? false : stryMutAct_9fa48("2747") ? true : (stryCov_9fa48("2747", "2748"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("2749") ? false : (stryCov_9fa48("2749"), true));
      if (stryMutAct_9fa48("2752") ? this.data.mode !== 'create' : stryMutAct_9fa48("2751") ? false : stryMutAct_9fa48("2750") ? true : (stryCov_9fa48("2750", "2751", "2752"), this.data.mode === (stryMutAct_9fa48("2753") ? "" : (stryCov_9fa48("2753"), 'create')))) {
        if (stryMutAct_9fa48("2754")) {
          {}
        } else {
          stryCov_9fa48("2754");
          const dto: CreateInquiryDto = stryMutAct_9fa48("2755") ? {} : (stryCov_9fa48("2755"), {
            clientName: this.clientName,
            description: this.description,
            source: this.source as InquirySource,
            clientPhone: stryMutAct_9fa48("2758") ? this.clientPhone && undefined : stryMutAct_9fa48("2757") ? false : stryMutAct_9fa48("2756") ? true : (stryCov_9fa48("2756", "2757", "2758"), this.clientPhone || undefined),
            clientEmail: stryMutAct_9fa48("2761") ? this.clientEmail && undefined : stryMutAct_9fa48("2760") ? false : stryMutAct_9fa48("2759") ? true : (stryCov_9fa48("2759", "2760", "2761"), this.clientEmail || undefined),
            clientAddress: stryMutAct_9fa48("2764") ? this.clientAddress && undefined : stryMutAct_9fa48("2763") ? false : stryMutAct_9fa48("2762") ? true : (stryCov_9fa48("2762", "2763", "2764"), this.clientAddress || undefined),
            priority: stryMutAct_9fa48("2767") ? this.priority && undefined : stryMutAct_9fa48("2766") ? false : stryMutAct_9fa48("2765") ? true : (stryCov_9fa48("2765", "2766", "2767"), this.priority || undefined)
          });
          this.inquiriesService.create(dto).subscribe(stryMutAct_9fa48("2768") ? {} : (stryCov_9fa48("2768"), {
            next: inquiry => {
              if (stryMutAct_9fa48("2769")) {
                {}
              } else {
                stryCov_9fa48("2769");
                this.saving.set(stryMutAct_9fa48("2770") ? true : (stryCov_9fa48("2770"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("2771") ? "" : (stryCov_9fa48("2771"), 'common.toast.created')), stryMutAct_9fa48("2772") ? "" : (stryCov_9fa48("2772"), 'success'));
                this.dialogRef.close(inquiry);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("2773")) {
                {}
              } else {
                stryCov_9fa48("2773");
                this.saving.set(stryMutAct_9fa48("2774") ? true : (stryCov_9fa48("2774"), false));
                console.error(stryMutAct_9fa48("2775") ? "" : (stryCov_9fa48("2775"), 'Create inquiry failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("2776") ? "" : (stryCov_9fa48("2776"), 'common.toast.errorCreated')), stryMutAct_9fa48("2777") ? "" : (stryCov_9fa48("2777"), 'error'));
              }
            }
          }));
        }
      } else {
        if (stryMutAct_9fa48("2778")) {
          {}
        } else {
          stryCov_9fa48("2778");
          const dto: UpdateInquiryDto = stryMutAct_9fa48("2779") ? {} : (stryCov_9fa48("2779"), {
            clientName: this.clientName,
            description: this.description,
            source: this.source as InquirySource,
            clientPhone: stryMutAct_9fa48("2782") ? this.clientPhone && undefined : stryMutAct_9fa48("2781") ? false : stryMutAct_9fa48("2780") ? true : (stryCov_9fa48("2780", "2781", "2782"), this.clientPhone || undefined),
            clientEmail: stryMutAct_9fa48("2785") ? this.clientEmail && undefined : stryMutAct_9fa48("2784") ? false : stryMutAct_9fa48("2783") ? true : (stryCov_9fa48("2783", "2784", "2785"), this.clientEmail || undefined),
            clientAddress: stryMutAct_9fa48("2788") ? this.clientAddress && undefined : stryMutAct_9fa48("2787") ? false : stryMutAct_9fa48("2786") ? true : (stryCov_9fa48("2786", "2787", "2788"), this.clientAddress || undefined),
            priority: stryMutAct_9fa48("2791") ? this.priority && undefined : stryMutAct_9fa48("2790") ? false : stryMutAct_9fa48("2789") ? true : (stryCov_9fa48("2789", "2790", "2791"), this.priority || undefined)
          });
          this.inquiriesService.update(this.data.inquiry!.id, dto).subscribe(stryMutAct_9fa48("2792") ? {} : (stryCov_9fa48("2792"), {
            next: inquiry => {
              if (stryMutAct_9fa48("2793")) {
                {}
              } else {
                stryCov_9fa48("2793");
                this.saving.set(stryMutAct_9fa48("2794") ? true : (stryCov_9fa48("2794"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("2795") ? "" : (stryCov_9fa48("2795"), 'common.toast.updated')), stryMutAct_9fa48("2796") ? "" : (stryCov_9fa48("2796"), 'success'));
                this.dialogRef.close(inquiry);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("2797")) {
                {}
              } else {
                stryCov_9fa48("2797");
                this.saving.set(stryMutAct_9fa48("2798") ? true : (stryCov_9fa48("2798"), false));
                console.error(stryMutAct_9fa48("2799") ? "" : (stryCov_9fa48("2799"), 'Update inquiry failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("2800") ? "" : (stryCov_9fa48("2800"), 'common.toast.errorUpdated')), stryMutAct_9fa48("2801") ? "" : (stryCov_9fa48("2801"), 'error'));
              }
            }
          }));
        }
      }
    }
  }
}