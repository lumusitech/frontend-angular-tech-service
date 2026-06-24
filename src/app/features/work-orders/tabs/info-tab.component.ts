import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkOrder } from '../../../core/models/work-order.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-info-tab',
  imports: [DatePipe, TranslatePipe],
  template: `
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'workOrders.detail.client' | translate }}
          </p>
          <p class="font-medium">{{ workOrder().client.name }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ workOrder().client.email }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ workOrder().client.phone }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'workOrders.detail.location' | translate }}
          </p>
          <p class="font-medium">
            {{
              workOrder().location === 'workshop'
                ? ('workOrders.locations.workshop' | translate)
                : ('workOrders.locations.onSite' | translate)
            }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'workOrders.workAddress' | translate }}
          </p>
          <p class="font-medium">{{ workOrder().workAddress || '-' }}</p>
        </div>
        @if (workOrder().client.address && workOrder().workAddress && workOrder().client.address !== workOrder().workAddress) {
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'common.address' | translate }} {{ 'workOrders.detail.client' | translate }}
            </p>
            <p class="font-medium">{{ workOrder().client.address }}</p>
          </div>
        }
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'workOrders.detail.scheduledDate' | translate }}
          </p>
          <p class="font-medium">
            {{ workOrder().scheduledDate ? (workOrder().scheduledDate | date: 'dd/MM/yyyy') : '-' }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'workOrders.detail.warrantyUntil' | translate }}
          </p>
          <p class="font-medium">
            {{ workOrder().warrantyUntil ? (workOrder().warrantyUntil | date: 'dd/MM/yyyy') : '-' }}
          </p>
        </div>
      </div>
      @if (workOrder().diagnosis) {
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ 'workOrders.detail.diagnosis' | translate }}
          </p>
          <p class="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {{ workOrder().diagnosis }}
          </p>
        </div>
      }
    </div>
  `,
})
export class InfoTabComponent {
  workOrder = input.required<WorkOrder>();
}
