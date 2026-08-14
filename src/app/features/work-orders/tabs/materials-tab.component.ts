import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkOrderMaterial } from '../../../core/models/work-order.interfaces';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-materials-tab',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, CurrencyArsPipe, TranslatePipe],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ 'workOrders.materials.materialsList' | translate }}
        </h3>
        <button
          mat-stroked-button
          color="primary"
          (click)="addMaterial.emit()"
          class="px-3! min-h-9! rounded-xl!"
        >
          <mat-icon class="text-sm shrink-0">add</mat-icon>
          <span class="text-xs sm:text-sm font-medium">{{
            'workOrders.materials.addMaterial' | translate
          }}</span>
        </button>
      </div>

      @if (!materials() || materials().length === 0) {
        <div
          class="text-center py-8 px-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700"
        >
          <mat-icon class="text-gray-400 dark:text-gray-500 text-2xl mb-1">build</mat-icon>
          <p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">
            {{ 'workOrders.materials.noMaterials' | translate }}
          </p>
        </div>
      } @else {
        <!-- Mobile Card View (<640px) -->
        <div class="space-y-3 block sm:hidden">
          @for (material of materials(); track material.id) {
            <div
              class="p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-2.5 shadow-2xs"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {{ material.description }}
                  </h4>
                  @if (material.supplier?.name) {
                    <span
                      class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                    >
                      <mat-icon class="text-xs leading-none shrink-0">store</mat-icon>
                      {{ material.supplier?.name }}
                    </span>
                  }
                </div>
                <div class="flex items-center gap-0.5 shrink-0">
                  <button
                    mat-icon-button
                    (click)="editMaterial.emit(material)"
                    class="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    [matTooltip]="'common.edit' | translate"
                  >
                    <mat-icon class="text-lg">edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    (click)="deleteMaterial.emit(material)"
                    class="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    [matTooltip]="'common.delete' | translate"
                  >
                    <mat-icon class="text-lg">delete</mat-icon>
                  </button>
                </div>
              </div>

              <div
                class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200/60 dark:border-gray-600/50"
              >
                <span>{{ material.quantity }} x {{ material.unitCost | currencyArs }}</span>
                <span class="font-semibold text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {{ getItemTotal(material) | currencyArs }}
                </span>
              </div>
            </div>
          }

          <div
            class="flex justify-between items-center p-3 bg-blue-50/80 dark:bg-blue-950/50 rounded-xl border border-blue-100 dark:border-blue-900/60 font-medium text-sm text-blue-900 dark:text-blue-200 shadow-2xs"
          >
            <span>{{ 'workOrders.materials.totalMaterials' | translate }}:</span>
            <span class="font-bold text-base text-blue-700 dark:text-blue-300 font-mono">
              {{ total() | currencyArs }}
            </span>
          </div>
        </div>

        <!-- Desktop Table View (>=640px) -->
        <div
          class="hidden sm:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700/80"
        >
          <table class="w-full text-sm">
            <thead>
              <tr
                class="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700"
              >
                <th class="text-left py-2.5 px-3.5 font-semibold text-gray-600 dark:text-gray-300">
                  {{ 'workOrders.materials.description' | translate }}
                </th>
                <th class="text-left py-2.5 px-3.5 font-semibold text-gray-600 dark:text-gray-300">
                  {{ 'workOrders.materials.supplier' | translate }}
                </th>
                <th class="text-right py-2.5 px-3.5 font-semibold text-gray-600 dark:text-gray-300">
                  {{ 'workOrders.materials.qty' | translate }}
                </th>
                <th class="text-right py-2.5 px-3.5 font-semibold text-gray-600 dark:text-gray-300">
                  {{ 'workOrders.materials.unitCost' | translate }}
                </th>
                <th class="text-right py-2.5 px-3.5 font-semibold text-gray-600 dark:text-gray-300">
                  {{ 'workOrders.materials.total' | translate }}
                </th>
                <th
                  class="text-center py-2.5 px-3.5 font-semibold text-gray-600 dark:text-gray-300 w-20"
                >
                  {{ 'common.actions' | translate }}
                </th>
              </tr>
            </thead>
            <tbody
              class="divide-y divide-gray-200 dark:divide-gray-700/70 bg-white dark:bg-gray-800"
            >
              @for (material of materials(); track material.id) {
                <tr class="hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors">
                  <td class="py-2.5 px-3.5 font-medium text-gray-900 dark:text-gray-100">
                    {{ material.description }}
                  </td>
                  <td class="py-2.5 px-3.5 text-gray-500 dark:text-gray-400">
                    {{ material.supplier?.name || '-' }}
                  </td>
                  <td class="py-2.5 px-3.5 text-right text-gray-700 dark:text-gray-300 font-mono">
                    {{ material.quantity }}
                  </td>
                  <td class="py-2.5 px-3.5 text-right text-gray-700 dark:text-gray-300 font-mono">
                    {{ material.unitCost | currencyArs }}
                  </td>
                  <td
                    class="py-2.5 px-3.5 text-right font-semibold text-gray-900 dark:text-gray-100 font-mono"
                  >
                    {{ getItemTotal(material) | currencyArs }}
                  </td>
                  <td class="py-2.5 px-3.5 text-center">
                    <div class="flex items-center justify-center gap-0.5">
                      <button
                        mat-icon-button
                        (click)="editMaterial.emit(material)"
                        class="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                        [matTooltip]="'common.edit' | translate"
                      >
                        <mat-icon class="text-lg">edit</mat-icon>
                      </button>
                      <button
                        mat-icon-button
                        (click)="deleteMaterial.emit(material)"
                        class="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        [matTooltip]="'common.delete' | translate"
                      >
                        <mat-icon class="text-lg">delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr
                class="bg-blue-50/70 dark:bg-blue-950/40 font-semibold text-blue-900 dark:text-blue-200 border-t-2 border-blue-200 dark:border-blue-800"
              >
                <td colspan="4" class="py-2.5 px-3.5 text-right">
                  {{ 'workOrders.materials.totalMaterials' | translate }}:
                </td>
                <td
                  class="py-2.5 px-3.5 text-right text-base font-bold text-blue-700 dark:text-blue-300 font-mono"
                >
                  {{ total() | currencyArs }}
                </td>
                <td></td>
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
  editMaterial = output<WorkOrderMaterial>();
  deleteMaterial = output<WorkOrderMaterial>();

  getItemTotal(material: WorkOrderMaterial): number {
    if (material.totalCost !== undefined && material.totalCost !== null) {
      return material.totalCost;
    }
    return (Number(material.quantity) || 0) * (Number(material.unitCost) || 0);
  }
}
