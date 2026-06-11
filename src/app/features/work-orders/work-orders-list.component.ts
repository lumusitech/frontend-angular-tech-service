import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import {
  WorkOrder,
  WorkOrderFilters,
  WorkOrderStatus,
  WorkOrderPriority,
} from '../../core/models/work-order.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { WorkOrderFormComponent } from './work-order-form.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-work-orders-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    DatePipe,
  ],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h1>
          <p class="text-gray-500 mt-1">Gestiona las órdenes de servicio técnico</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nueva Orden
        </button>
      </div>

      <div class="flex gap-3 flex-wrap">
        <mat-form-field appearance="outline" class="w-40">
          <mat-label>Estado</mat-label>
          <mat-select
            [value]="statusFilter()"
            (selectionChange)="statusFilter.set($event.value); loadWorkOrders()"
          >
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
            (selectionChange)="priorityFilter.set($event.value); loadWorkOrders()"
          >
            <mat-option>Todas</mat-option>
            <mat-option value="low">Baja</mat-option>
            <mat-option value="medium">Media</mat-option>
            <mat-option value="high">Alta</mat-option>
            <mat-option value="urgent">Urgente</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (workOrders().length === 0) {
        <app-empty-state
          title="Sin órdenes"
          message="No hay órdenes de trabajo registradas. Crea tu primera orden para comenzar."
          actionLabel="Crear Orden"
          [action]="openCreateDialog.bind(this)"
        />
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table mat-table [dataSource]="workOrders()" class="w-full">
            <ng-container matColumnDef="trackingCode">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Código
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <span class="font-mono text-sm font-medium text-blue-600">
                  {{ order.trackingCode }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Estado
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="getStatusClass(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Prioridad
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="getPriorityClass(order.priority)"
                >
                  {{ getPriorityLabel(order.priority) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="client">
              <th
                mat-header-cell
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
            [length]="totalWorkOrders()"
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
export class WorkOrdersListComponent implements OnInit {
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly workOrders = signal<WorkOrder[]>([]);
  readonly loading = signal(true);
  readonly totalWorkOrders = signal(0);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<WorkOrderStatus | ''>('');
  readonly priorityFilter = signal<WorkOrderPriority | ''>('');

  displayedColumns = [
    'trackingCode',
    'status',
    'priority',
    'client',
    'serviceType',
    'scheduledDate',
    'actions',
  ];

  ngOnInit(): void {
    this.loadWorkOrders();
  }

  loadWorkOrders(): void {
    this.loading.set(true);
    const filters: WorkOrderFilters = {
      page: this.currentPage(),
      limit: this.pageSize(),
      status: (this.statusFilter() as WorkOrderStatus) || undefined,
      priority: (this.priorityFilter() as WorkOrderPriority) || undefined,
    };

    this.workOrdersService.getAll(filters).subscribe({
      next: (response) => {
        this.workOrders.set(response.data);
        this.totalWorkOrders.set(response.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadWorkOrders();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(WorkOrderFormComponent, {
      width: '700px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadWorkOrders();
      }
    });
  }

  viewDetail(order: WorkOrder): void {
    this.router.navigate(['/admin/work-orders', order.id]);
  }

  getStatusClass(status: WorkOrderStatus): string {
    const classes: Record<WorkOrderStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      postponed: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: WorkOrderStatus): string {
    const labels: Record<WorkOrderStatus, string> = {
      pending: 'Pendiente',
      assigned: 'Asignada',
      in_progress: 'En Progreso',
      postponed: 'Pospuesta',
      completed: 'Completada',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  }

  getPriorityClass(priority: WorkOrderPriority): string {
    const classes: Record<WorkOrderPriority, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getPriorityLabel(priority: WorkOrderPriority): string {
    const labels: Record<WorkOrderPriority, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return labels[priority] || priority;
  }
}
