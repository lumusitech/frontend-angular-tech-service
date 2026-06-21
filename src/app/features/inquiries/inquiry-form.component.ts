import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { InquiriesService } from '../../core/services/inquiries.service';
import {
  Inquiry,
  InquirySource,
  CreateInquiryDto,
  UpdateInquiryDto,
} from '../../core/models/inquiry.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  inquiry?: Inquiry;
}

@Component({
  selector: 'app-inquiry-form',
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
      <mat-icon>help_outline</mat-icon>
      {{ data.mode === 'create' ? ('inquiries.newInquiry' | translate) : ('inquiries.editInquiry' | translate) }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.clientName' | translate }}</mat-label>
          <input matInput [value]="clientName()" (input)="clientName.set(getInputValue($event))" required />
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.phone' | translate }}</mat-label>
            <input matInput [value]="clientPhone()" (input)="clientPhone.set(getInputValue($event))" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.email' | translate }}</mat-label>
            <input matInput type="email" [value]="clientEmail()" (input)="clientEmail.set(getInputValue($event))" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.address' | translate }}</mat-label>
          <input matInput [value]="clientAddress()" (input)="clientAddress.set(getInputValue($event))" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.description' | translate }}</mat-label>
          <textarea
            matInput
            rows="3"
            [value]="description()"
            (input)="description.set(getInputValue($event))"
            required
          ></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.source' | translate }}</mat-label>
            <mat-select [value]="source()" (selectionChange)="source.set($event.value)" required>
              <mat-option value="phone">{{ 'statusLabels.phone' | translate }}</mat-option>
              <mat-option value="whatsapp">{{ 'statusLabels.whatsapp' | translate }}</mat-option>
              <mat-option value="email">{{ 'statusLabels.email' | translate }}</mat-option>
              <mat-option value="walk_in">{{ 'statusLabels.walk_in' | translate }}</mat-option>
              <mat-option value="social_media">{{ 'statusLabels.social_media' | translate }}</mat-option>
              <mat-option value="referral">{{ 'statusLabels.referral' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.priority' | translate }}</mat-label>
            <mat-select [value]="priority()" (selectionChange)="priority.set($event.value)">
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
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class InquiryFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly clientName = signal(this.data.inquiry?.clientName || '');
  readonly clientPhone = signal(this.data.inquiry?.clientPhone || '');
  readonly clientEmail = signal(this.data.inquiry?.clientEmail || '');
  readonly clientAddress = signal(this.data.inquiry?.clientAddress || '');
  readonly description = signal(this.data.inquiry?.description || '');
  readonly source = signal(this.data.inquiry?.source || InquirySource.PHONE);
  readonly priority = signal(this.data.inquiry?.priority || 'medium');
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.clientName() || !this.description()) return;

    this.saving.set(true);

    if (this.data.mode === 'create') {
      const dto: CreateInquiryDto = {
        clientName: this.clientName(),
        description: this.description(),
        source: this.source() as InquirySource,
        clientPhone: this.clientPhone() || undefined,
        clientEmail: this.clientEmail() || undefined,
        clientAddress: this.clientAddress() || undefined,
        priority: this.priority() || undefined,
      };

      this.inquiriesService.create(dto).subscribe({
        next: (inquiry) => {
          this.saving.set(false);
          this.dialogRef.close(inquiry);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      const dto: UpdateInquiryDto = {
        clientName: this.clientName(),
        description: this.description(),
        source: this.source() as InquirySource,
        clientPhone: this.clientPhone() || undefined,
        clientEmail: this.clientEmail() || undefined,
        clientAddress: this.clientAddress() || undefined,
        priority: this.priority() || undefined,
      };

      this.inquiriesService.update(this.data.inquiry!.id, dto).subscribe({
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
}
