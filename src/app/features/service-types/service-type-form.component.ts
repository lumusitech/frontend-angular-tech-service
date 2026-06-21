import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ServiceTypesService } from '../../core/services/service-types.service';
import {
  ServiceType,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
} from '../../core/models/service-type.interfaces';
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
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.name' | translate }}</mat-label>
          <input matInput [(ngModel)]="name" [ngModelOptions]="{standalone: true}" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.description' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="description" [ngModelOptions]="{standalone: true}"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'serviceTypes.estimatedDurationLabel' | translate }}</mat-label>
          <input
            matInput
            type="number"
            [value]="estimatedDuration()"
            (input)="estimatedDuration.set(getInputValue($event))"
            min="0"
          />
        </mat-form-field>

        <mat-checkbox [checked]="isActive()" (change)="isActive.set($event.checked)">
          {{ 'serviceTypes.activeService' | translate }}
        </mat-checkbox>
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
export class ServiceTypeFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ServiceTypeFormComponent>);
  private readonly serviceTypesService = inject(ServiceTypesService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly name = signal(this.data.serviceType?.name || '');
  readonly description = signal(this.data.serviceType?.description || '');
  readonly estimatedDuration = signal(this.data.serviceType?.estimatedDuration?.toString() || '');
  readonly isActive = signal(this.data.serviceType?.isActive ?? true);
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.saving.set(true);

    const duration = this.estimatedDuration() ? parseInt(this.estimatedDuration(), 10) : undefined;

    if (this.data.mode === 'create') {
      const dto: CreateServiceTypeDto = {
        name: this.name(),
        description: this.description() || undefined,
        estimatedDuration: duration,
        isActive: this.isActive(),
      };

      this.serviceTypesService.create(dto).subscribe({
        next: (serviceType) => {
          this.saving.set(false);
          this.dialogRef.close(serviceType);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      const dto: UpdateServiceTypeDto = {
        name: this.name(),
        description: this.description() || undefined,
        estimatedDuration: duration,
        isActive: this.isActive(),
      };

      this.serviceTypesService.update(this.data.serviceType!.id, dto).subscribe({
        next: (serviceType) => {
          this.saving.set(false);
          this.dialogRef.close(serviceType);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    }
  }
}
