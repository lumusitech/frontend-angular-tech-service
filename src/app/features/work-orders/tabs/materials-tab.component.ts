import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrderMaterial } from '../../../core/models/work-order.interfaces';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-materials-tab',
  imports: [MatIconModule, MatButtonModule, CurrencyArsPipe, TranslatePipe],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex justify-end">
        <button mat-stroked-button color="primary" (click)="addMaterial.emit()" class="px-3! min-h-10! rounded-xl!">
          <mat-icon class="w-4! h-4! text-base!">add</mat-icon>
          {{ 'workOrders.materials.addMaterial' | translate }}
        </button>
      </div>
      @if (!materials() || materials().length === 0) {
        <p class="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
          {{ 'workOrders.materials.noMaterials' | translate }}
        </p>
      } @else {
        <!-- Mobile Card View (<640px) -->
        <div class="space-y-3 block sm:hidden">
          @for (material of materials(); track material.id) {
            <div class="p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="font-medium text-sm text-gray-900 dark:text-gray-100">{{ material.description }}</span>
                <span class="font-semibold text-sm text-gray-900 dark:text-gray-100 shrink-0">{{ material.totalCost | currencyArs }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200/60 dark:border-gray-600/50">
                <span>{{ material.supplier?.name || '-' }}</span>
                <span>{{ material.quantity }} x {{ material.unitCost | currencyArs }}</span>
              </div>
            </div>
          }
          <div class="flex justify-between items-center p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 font-medium text-sm text-blue-900 dark:text-blue-200">
            <span>{{ 'workOrders.materials.totalMaterials' | translate }}:</span>
            <span class="font-bold text-base">{{ total() | currencyArs }}</span>
          </div>
        </div>

        <!-- Desktop Table View (>=640px) -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                  {{ 'workOrders.materials.description' | translate }}
                </th>
                <th class="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                  {{ 'workOrders.materials.supplier' | translate }}
                </th>
                <th class="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                  {{ 'workOrders.materials.qty' | translate }}
                </th>
                <th class="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                  {{ 'workOrders.materials.unitCost' | translate }}
                </th>
                <th class="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                  {{ 'workOrders.materials.total' | translate }}
                </th>
              </tr>
            </thead>
            <tbody>
              @for (material of materials(); track material.id) {
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-2 px-3">{{ material.description }}</td>
                  <td class="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                    {{ material.supplier?.name || '-' }}
                  </td>
                  <td class="py-2 px-3 text-right">{{ material.quantity }}</td>
                  <td class="py-2 px-3 text-right">{{ material.unitCost | currencyArs }}</td>
                  <td class="py-2 px-3 text-right font-medium">{{ material.totalCost | currencyArs }}</td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr class="font-medium">
                <td colspan="4" class="py-2 px-3 text-right">
                  {{ 'workOrders.materials.totalMaterials' | translate }}:
                </td>
                <td class="py-2 px-3 text-right font-bold">{{ total() | currencyArs }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      }
    </div>
  `,
})
export class MaterialsTabComponent {
  materials = input.required<WorkOrderMaterial[]>();
  total = input.required<number>();
  addMaterial = output<void>();
}
