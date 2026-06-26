import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, SlicePipe } from '@angular/common';
import { InquirySummary } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-inquiries-widget',
  imports: [MatIconModule, MatButtonModule, DatePipe, SlicePipe, TranslatePipe],
  template: `
    @if (items().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-700 p-6" [style.border-left-color]="primaryColor()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'dashboard.newInquiries' | translate }}
          </h3>
          <button mat-button color="primary" (click)="viewAll.emit()">
            {{ 'dashboard.viewInquiries' | translate }}
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
        <div class="space-y-3">
          @for (inquiry of items(); track inquiry.id) {
            <div class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                 [style.border-color]="primaryColor() + '30'"
                 [style.background-color]="primaryColor() + '0a'"
                 (click)="itemClick.emit(inquiry.id)">
              <div class="flex items-center gap-3">
                <mat-icon [style.color]="primaryColor()">help_outline</mat-icon>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ inquiry.clientName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ 'statusLabels.' + inquiry.source | translate }}
                    &middot;
                    {{ inquiry.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                  </p>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    [style.color]="primaryColor()"
                    [style.background-color]="primaryColor() + '1a'">
                {{ inquiry.description | slice: 0:30 }}{{ inquiry.description.length > 30 ? '...' : '' }}
              </span>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class InquiriesWidgetComponent {
  items = input.required<InquirySummary[]>();
  primaryColor = input<string>('#3B82F6');
  viewAll = output<void>();
  itemClick = output<string>();
}
