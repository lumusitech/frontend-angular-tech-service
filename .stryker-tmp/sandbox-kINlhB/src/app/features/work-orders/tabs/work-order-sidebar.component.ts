// @ts-nocheck
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
interface Technician {
  id: string;
  name: string;
}
@Component({
  selector: 'app-work-order-sidebar',
  imports: [MatIconModule, MatButtonModule, CurrencyArsPipe, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">
            {{ 'workOrders.detail.assignedTechnicians' | translate }}
          </h3>
          <button mat-button color="primary" (click)="editTechnicians.emit()">
            <mat-icon>edit</mat-icon>
            {{ 'common.edit' | translate }}
          </button>
        </div>
        @if (technicians().length === 0) {
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'workOrders.technicians.noTechnicians' | translate }}
          </p>
        } @else {
          <div class="space-y-2">
            @for (tech of technicians(); track tech.id) {
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {{ tech.name.charAt(0) }}
                  </span>
                </div>
                <span class="text-sm">{{ tech.name }}</span>
              </div>
            }
          </div>
        }
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">
          {{ 'workOrders.detail.summary' | translate }}
        </h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.completedTasks' | translate }}
            </span>
            <span class="font-medium">{{ completedTasks() }}/{{ totalTasks() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.materialsCost' | translate }}
            </span>
            <span class="font-medium">{{ materialsTotal() | currencyArs }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.created' | translate }}
            </span>
            <span>{{ createdAt() | relativeDate }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WorkOrderSidebarComponent {
  technicians = input.required<Technician[]>();
  completedTasks = input.required<number>();
  totalTasks = input.required<number>();
  materialsTotal = input.required<number>();
  createdAt = input.required<string>();
  editTechnicians = output<void>();
}