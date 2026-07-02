import { Component, computed, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { CopyFieldComponent } from '../copy-field/copy-field.component';

export interface MobileCardField {
  label: string;
  value: string;
  type?: 'phone' | 'email' | 'address' | 'text';
}

@Component({
  selector: 'app-mobile-card',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    StatusBadgeComponent,
    CopyFieldComponent,
  ],
  template: `
    <mat-expansion-panel class="!shadow-sm !border !border-gray-200 dark:!border-gray-700 !rounded-xl overflow-hidden">
      <mat-expansion-panel-header class="!py-3">
        <mat-panel-title class="!flex !items-center !gap-3">
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">
            {{ title() }}
          </span>
          @if (status()) {
            <app-status-badge [value]="status()!" [type]="statusTypeCast()" />
          }
        </mat-panel-title>
      </mat-expansion-panel-header>

      <div class="px-4 pb-4 space-y-0 divide-y divide-gray-100 dark:divide-gray-700">
        @for (field of fields(); track field.label) {
          <app-copy-field
            [label]="field.label"
            [value]="field.value"
            [type]="field.type || 'text'"
          />
        }

        @if (showActions()) {
          <div class="flex items-center gap-2 pt-3">
            <ng-content />
          </div>
        }
      </div>
    </mat-expansion-panel>
  `,
})
export class MobileCardComponent {
  readonly title = input.required<string>();
  readonly status = input<string | null>(null);
  readonly statusType = input<string>('workOrderStatus');
  readonly fields = input.required<MobileCardField[]>();
  readonly showActions = input(false);

  readonly statusTypeCast = computed(() => this.statusType() as any);
}
