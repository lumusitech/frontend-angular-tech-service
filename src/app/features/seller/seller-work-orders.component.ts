import { Component, inject, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';

@Component({
  selector: 'app-seller-work-orders',
  imports: [MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">Órdenes</h1>
      </div>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
        </div>
      } @else if (resource.value(); as result) {
        @let orders = result.data;

        @if (orders.length === 0) {
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No hay órdenes asignadas</p>
          </div>
        }

        <div class="space-y-3">
          @for (order of orders; track order.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">{{ order.trackingCode }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                      [class]="statusClass(order.status)">{{ order.status }}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ order.client.name }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ order.serviceType.name }}</p>
              @if (order.commissionPercent != null) {
                <p class="text-xs text-green-600 dark:text-green-400 mt-1">
                  Comisión: {{ order.commissionPercent }}%
                </p>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SellerWorkOrdersComponent {
  private readonly authService = inject(AuthService);

  private readonly sellerId = computed(() => this.authService.user()?.id);

  readonly resource = httpResource<PaginatedResponse<WorkOrder>>(
    () => this.sellerId() ? `/api/work-orders?sellerId=${this.sellerId()}&limit=50` : undefined,
  );

  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      postponed: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }
}
