import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface DateFieldOption {
  value: string;
  labelKey: string;
}

@Component({
  selector: 'app-date-field-selector',
  imports: [MatFormFieldModule, MatSelectModule, TranslatePipe],
  template: `
    <mat-form-field appearance="outline" class="w-44">
      <mat-label>{{ 'common.dateField' | translate }}</mat-label>
      <mat-select [value]="value()" (selectionChange)="onSelectionChange($event.value)">
        @for (field of fields(); track field.value) {
          <mat-option [value]="field.value">{{ field.labelKey | translate }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class DateFieldSelectorComponent {
  readonly value = input<string>('createdAt');
  readonly fields = input.required<DateFieldOption[]>();
  readonly valueChange = output<string>();

  onSelectionChange(newValue: string): void {
    this.valueChange.emit(newValue);
  }
}
