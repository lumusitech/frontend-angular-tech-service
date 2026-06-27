import { Component, inject, signal } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PendingItemsService } from '../../core/services/pending-items.service';
import {
  PendingItem,
  PendingItemType,
  PendingItemPriority,
  PendingItemStatus,
  CreatePendingItemDto,
  UpdatePendingItemDto,
} from '../../core/models/pending-item.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  item?: PendingItem;
}

@Component({
  selector: 'app-pending-item-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>pending_actions</mat-icon>
      {{
        data.mode === 'create'
          ? ('pendingItems.newPendingItem' | translate)
          : ('pendingItems.editPendingItem' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.titleColumn' | translate }}</mat-label>
          <input matInput [(ngModel)]="title" [ngModelOptions]="{standalone: true}" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.description' | translate }}</mat-label>
          <textarea
            matInput
            rows="3"
            [(ngModel)]="description" [ngModelOptions]="{standalone: true}"
          ></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'pendingItems.type' | translate }}</mat-label>
            <mat-select [(ngModel)]="type" [ngModelOptions]="{standalone: true}" required>
              <mat-option value="work_order">{{
                'pendingItems.types.workOrder' | translate
              }}</mat-option>
              <mat-option value="inquiry">{{
                'pendingItems.types.inquiry' | translate
              }}</mat-option>
              <mat-option value="maintenance">{{
                'pendingItems.types.maintenance' | translate
              }}</mat-option>
              <mat-option value="follow_up">{{
                'pendingItems.types.followUp' | translate
              }}</mat-option>
              <mat-option value="other">{{ 'pendingItems.types.other' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'pendingItems.priority' | translate }}</mat-label>
            <mat-select [(ngModel)]="priority" [ngModelOptions]="{standalone: true}">
              <mat-option value="low">{{ 'pendingItems.priorities.low' | translate }}</mat-option>
              <mat-option value="medium">{{
                'pendingItems.priorities.medium' | translate
              }}</mat-option>
              <mat-option value="high">{{ 'pendingItems.priorities.high' | translate }}</mat-option>
              <mat-option value="urgent">{{
                'pendingItems.priorities.urgent' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.dueDate' | translate }}</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            [value]="dueDate()"
            (dateChange)="onDateChange($event)"
            (click)="picker.open()"
            required
          />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>

        @if (data.mode === 'edit') {
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [(ngModel)]="status" [ngModelOptions]="{standalone: true}">
              <mat-option value="pending">{{
                'pendingItems.statuses.pending' | translate
              }}</mat-option>
              <mat-option value="in_progress">{{
                'pendingItems.statuses.inProgress' | translate
              }}</mat-option>
              <mat-option value="completed">{{
                'pendingItems.statuses.completed' | translate
              }}</mat-option>
              <mat-option value="cancelled">{{
                'pendingItems.statuses.cancelled' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>
        }
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
export class PendingItemFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PendingItemFormComponent>);
  private readonly pendingItemsService = inject(PendingItemsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly title = signal(this.data.item?.title || '');
  readonly description = signal(this.data.item?.description || '');
  readonly type = signal(this.data.item?.type || PendingItemType.WORK_ORDER);
  readonly priority = signal(this.data.item?.priority || PendingItemPriority.MEDIUM);
  readonly status = signal(this.data.item?.status || PendingItemStatus.PENDING);
  readonly dueDate = signal<Date | null>(
    this.data.item?.dueDate ? new Date(this.data.item.dueDate) : null,
  );
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onDateChange(event: { value: Date | null }): void {
    this.dueDate.set(event.value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.title() || !this.dueDate()) return;

    this.saving.set(true);

    const dueDateStr = toLocalDateString(this.dueDate()!);

    if (this.data.mode === 'create') {
      const dto: CreatePendingItemDto = {
        title: this.title(),
        description: this.description() || undefined,
        dueDate: dueDateStr,
        type: this.type() as PendingItemType,
        priority: this.priority() as PendingItemPriority,
      };

    this.pendingItemsService.create(dto).subscribe({
      next: (item) => {
        this.saving.set(false);
        this.toastService.show(this.translationService.instant('common.toast.created'), 'success');
        this.dialogRef.close(item);
      },
      error: (err) => {
        this.saving.set(false);
        const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorCreated');
        this.toastService.show(msg, 'error');
      },
    });
    } else {
      const dto: UpdatePendingItemDto = {
        title: this.title(),
        description: this.description() || undefined,
        dueDate: dueDateStr,
        type: this.type() as PendingItemType,
        priority: this.priority() as PendingItemPriority,
        status: this.status() as PendingItemStatus,
      };

    this.pendingItemsService.update(this.data.item!.id, dto).subscribe({
      next: (item) => {
        this.saving.set(false);
        this.toastService.show(this.translationService.instant('common.toast.updated'), 'success');
        this.dialogRef.close(item);
      },
      error: (err) => {
        this.saving.set(false);
        const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorUpdated');
        this.toastService.show(msg, 'error');
      },
    });
    }
  }
}
