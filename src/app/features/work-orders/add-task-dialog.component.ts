import { Component, inject, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { User } from '../../core/models/user.interfaces';
import { WorkOrderTask } from '../../core/models/work-order.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  workOrderId: string;
  orderTechnicians?: { id: string; name: string }[];
  task?: WorkOrderTask;
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
      <mat-icon>{{ isEditing() ? 'edit' : 'add_task' }}</mat-icon>
      {{ (isEditing() ? 'workOrders.tasks.editTask' : 'workOrders.tasks.addTask') | translate }}
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
            <mat-option [value]="''">{{ 'workOrders.tasks.unassigned' | translate }}</mat-option>
            @for (tech of availableTechnicians(); track tech.id) {
              <mat-option [value]="tech.id">{{ tech.name }}</mat-option>
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
        @if (saving()) {
          {{ (isEditing() ? 'workOrders.tasks.saving' : 'workOrders.tasks.creating') | translate }}
        } @else {
          {{
            (isEditing() ? 'workOrders.tasks.saveChanges' : 'workOrders.tasks.createTask')
              | translate
          }}
        }
      </button>
    </mat-dialog-actions>
  `,
})
export class AddTaskDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly isEditing = computed(() => !!this.data.task);

  readonly title = signal(this.data.task?.title || '');
  readonly taskDescription = signal(this.data.task?.description || '');
  readonly assignedToId = signal(
    this.data.task?.assignedTo?.id || this.data.task?.assignedToId || '',
  );
  readonly saving = signal(false);

  readonly techniciansResource = httpResource<PaginatedResponse<User>>(() => ({
    url: '/api/users?role=technician&limit=100',
  }));

  readonly availableTechnicians = computed<{ id: string; name: string }[]>(() => {
    if (this.data.orderTechnicians && this.data.orderTechnicians.length > 0) {
      return this.data.orderTechnicians;
    }
    return this.techniciansResource.value()?.data || [];
  });

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.title()) return;

    this.saving.set(true);

    if (this.isEditing() && this.data.task) {
      this.workOrdersService
        .updateTask(this.data.workOrderId, this.data.task.id, {
          title: this.title(),
          description: this.taskDescription() || undefined,
          assignedToId: this.assignedToId() || undefined,
        })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.toastService.show(
              this.translationService.instant('workOrders.tasks.taskUpdatedSuccess'),
              'success',
            );
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.saving.set(false);
            const msg =
              err.error?.message ||
              this.translationService.instant('workOrders.tasks.taskUpdatedError');
            this.toastService.show(msg, 'error');
          },
        });
    } else {
      this.workOrdersService
        .addTask(this.data.workOrderId, {
          title: this.title(),
          description: this.taskDescription() || undefined,
          assignedToId: this.assignedToId() || undefined,
        })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.toastService.show(
              this.translationService.instant('workOrders.tasks.taskCreatedSuccess'),
              'success',
            );
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.saving.set(false);
            const msg =
              err.error?.message ||
              this.translationService.instant('workOrders.tasks.taskCreatedError');
            this.toastService.show(msg, 'error');
          },
        });
    }
  }
}
