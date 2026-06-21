import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { InquiriesService } from '../../core/services/inquiries.service';
import { ContactInquiryDto, InquiryRecommendation } from '../../core/models/inquiry.interfaces';
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
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>phone</mat-icon>
      {{ 'inquiries.contactClient' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.technicianNotes' | translate }}</mat-label>
          <textarea
            matInput
            rows="4"
            [value]="technicianNotes()"
            (input)="technicianNotes.set(getInputValue($event))"
            [placeholder]="'inquiries.technicianNotesPlaceholder' | translate"
            required
          ></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.estimatedCost' | translate }} ($)</mat-label>
            <input matInput type="number" [value]="estimatedCost()" (input)="estimatedCost.set(getInputValue($event))" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.estimatedDuration' | translate }} (h)</mat-label>
            <input matInput type="number" [value]="estimatedDuration()" (input)="estimatedDuration.set(getInputValue($event))" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.materialsNeeded' | translate }}</mat-label>
          <textarea
            matInput
            rows="2"
            [value]="materialsNeeded()"
            (input)="materialsNeeded.set(getInputValue($event))"
            [placeholder]="'inquiries.materialsPlaceholder' | translate"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.recommendation' | translate }}</mat-label>
          <mat-select [value]="recommendation()" (selectionChange)="recommendation.set($event.value)">
            <mat-option value="repair">{{ 'statusLabels.repair' | translate }}</mat-option>
            <mat-option value="replacement">{{ 'statusLabels.replacement' | translate }}</mat-option>
            <mat-option value="maintenance">{{ 'statusLabels.maintenance' | translate }}</mat-option>
            <mat-option value="inspection">{{ 'statusLabels.inspection' | translate }}</mat-option>
            <mat-option value="no_action">{{ 'statusLabels.no_action' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
        {{ saving() ? ('common.saving' | translate) : ('inquiries.saveContact' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class InquiryContactFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryContactFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly technicianNotes = signal('');
  readonly estimatedCost = signal('');
  readonly estimatedDuration = signal('');
  readonly materialsNeeded = signal('');
  readonly recommendation = signal('');
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.technicianNotes()) return;

    this.saving.set(true);

    const dto: ContactInquiryDto = {
      technicianNotes: this.technicianNotes(),
      estimatedCost: this.estimatedCost() ? parseFloat(this.estimatedCost()) : undefined,
      estimatedDuration: this.estimatedDuration() ? parseInt(this.estimatedDuration(), 10) : undefined,
      materialsNeeded: this.materialsNeeded() || undefined,
      recommendation: this.recommendation() as InquiryRecommendation || undefined,
    };

    this.inquiriesService.contact(this.data.inquiryId, dto).subscribe({
      next: (inquiry) => {
        this.saving.set(false);
        this.dialogRef.close(inquiry);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }
}
