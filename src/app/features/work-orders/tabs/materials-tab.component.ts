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
    <div class="p-4">
      <div class="flex justify-end mb-4">
        <button mat-stroked-button color="primary" (click)="addMaterial.emit()">
          <mat-icon>add</mat-icon>
          {{ 'workOrders.materials.addMaterial' | translate }}
        </button>
      </div>
      @if (!materials() || materials().length === 0) {
        <p class="text-gray-500 dark:text-gray-400 text-center py-8">
          {{ 'workOrders.materials.noMaterials' | translate }}
        </p>
      } @else {
        <div class="overflow-x-auto">
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
                <td class="py-2 px-3 text-right">{{ total() | currencyArs }}</td>
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
