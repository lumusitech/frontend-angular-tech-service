import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Client } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DatePipe } from '@angular/common';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-client-detail',
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    StatusBadgeComponent,
    ErrorStateComponent,
    TrackingCodeComponent,
    TranslatePipe,
    DatePipe,
    RelativeDatePipe,
  ],
  template: `
    @if (clientResource.status() === 'loading' && !clientResource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (clientResource.error()) {
      <app-error-state
        [title]="'clients.detail.loadError' | translate"
        [message]="'clients.detail.loadErrorMessage' | translate"
        (retry)="clientResource.reload()"
      />
    } @else if (clientResource.hasValue()) {
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ clientResource.value().name }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'clients.detail.subtitle' | translate }}
            </p>
          </div>
          <button
            mat-stroked-button
            (click)="viewReport()"
            class="!text-blue-600 dark:!text-blue-400 !border-blue-200 dark:!border-blue-800"
          >
            <mat-icon>assessment</mat-icon>
            {{ 'clients.detail.viewReport' | translate }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {{ 'clients.detail.clientInfo' | translate }}
              </h2>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {{ 'clients.name' | translate }}
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ clientResource.value().name }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {{ 'clients.email' | translate }}
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ clientResource.value().email }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {{ 'clients.phone' | translate }}
                  </dt>
                  <dd class="mt-1 flex items-center gap-1">
                    <a
                      [href]="'tel:' + clientResource.value().phone"
                      class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {{ clientResource.value().phone }}
                    </a>
                    @if (clientResource.value().phone) {
                      <a
                        [href]="'tel:' + clientResource.value().phone"
                        mat-icon-button
                        class="!min-w-0 !p-0.5"
                        [title]="'common.call' | translate"
                      >
                        <mat-icon class="!text-[14px] !w-[14px] !h-[14px] !text-blue-500"
                          >phone</mat-icon
                        >
                      </a>
                      <a
                        [href]="
                          'https://wa.me/' + encodeURIComponent(clientResource.value().phone!)
                        "
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors p-0.5"
                        [title]="'common.whatsapp' | translate"
                      >
                        <svg class="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                          <path
                            d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.004c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.198 8.198 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.188 8.188 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.21 8.24zm4.52-6.18c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.76 2.69 4.26 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z"
                          />
                        </svg>
                      </a>
                    }
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {{ 'common.address' | translate }}
                  </dt>
                  <dd class="mt-1 flex items-center gap-1">
                    @if (clientResource.value().address) {
                      <a
                        [href]="
                          'https://maps.google.com/?q=' +
                          encodeURIComponent(clientResource.value().address!)
                        "
                        target="_blank"
                        rel="noopener"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {{ clientResource.value().address }}
                      </a>
                      <a
                        [href]="
                          'https://maps.google.com/?q=' +
                          encodeURIComponent(clientResource.value().address!)
                        "
                        target="_blank"
                        rel="noopener"
                        mat-icon-button
                        class="!min-w-0 !p-0.5"
                        [title]="'common.openInMaps' | translate"
                      >
                        <mat-icon class="!text-[14px] !w-[14px] !h-[14px] !text-green-500"
                          >location_on</mat-icon
                        >
                      </a>
                    } @else {
                      <span class="text-sm text-gray-900 dark:text-gray-100">-</span>
                    }
                  </dd>
                </div>
                @if (clientResource.value().cuit) {
                  <div>
                    <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'clients.cuit' | translate }}
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {{ clientResource.value().cuit }}
                    </dd>
                  </div>
                }
                @if (clientResource.value().ivaCondition) {
                  <div>
                    <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {{ 'clients.ivaCondition' | translate }}
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {{
                        'clients.ivaConditions.' + clientResource.value().ivaCondition! | translate
                      }}
                    </dd>
                  </div>
                }
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {{ 'common.status' | translate }}
                  </dt>
                  <dd class="mt-1">
                    <app-status-badge
                      [value]="clientResource.value().isActive"
                      type="activeInactive"
                    />
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {{ 'common.created' | translate }}
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ clientResource.value().createdAt | relativeDate }}
                  </dd>
                </div>
              </dl>
            </div>

            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {{ 'clients.detail.workOrders' | translate }}
              </h2>

              @if (workOrdersResource.isLoading()) {
                <div class="flex justify-center py-6">
                  <mat-spinner diameter="32" />
                </div>
              } @else if (
                workOrdersResource.hasValue() && workOrdersResource.value().data.length === 0
              ) {
                <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                  {{ 'clients.detail.noOrdersMessage' | translate }}
                </p>
              } @else if (workOrdersResource.hasValue()) {
                <table mat-table [dataSource]="workOrdersResource.value().data" class="w-full">
                  <ng-container matColumnDef="trackingCode">
                    <th
                      mat-header-cell
                      *matHeaderCellDef
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {{ 'workOrders.trackingCode' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3">
                      <a
                        [routerLink]="['/admin/work-orders', order.id]"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <app-tracking-code [code]="order.trackingCode" />
                      </a>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th
                      mat-header-cell
                      *matHeaderCellDef
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {{ 'common.status' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3">
                      <app-status-badge [value]="order.status" type="workOrderStatus" />
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="priority">
                    <th
                      mat-header-cell
                      *matHeaderCellDef
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {{ 'workOrders.priority' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let order" class="px-4 py-3">
                      <app-status-badge [value]="order.priority" type="workOrderPriority" />
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="serviceType">
                    <th
                      mat-header-cell
                      *matHeaderCellDef
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {{ 'workOrders.serviceType' | translate }}
                    </th>
                    <td
                      mat-cell
                      *matCellDef="let order"
                      class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {{ order.serviceType.name }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="scheduledDate">
                    <th
                      mat-header-cell
                      *matHeaderCellDef
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {{ 'workOrders.scheduledDate' | translate }}
                    </th>
                    <td
                      mat-cell
                      *matCellDef="let order"
                      class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                    >
                      @if (order.scheduledDate) {
                        {{ order.scheduledDate | date: 'dd/MM/yyyy' }}
                      } @else {
                        <span class="text-gray-400">—</span>
                      }
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="createdAt">
                    <th
                      mat-header-cell
                      *matHeaderCellDef
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {{ 'common.created' | translate }}
                    </th>
                    <td
                      mat-cell
                      *matCellDef="let order"
                      class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ order.createdAt | relativeDate }}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr
                    mat-row
                    *matRowDef="let row; columns: displayedColumns"
                    [routerLink]="['/admin/work-orders', row.id]"
                    class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  ></tr>
                </table>
              }
            </div>
          </div>

          <div class="space-y-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {{ 'clients.detail.kpis' | translate }}
              </h2>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{
                    'clients.detail.totalOrders' | translate
                  }}</span>
                  <span class="text-lg font-bold text-gray-900 dark:text-gray-100">{{
                    totalOrders()
                  }}</span>
                </div>
                <div
                  class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{
                    'clients.detail.completedOrders' | translate
                  }}</span>
                  <span class="text-lg font-bold text-green-600 dark:text-green-400">{{
                    completedOrders()
                  }}</span>
                </div>
                <div
                  class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{
                    'clients.detail.pendingOrders' | translate
                  }}</span>
                  <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">{{
                    pendingOrders()
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly clientId = signal(this.route.snapshot.paramMap.get('id') || '');

  readonly clientResource = httpResource<Client>(() => ({
    url: `/api/clients/${this.clientId()}`,
  }));

  readonly workOrdersResource = httpResource<PaginatedResponse<WorkOrder>>(() => ({
    url: '/api/work-orders',
    params: { clientId: this.clientId(), limit: 50 },
  }));

  readonly totalOrders = computed(() => this.workOrdersResource.value()?.total || 0);

  readonly completedOrders = computed(
    () =>
      this.workOrdersResource
        .value()
        ?.data.filter((o) => o.status === 'completed' || o.status === 'delivered').length || 0,
  );

  readonly pendingOrders = computed(
    () =>
      this.workOrdersResource
        .value()
        ?.data.filter(
          (o) => o.status === 'pending' || o.status === 'assigned' || o.status === 'in_progress',
        ).length || 0,
  );

  readonly displayedColumns = [
    'trackingCode',
    'status',
    'priority',
    'serviceType',
    'scheduledDate',
    'createdAt',
  ];

  goBack(): void {
    this.router.navigate(['/admin/clients']);
  }

  viewReport(): void {
    this.router.navigate(['/admin/reports/clients', this.clientId()]);
  }

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }
}
