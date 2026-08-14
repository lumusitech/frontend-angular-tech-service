import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';

@Component({
  selector: 'app-seller-dashboard',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ authService.user()?.name }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Comisión: {{ authService.user()?.commission ?? 5 }}%
        </p>
      </div>

      @if (ordersResource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
        </div>
      } @else if (ordersResource.value(); as result) {
        @let orders = result.data;

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ orders.length }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Órdenes totales</p>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p class="text-2xl font-bold text-yellow-600">{{ pendingCount() }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Pendientes</p>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p class="text-2xl font-bold text-blue-600">{{ inProgressCount() }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">En progreso</p>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p class="text-2xl font-bold text-green-600">{{ completedCount() }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Completadas</p>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Órdenes recientes
            </h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            @for (order of orders.slice(0, 5); track order.id) {
              <a
                [routerLink]="['/seller/orders']"
                class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ order.trackingCode }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ order.client.name }}</p>
                </div>
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                  [class]="statusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class SellerDashboardComponent {
  readonly authService = inject(AuthService);

  private readonly sellerId = computed(() => this.authService.user()?.id);

  readonly ordersResource = httpResource<PaginatedResponse<WorkOrder>>(() =>
    this.sellerId() ? `/api/work-orders?sellerId=${this.sellerId()}&limit=100` : undefined,
  );

  readonly pendingCount = computed(
    () =>
      this.ordersResource
        .value()
        ?.data.filter((o) => o.status === 'pending' || o.status === 'assigned').length ?? 0,
  );
  readonly inProgressCount = computed(
    () => this.ordersResource.value()?.data.filter((o) => o.status === 'in_progress').length ?? 0,
  );
  readonly completedCount = computed(
    () =>
      this.ordersResource
        .value()
        ?.data.filter((o) => o.status === 'completed' || o.status === 'delivered').length ?? 0,
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
