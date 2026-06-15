import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import {
  WorkOrder,
  WorkOrderStatus,
  WorkOrderPriority,
} from '../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { WorkOrderFormComponent } from './work-order-form.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-work-orders-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    TrackingCodeComponent,
    DatePipe,
  ],
  template: `
    <div class="space-y-4">
      <app-page-header
        title="Órdenes de Trabajo"
        subtitle="Gestiona las órdenes de servicio técnico"
        actionLabel="Nueva Orden"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="flex gap-3 flex-wrap">
        <mat-form-field appearance="outline" class="w-40">
          <mat-label>Estado</mat-label>
          <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
            <mat-option>Todos</mat-option>
            <mat-option value="pending">Pendiente</mat-option>
            <mat-option value="assigned">Asignada</mat-option>
            <mat-option value="in_progress">En Progreso</mat-option>
            <mat-option value="completed">Completada</mat-option>
            <mat-option value="delivered">Entregada</mat-option>
            <mat-option value="cancelled">Cancelada</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-40">
          <mat-label>Prioridad</mat-label>
          <mat-select
            [value]="priorityFilter()"
            (selectionChange)="priorityFilter.set($event.value)"
          >
            <mat-option>Todas</mat-option>
            <mat-option value="low">Baja</mat-option>
            <mat-option value="medium">Media</mat-option>
            <mat-option value="high">Alta</mat-option>
            <mat-option value="urgent">Urgente</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (workOrdersResource.status() === 'loading' && !workOrdersResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (workOrdersResource.error()) {
        <app-error-state (retry)="workOrdersResource.reload()" />
      } @else if (workOrdersResource.hasValue() && workOrdersResource.value().data.length === 0) {
        <app-empty-state
          title="Sin órdenes"
          message="No hay órdenes de trabajo registradas. Crea tu primera orden para comenzar."
          actionLabel="Crear Orden"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (workOrdersResource.hasValue()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="workOrdersResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="trackingCode">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Código
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <app-tracking-code [code]="order.trackingCode" />
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Estado
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <app-status-badge [value]="order.status" type="workOrderStatus" />
              </td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Prioridad
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <app-status-badge [value]="order.priority" type="workOrderPriority" />
              </td>
            </ng-container>

            <ng-container matColumnDef="client">
              <th
                mat-header-cell
                mat-sort-header="client"
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Cliente
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-900">
                {{ order.client.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="serviceType">
              <th
                mat-header-cell
                mat-sort-header="serviceType"
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Servicio
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-500">
                {{ order.serviceType.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="scheduledDate">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Fecha
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-500">
                @if (order.scheduledDate) {
                  {{ order.scheduledDate | date: 'dd/MM/yyyy' }}
                } @else {
                  -
                }
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Creado
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3 text-sm text-gray-500">
                {{ order.createdAt | date: 'dd/MM/yyyy HH:mm' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"
              >
                Acciones
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3 text-right">
                <button mat-icon-button (click)="viewDetail(order)" title="Ver detalle">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              class="hover:bg-gray-50 cursor-pointer"
              (click)="viewDetail(row)"
            ></tr>
          </table>

          <mat-paginator
            [length]="workOrdersResource.value().total"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons
          />
        </div>
      }
    </div>
  `,
})
export class WorkOrdersListComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<WorkOrderStatus | ''>('');
  readonly priorityFilter = signal<WorkOrderPriority | ''>('');
  readonly sortBy = signal('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  readonly workOrdersResource = httpResource<PaginatedResponse<WorkOrder>>(
    () => ({
      url: '/api/work-orders',
      params: {
        page: this.currentPage(),
        limit: this.pageSize(),
        ...(this.statusFilter() ? { status: this.statusFilter() } : {}),
        ...(this.priorityFilter() ? { priority: this.priorityFilter() } : {}),
        ...(this.sortBy() ? { sortBy: this.sortBy(), order: this.sortOrder().toUpperCase() } : {}),
      },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<WorkOrder>>).data,
    },
  );

  displayedColumns = [
    'trackingCode',
    'status',
    'priority',
    'client',
    'serviceType',
    'scheduledDate',
    'createdAt',
    'actions',
  ];

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(WorkOrderFormComponent, {
      width: '700px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.workOrdersResource.reload();
    });
  }

  viewDetail(order: WorkOrder): void {
    this.router.navigate(['/admin/work-orders', order.id]);
  }
}
