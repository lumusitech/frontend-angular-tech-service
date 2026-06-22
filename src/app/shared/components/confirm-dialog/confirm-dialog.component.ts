import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface ConfirmDialogData {
  title?: string;
  titleKey?: string;
  message?: string;
  messageKey?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  color?: 'primary' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ data.titleKey ? (data.titleKey | translate) : data.title }}</h2>
    <mat-dialog-content>{{ data.messageKey ? (data.messageKey | translate) : data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        {{ data.cancelLabel || ('common.cancel' | translate) }}
      </button>
      <button mat-flat-button [color]="data.color || 'primary'" [mat-dialog-close]="true">
        {{ data.confirmLabel || ('common.confirm' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
