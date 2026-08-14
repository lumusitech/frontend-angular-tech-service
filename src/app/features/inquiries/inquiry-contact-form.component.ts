import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { form, FormField, required } from '@angular/forms/signals';
import { InquiriesService } from '../../core/services/inquiries.service';
import { ContactInquiryDto, InquiryRecommendation } from '../../core/models/inquiry.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  inquiryId: string;
}

interface ContactFormModel {
  technicianNotes: string;
  estimatedCost: string;
  estimatedDuration: string;
  materialsNeeded: string;
  recommendation: string;
}

@Component({
  selector: 'app-inquiry-contact-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormField,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>phone</mat-icon>
      {{ 'inquiries.contactClient' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.technicianNotes' | translate }}</mat-label>
          <textarea
            matInput
            [formField]="contactForm.technicianNotes"
            rows="4"
            [placeholder]="'inquiries.technicianNotesPlaceholder' | translate"
          ></textarea>
          @if (contactForm.technicianNotes().invalid() && contactForm.technicianNotes().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.estimatedCost' | translate }} ($)</mat-label>
            <input matInput type="number" [formField]="contactForm.estimatedCost" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.estimatedDuration' | translate }} (h)</mat-label>
            <input matInput type="number" [formField]="contactForm.estimatedDuration" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.materialsNeeded' | translate }}</mat-label>
          <textarea
            matInput
            [formField]="contactForm.materialsNeeded"
            rows="2"
            [placeholder]="'inquiries.materialsPlaceholder' | translate"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.recommendation' | translate }}</mat-label>
          <mat-select [formField]="contactForm.recommendation">
            <mat-option value="repair">{{ 'statusLabels.repair' | translate }}</mat-option>
            <mat-option value="replacement">{{
              'statusLabels.replacement' | translate
            }}</mat-option>
            <mat-option value="maintenance">{{
              'statusLabels.maintenance' | translate
            }}</mat-option>
            <mat-option value="inspection">{{ 'statusLabels.inspection' | translate }}</mat-option>
            <mat-option value="no_action">{{ 'statusLabels.no_action' | translate }}</mat-option>
          </mat-select>
          @if (contactForm.recommendation().invalid() && contactForm.recommendation().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="saving() || contactForm().invalid()"
      >
        {{ saving() ? ('common.saving' | translate) : ('inquiries.saveContact' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class InquiryContactFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryContactFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly model = signal<ContactFormModel>({
    technicianNotes: '',
    estimatedCost: '',
    estimatedDuration: '',
    materialsNeeded: '',
    recommendation: '',
  });
  readonly contactForm = form(this.model, (p) => {
    required(p.technicianNotes, { message: 'validation.required' });
    required(p.recommendation, { message: 'validation.required' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.contactForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();

    const dto: ContactInquiryDto = {
      technicianNotes: m.technicianNotes,
      estimatedCost: m.estimatedCost ? parseFloat(m.estimatedCost) : undefined,
      estimatedDuration: m.estimatedDuration ? parseInt(m.estimatedDuration, 10) : undefined,
      materialsNeeded: m.materialsNeeded || undefined,
      recommendation: (m.recommendation as InquiryRecommendation) || undefined,
    };

    this.inquiriesService.contact(this.data.inquiryId, dto).subscribe({
      next: (inquiry) => {
        this.saving.set(false);
        this.toastService.show(this.t('common.toast.updated'), 'success');
        this.dialogRef.close(inquiry);
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Contact inquiry failed:', err);
        this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
      },
    });
  }
}
