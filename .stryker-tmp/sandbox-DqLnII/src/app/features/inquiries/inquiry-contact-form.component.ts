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
import { ContactInquiryDto, InquiryRecommendation } from '../../core/models/inquiry.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  inquiryId: string;
}
@Component({
  selector: 'app-inquiry-contact-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>phone</mat-icon>
      {{ 'inquiries.contactClient' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.technicianNotes' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="technicianNotes"
            name="technicianNotes"
            #technicianNotesRef="ngModel"
            rows="4"
            [placeholder]="'inquiries.technicianNotesPlaceholder' | translate"
            required
          ></textarea>
          @if (technicianNotesRef.invalid && technicianNotesRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.estimatedCost' | translate }} ($)</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="estimatedCost"
              name="estimatedCost"
              #estimatedCostRef="ngModel"
              min="0"
            />
            @if (estimatedCostRef.invalid && estimatedCostRef.touched) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.estimatedDuration' | translate }} (h)</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="estimatedDuration"
              name="estimatedDuration"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.materialsNeeded' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="materialsNeeded"
            name="materialsNeeded"
            rows="2"
            [placeholder]="'inquiries.materialsPlaceholder' | translate"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.recommendation' | translate }}</mat-label>
          <mat-select [(ngModel)]="recommendation" name="recommendation" #recommendationRef="ngModel" required>
            <mat-option value="repair">{{ 'statusLabels.repair' | translate }}</mat-option>
            <mat-option value="replacement">{{ 'statusLabels.replacement' | translate }}</mat-option>
            <mat-option value="maintenance">{{ 'statusLabels.maintenance' | translate }}</mat-option>
            <mat-option value="inspection">{{ 'statusLabels.inspection' | translate }}</mat-option>
            <mat-option value="no_action">{{ 'statusLabels.no_action' | translate }}</mat-option>
          </mat-select>
          @if (recommendationRef.invalid && recommendationRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event, formRef)" [disabled]="saving() || formRef.invalid">
        {{ saving() ? ('common.saving' | translate) : ('inquiries.saveContact' | translate) }}
      </button>
    </mat-dialog-actions>
  `
})
export class InquiryContactFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryContactFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  technicianNotes = stryMutAct_9fa48("2600") ? "Stryker was here!" : (stryCov_9fa48("2600"), '');
  estimatedCost = stryMutAct_9fa48("2601") ? "Stryker was here!" : (stryCov_9fa48("2601"), '');
  estimatedDuration = stryMutAct_9fa48("2602") ? "Stryker was here!" : (stryCov_9fa48("2602"), '');
  materialsNeeded = stryMutAct_9fa48("2603") ? "Stryker was here!" : (stryCov_9fa48("2603"), '');
  recommendation = stryMutAct_9fa48("2604") ? "Stryker was here!" : (stryCov_9fa48("2604"), '');
  readonly saving = signal(stryMutAct_9fa48("2605") ? true : (stryCov_9fa48("2605"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("2606")) {
      {}
    } else {
      stryCov_9fa48("2606");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("2607")) {
      {}
    } else {
      stryCov_9fa48("2607");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("2609") ? false : stryMutAct_9fa48("2608") ? true : (stryCov_9fa48("2608", "2609"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("2610") ? false : (stryCov_9fa48("2610"), true));
      const dto: ContactInquiryDto = stryMutAct_9fa48("2611") ? {} : (stryCov_9fa48("2611"), {
        technicianNotes: this.technicianNotes,
        estimatedCost: this.estimatedCost ? parseFloat(this.estimatedCost) : undefined,
        estimatedDuration: this.estimatedDuration ? parseInt(this.estimatedDuration, 10) : undefined,
        materialsNeeded: stryMutAct_9fa48("2614") ? this.materialsNeeded && undefined : stryMutAct_9fa48("2613") ? false : stryMutAct_9fa48("2612") ? true : (stryCov_9fa48("2612", "2613", "2614"), this.materialsNeeded || undefined),
        recommendation: stryMutAct_9fa48("2617") ? this.recommendation as InquiryRecommendation && undefined : stryMutAct_9fa48("2616") ? false : stryMutAct_9fa48("2615") ? true : (stryCov_9fa48("2615", "2616", "2617"), this.recommendation as InquiryRecommendation || undefined)
      });
      this.inquiriesService.contact(this.data.inquiryId, dto).subscribe(stryMutAct_9fa48("2618") ? {} : (stryCov_9fa48("2618"), {
        next: inquiry => {
          if (stryMutAct_9fa48("2619")) {
            {}
          } else {
            stryCov_9fa48("2619");
            this.saving.set(stryMutAct_9fa48("2620") ? true : (stryCov_9fa48("2620"), false));
            this.toastService.show(this.t(stryMutAct_9fa48("2621") ? "" : (stryCov_9fa48("2621"), 'common.toast.updated')), stryMutAct_9fa48("2622") ? "" : (stryCov_9fa48("2622"), 'success'));
            this.dialogRef.close(inquiry);
          }
        },
        error: err => {
          if (stryMutAct_9fa48("2623")) {
            {}
          } else {
            stryCov_9fa48("2623");
            this.saving.set(stryMutAct_9fa48("2624") ? true : (stryCov_9fa48("2624"), false));
            console.error(stryMutAct_9fa48("2625") ? "" : (stryCov_9fa48("2625"), 'Contact inquiry failed:'), err);
            this.toastService.show(this.t(stryMutAct_9fa48("2626") ? "" : (stryCov_9fa48("2626"), 'common.toast.errorUpdated')), stryMutAct_9fa48("2627") ? "" : (stryCov_9fa48("2627"), 'error'));
          }
        }
      }));
    }
  }
}