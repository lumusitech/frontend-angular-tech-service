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
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    TranslatePipe,
  ],
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
  `,
})
export class InquiryContactFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryContactFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  technicianNotes = '';
  estimatedCost = '';
  estimatedDuration = '';
  materialsNeeded = '';
  recommendation = '';
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(event: Event, form: NgForm): void {
    event.preventDefault();
    form.control.markAllAsTouched();

    if (form.invalid) return;

    this.saving.set(true);

    const dto: ContactInquiryDto = {
      technicianNotes: this.technicianNotes,
      estimatedCost: this.estimatedCost ? parseFloat(this.estimatedCost) : undefined,
      estimatedDuration: this.estimatedDuration ? parseInt(this.estimatedDuration, 10) : undefined,
      materialsNeeded: this.materialsNeeded || undefined,
      recommendation: this.recommendation as InquiryRecommendation || undefined,
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
