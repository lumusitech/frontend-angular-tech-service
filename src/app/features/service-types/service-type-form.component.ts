import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
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
    FormsModule,
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
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.name' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="name"
            name="name"
            #nameRef="ngModel"
            required
          />
          @if (nameRef.invalid && nameRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.description' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="description"
            name="description"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.estimatedDurationLabel' | translate }}</mat-label>
          <input
            matInput
            type="number"
            [(ngModel)]="estimatedDuration"
            name="estimatedDuration"
            min="0"
          />
        </mat-form-field>

        <mat-checkbox [(ngModel)]="isActive" name="isActive">
          {{ 'serviceTypes.activeService' | translate }}
        </mat-checkbox>

        <div class="pt-2">
          <mat-checkbox [(ngModel)]="requiresDelivery" name="requiresDelivery">
            <span class="inline-flex items-center gap-1.5">
              {{ 'serviceTypes.requiresDeliveryLabel' | translate }}
              <mat-icon
                class="text-gray-400 dark:text-gray-500 !w-4 !h-4 !text-base cursor-help align-middle"
                [matTooltip]="'serviceTypes.requiresDeliveryHint' | translate"
                (click)="$event.stopPropagation()"
              >info</mat-icon>
            </span>
          </mat-checkbox>
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
export class ServiceTypeFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ServiceTypeFormComponent>);
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  name = this.data.serviceType?.name || '';
  description = this.data.serviceType?.description || '';
  estimatedDuration = this.data.serviceType?.estimatedDuration?.toString() || '';
  isActive = this.data.serviceType?.isActive ?? true;
  requiresDelivery = this.data.serviceType?.requiresDelivery ?? false;
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(event: Event, form: NgForm): void {
    event.preventDefault();
    form.control.markAllAsTouched();

    if (form.invalid) return;

    this.saving.set(true);

    const duration = this.estimatedDuration ? parseInt(this.estimatedDuration, 10) : undefined;

    if (this.data.mode === 'create') {
      const dto: CreateServiceTypeDto = {
        name: this.name,
        description: this.description || undefined,
        estimatedDuration: duration,
        isActive: this.isActive,
        requiresDelivery: this.requiresDelivery,
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
        name: this.name,
        description: this.description || undefined,
        estimatedDuration: duration,
        isActive: this.isActive,
        requiresDelivery: this.requiresDelivery,
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
