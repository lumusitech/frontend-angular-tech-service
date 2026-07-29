import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { form, FormField, required } from '@angular/forms/signals';
import { ServiceTypesService } from '../../core/services/service-types.service';
import {
  ServiceType,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
} from '../../core/models/service-type.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  serviceType?: ServiceType;
}

interface ServiceTypeFormModel {
  name: string;
  description: string;
  estimatedDuration: string;
  isActive: boolean;
  requiresDelivery: boolean;
}

@Component({
  selector: 'app-service-type-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    FormField,
    TranslatePipe,
  ],
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
      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.name' | translate }}</mat-label>
          <input
            matInput
            [formField]="serviceTypeForm.name"
          />
          @if (serviceTypeForm.name().invalid() && serviceTypeForm.name().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.description' | translate }}</mat-label>
          <textarea
            matInput
            [formField]="serviceTypeForm.description"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.estimatedDurationLabel' | translate }}</mat-label>
          <input
            matInput
            type="number"
            [formField]="serviceTypeForm.estimatedDuration"
          />
        </mat-form-field>

        <mat-checkbox [formField]="serviceTypeForm.isActive">
          {{ 'serviceTypes.activeService' | translate }}
        </mat-checkbox>

        <div class="flex items-center gap-1.5 pt-2 overflow-visible">
          <mat-checkbox [formField]="serviceTypeForm.requiresDelivery">
            {{ 'serviceTypes.requiresDeliveryLabel' | translate }}
          </mat-checkbox>
          <button
            type="button"
            class="inline-flex items-center justify-center shrink-0 p-0.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-300 cursor-help border-0 bg-transparent"
            [matTooltip]="'serviceTypes.requiresDeliveryHint' | translate"
            [attr.aria-label]="'serviceTypes.requiresDeliveryHint' | translate"
          >
            <mat-icon class="!w-5 !h-5 !text-[20px] !leading-none">info</mat-icon>
          </button>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="saving() || serviceTypeForm().invalid()">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ServiceTypeFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ServiceTypeFormComponent>);
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly model = signal<ServiceTypeFormModel>({
    name: this.data.serviceType?.name || '',
    description: this.data.serviceType?.description || '',
    estimatedDuration: this.data.serviceType?.estimatedDuration?.toString() || '',
    isActive: this.data.serviceType?.isActive ?? true,
    requiresDelivery: this.data.serviceType?.requiresDelivery ?? false,
  });
  readonly serviceTypeForm = form(this.model, (p) => {
    required(p.name, { message: 'validation.required' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.serviceTypeForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();
    const duration = m.estimatedDuration ? parseInt(m.estimatedDuration, 10) : undefined;

    if (this.data.mode === 'create') {
      const dto: CreateServiceTypeDto = {
        name: m.name,
        description: m.description || undefined,
        estimatedDuration: duration,
        isActive: m.isActive,
        requiresDelivery: m.requiresDelivery,
      };

      this.serviceTypesService.create(dto).subscribe({
        next: (serviceType) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(serviceType);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Create service type failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
    } else {
      const dto: UpdateServiceTypeDto = {
        name: m.name,
        description: m.description || undefined,
        estimatedDuration: duration,
        isActive: m.isActive,
        requiresDelivery: m.requiresDelivery,
      };

      this.serviceTypesService.update(this.data.serviceType!.id, dto).subscribe({
        next: (serviceType) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(serviceType);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Update service type failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
      });
    }
  }
}
