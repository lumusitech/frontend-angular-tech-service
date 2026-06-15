import { Component, inject, signal, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { User } from '../../core/models/user.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  workOrderId: string;
}

@Component({
  selector: 'app-add-task-dialog',
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
      <mat-icon>add_task</mat-icon>
      {{ 'workOrders.tasks.addTask' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.tasks.title' | translate }}</mat-label>
          <input
            matInput
            [value]="title()"
            (input)="title.set(getInputValue($event))"
            [placeholder]="'workOrders.tasks.titlePlaceholder' | translate"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.tasks.descriptionOptional' | translate }}</mat-label>
          <textarea
            matInput
            [value]="taskDescription()"
            (input)="taskDescription.set(getInputValue($event))"
            rows="3"
            [placeholder]="'workOrders.tasks.descriptionPlaceholder' | translate"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.tasks.assignTechnician' | translate }}</mat-label>
          <mat-select [value]="assignedToId()" (selectionChange)="assignedToId.set($event.value)">
            <mat-option>{{ 'workOrders.tasks.unassigned' | translate }}</mat-option>
            @if (techniciansResource.hasValue()) {
              @for (tech of techniciansResource.value().data; track tech.id) {
                <mat-option [value]="tech.id">{{ tech.name }}</mat-option>
              }
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event)"
        [disabled]="saving() || !title()"
      >
        {{
          saving()
            ? ('workOrders.tasks.creating' | translate)
            : ('workOrders.tasks.createTask' | translate)
        }}
      </button>
    </mat-dialog-actions>
  `,
})
export class AddTaskDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly title = signal('');
  readonly taskDescription = signal('');
  readonly assignedToId = signal('');
  readonly saving = signal(false);

  readonly techniciansResource = httpResource<PaginatedResponse<User>>(
    () => ({
      url: '/api/users?role=technician&limit=100',
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<User>>).data,
    },
  );

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.title()) return;

    this.saving.set(true);
    this.workOrdersService
      .addTask(this.data.workOrderId, {
        title: this.title(),
        description: this.taskDescription() || undefined,
        assignedToId: this.assignedToId() || undefined,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving.set(false);
        },
      });
  }
}
