import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface StatusChangeDialogData {
  titleKey?: string;
  title?: string;
  message?: string;
  confirmLabel?: string;
  color?: 'primary' | 'warn';
  detailLabel?: string;
}

export interface StatusChangeDialogResult {
  confirmed: boolean;
  detail: string;
}

@Component({
  selector: 'app-status-change-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>swap_horiz</mat-icon>
      {{ data.titleKey ? (data.titleKey | translate) : data.title }}
    </h2>
    <mat-dialog-content class="!p-6">
      @if (data.message) {
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ data.message }}</p>
      }
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>
          {{ data.detailLabel || 'statusTimeline.detail' | translate }}
          ({{ 'common.optional' | translate }})
        </mat-label>
        <textarea
          matInput
          [value]="detail()"
          (input)="detail.set(getInputValue($event))"
          rows="3"
          maxlength="1000"
          [placeholder]="'statusTimeline.detailPlaceholder' | translate"
        ></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="{ confirmed: false, detail: '' }">
        {{ 'common.cancel' | translate }}
      </button>
      <button mat-flat-button [color]="data.color || 'primary'" (click)="confirm()">
        {{ data.confirmLabel || ('common.confirm' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class StatusChangeDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<StatusChangeDialogComponent>);
  readonly data = inject<StatusChangeDialogData>(MAT_DIALOG_DATA);

  readonly detail = signal('');

  getInputValue(event: Event): string {
    return (event.target as HTMLTextAreaElement).value;
  }

  confirm(): void {
    this.dialogRef.close({
      confirmed: true,
      detail: this.detail().trim(),
    } satisfies StatusChangeDialogResult);
  }
}
