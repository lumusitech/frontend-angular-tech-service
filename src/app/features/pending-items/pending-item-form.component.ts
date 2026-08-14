import { Component, inject, signal } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { form, FormField, required } from '@angular/forms/signals';
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

interface PendingItemFormModel {
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
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
    MatDatepickerModule,
    MatNativeDateModule,
    FormField,
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
      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.titleColumn' | translate }}</mat-label>
          <input matInput [formField]="pendingItemForm.title" />
          @if (pendingItemForm.title().invalid() && pendingItemForm.title().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.description' | translate }}</mat-label>
          <textarea matInput [formField]="pendingItemForm.description" rows="3"></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'pendingItems.type' | translate }}</mat-label>
            <mat-select [formField]="pendingItemForm.type">
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
            @if (pendingItemForm.type().invalid() && pendingItemForm.type().touched()) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'pendingItems.priority' | translate }}</mat-label>
            <mat-select [formField]="pendingItemForm.priority">
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
            [value]="dueDateValue()"
            (dateChange)="dueDateValue.set($any($event).value)"
            (click)="picker.open()"
          />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>

        @if (data.mode === 'edit') {
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [formField]="pendingItemForm.status">
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
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="saving() || pendingItemForm().invalid()"
      >
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

  readonly dueDateValue = signal<Date | null>(
    this.data.item?.dueDate ? new Date(this.data.item.dueDate) : null,
  );

  readonly model = signal<PendingItemFormModel>({
    title: this.data.item?.title || '',
    description: this.data.item?.description || '',
    type: this.data.item?.type || PendingItemType.WORK_ORDER,
    priority: this.data.item?.priority || PendingItemPriority.MEDIUM,
    status: this.data.item?.status || PendingItemStatus.PENDING,
  });
  readonly pendingItemForm = form(this.model, (p) => {
    required(p.title, { message: 'validation.required' });
    required(p.type, { message: 'validation.required' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.pendingItemForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();

    const dueDateStr = toLocalDateString(this.dueDateValue()!);

    if (this.data.mode === 'create') {
      const dto: CreatePendingItemDto = {
        title: m.title,
        description: m.description || undefined,
        dueDate: dueDateStr,
        type: m.type as PendingItemType,
        priority: m.priority as PendingItemPriority,
      };

      this.pendingItemsService.create(dto).subscribe({
        next: (item) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(item);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Create pending item failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
    } else {
      const dto: UpdatePendingItemDto = {
        title: m.title,
        description: m.description || undefined,
        dueDate: dueDateStr,
        type: m.type as PendingItemType,
        priority: m.priority as PendingItemPriority,
        status: m.status as PendingItemStatus,
      };

      this.pendingItemsService.update(this.data.item!.id, dto).subscribe({
        next: (item) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(item);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Update pending item failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
      });
    }
  }
}
