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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      <div class="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700/70 p-4 shadow-xs backdrop-blur-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <mat-icon class="text-blue-500 w-4! h-4! text-base!">engineering</mat-icon>
            {{ 'workOrders.detail.assignedTechnicians' | translate }}
          </h3>
          <button mat-button color="primary" (click)="editTechnicians.emit()" class="px-2! py-1! min-h-8! text-xs font-medium">
            <mat-icon class="w-4! h-4! text-sm!">edit</mat-icon>
            {{ 'common.edit' | translate }}
          </button>
        </div>
        @if (technicians().length === 0) {
          <p class="text-xs text-gray-500 dark:text-gray-400 py-2">
            {{ 'workOrders.technicians.noTechnicians' | translate }}
          </p>
        } @else {
          <div class="space-y-2">
            @for (tech of technicians(); track tech.id) {
              <div class="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                <div class="w-7 h-7 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {{ tech.name.charAt(0) }}
                </div>
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ tech.name }}</span>
              </div>
            }
          </div>
        }
      </div>

      <div class="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700/70 p-4 shadow-xs backdrop-blur-sm">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <mat-icon class="text-emerald-500 w-4! h-4! text-base!">analytics</mat-icon>
          {{ 'workOrders.detail.summary' | translate }}
        </h3>
        <div class="space-y-2.5 text-xs sm:text-sm">
          <div class="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/40">
            <span class="text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.completedTasks' | translate }}
            </span>
            <span class="font-semibold text-gray-900 dark:text-gray-100">{{ completedTasks() }}/{{ totalTasks() }}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/40">
            <span class="text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.materialsCost' | translate }}
            </span>
            <span class="font-semibold text-gray-900 dark:text-gray-100">{{ materialsTotal() | currencyArs }}</span>
          </div>
          <div class="flex justify-between items-center py-1">
            <span class="text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.created' | translate }}
            </span>
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ createdAt() | relativeDate }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WorkOrderSidebarComponent {
  technicians = input.required<Technician[]>();
  completedTasks = input.required<number>();
  totalTasks = input.required<number>();
  materialsTotal = input.required<number>();
  createdAt = input.required<string>();
  editTechnicians = output<void>();
}
