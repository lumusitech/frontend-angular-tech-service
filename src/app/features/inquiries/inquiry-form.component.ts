import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { form, FormField, required, email } from '@angular/forms/signals';
import { InquiriesService } from '../../core/services/inquiries.service';
import {
  Inquiry,
  InquirySource,
  CreateInquiryDto,
  UpdateInquiryDto,
} from '../../core/models/inquiry.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  inquiry?: Inquiry;
}

interface InquiryFormModel {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  description: string;
  source: string;
  priority: string;
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
    FormField,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>help_outline</mat-icon>
      {{ data.mode === 'create' ? ('inquiries.newInquiry' | translate) : ('inquiries.editInquiry' | translate) }}
    </h2>

    <mat-dialog-content class="!p-6">
      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.clientName' | translate }}</mat-label>
          <input
            matInput
            [formField]="inquiryForm.clientName"
          />
          @if (inquiryForm.clientName().invalid() && inquiryForm.clientName().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.phone' | translate }}</mat-label>
            <input
              matInput
              [formField]="inquiryForm.clientPhone"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.email' | translate }}</mat-label>
            <input
              matInput
              type="email"
              [formField]="inquiryForm.clientEmail"
            />
            @if (inquiryForm.clientEmail().invalid() && inquiryForm.clientEmail().touched()) {
              <mat-error>{{ t('validation.invalidEmail') }}</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.address' | translate }}</mat-label>
          <input
            matInput
            [formField]="inquiryForm.clientAddress"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.description' | translate }}</mat-label>
          <textarea
            matInput
            [formField]="inquiryForm.description"
            rows="3"
          ></textarea>
          @if (inquiryForm.description().invalid() && inquiryForm.description().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.source' | translate }}</mat-label>
            <mat-select [formField]="inquiryForm.source">
              <mat-option value="phone">{{ 'statusLabels.phone' | translate }}</mat-option>
              <mat-option value="whatsapp">{{ 'statusLabels.whatsapp' | translate }}</mat-option>
              <mat-option value="email">{{ 'statusLabels.email' | translate }}</mat-option>
              <mat-option value="walk_in">{{ 'statusLabels.walk_in' | translate }}</mat-option>
              <mat-option value="social_media">{{ 'statusLabels.social_media' | translate }}</mat-option>
              <mat-option value="referral">{{ 'statusLabels.referral' | translate }}</mat-option>
            </mat-select>
            @if (inquiryForm.source().invalid() && inquiryForm.source().touched()) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'inquiries.priority' | translate }}</mat-label>
            <mat-select [formField]="inquiryForm.priority">
              <mat-option value="low">{{ 'statusLabels.low' | translate }}</mat-option>
              <mat-option value="medium">{{ 'statusLabels.medium' | translate }}</mat-option>
              <mat-option value="high">{{ 'statusLabels.high' | translate }}</mat-option>
              <mat-option value="urgent">{{ 'statusLabels.urgent' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="saving() || inquiryForm().invalid()">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class InquiryFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly model = signal<InquiryFormModel>({
    clientName: this.data.inquiry?.clientName || '',
    clientPhone: this.data.inquiry?.clientPhone || '',
    clientEmail: this.data.inquiry?.clientEmail || '',
    clientAddress: this.data.inquiry?.clientAddress || '',
    description: this.data.inquiry?.description || '',
    source: this.data.inquiry?.source || InquirySource.PHONE,
    priority: this.data.inquiry?.priority || 'medium',
  });
  readonly inquiryForm = form(this.model, (p) => {
    required(p.clientName, { message: 'validation.required' });
    required(p.description, { message: 'validation.required' });
    required(p.source, { message: 'validation.required' });
    email(p.clientEmail, { message: 'validation.invalidEmail' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.inquiryForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();

    if (this.data.mode === 'create') {
      const dto: CreateInquiryDto = {
        clientName: m.clientName,
        description: m.description,
        source: m.source as InquirySource,
        clientPhone: m.clientPhone || undefined,
        clientEmail: m.clientEmail || undefined,
        clientAddress: m.clientAddress || undefined,
        priority: m.priority || undefined,
      };

      this.inquiriesService.create(dto).subscribe({
        next: (inquiry) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(inquiry);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Create inquiry failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
    } else {
      const dto: UpdateInquiryDto = {
        clientName: m.clientName,
        description: m.description,
        source: m.source as InquirySource,
        clientPhone: m.clientPhone || undefined,
        clientEmail: m.clientEmail || undefined,
        clientAddress: m.clientAddress || undefined,
        priority: m.priority || undefined,
      };

      this.inquiriesService.update(this.data.inquiry!.id, dto).subscribe({
        next: (inquiry) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(inquiry);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Update inquiry failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
      });
    }
  }
}
