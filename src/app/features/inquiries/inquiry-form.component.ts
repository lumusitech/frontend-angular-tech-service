import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
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

@Component({
  selector: 'app-inquiry-form',
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
  `,
})
export class InquiryFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InquiryFormComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  clientName = this.data.inquiry?.clientName || '';
  clientPhone = this.data.inquiry?.clientPhone || '';
  clientEmail = this.data.inquiry?.clientEmail || '';
  clientAddress = this.data.inquiry?.clientAddress || '';
  description = this.data.inquiry?.description || '';
  source: string = this.data.inquiry?.source || InquirySource.PHONE;
  priority = this.data.inquiry?.priority || 'medium';
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(event: Event, form: NgForm): void {
    event.preventDefault();
    form.control.markAllAsTouched();

    if (form.invalid) return;

    this.saving.set(true);

    if (this.data.mode === 'create') {
      const dto: CreateInquiryDto = {
        clientName: this.clientName,
        description: this.description,
        source: this.source as InquirySource,
        clientPhone: this.clientPhone || undefined,
        clientEmail: this.clientEmail || undefined,
        clientAddress: this.clientAddress || undefined,
        priority: this.priority || undefined,
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
        clientName: this.clientName,
        description: this.description,
        source: this.source as InquirySource,
        clientPhone: this.clientPhone || undefined,
        clientEmail: this.clientEmail || undefined,
        clientAddress: this.clientAddress || undefined,
        priority: this.priority || undefined,
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
