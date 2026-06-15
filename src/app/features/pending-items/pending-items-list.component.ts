import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { PendingItemsService } from '../../core/services/pending-items.service';
import {
  PendingItem,
  PendingItemStatus,
  PendingItemPriority,
  PendingItemType,
  PaginatedResponse,
} from '../../core/models/pending-item.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PendingItemFormComponent } from './pending-item-form.component';
import { DatePipe } from '@angular/common';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-gray-600 bg-gray-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-orange-600 bg-orange-100',
  urgent: 'text-red-600 bg-red-100',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-700 bg-yellow-100',
  in_progress: 'text-blue-700 bg-blue-100',
  completed: 'text-green-700 bg-green-100',
  cancelled: 'text-gray-700 bg-gray-100',
};

const TYPE_LABELS: Record<string, string> = {
  work_order: 'Orden de trabajo',
  inquiry: 'Consulta',
  maintenance: 'Mantenimiento',
  follow_up: 'Seguimiento',
  other: 'Otro',
};

@Component({
  selector: 'app-pending-items-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    DatePipe,
  ],
  template: `
    <div class="space-y-4">
      <app-page-header
        title="Trabajo Pendiente"
        subtitle="Gestiona tus tareas y pendientes"
        actionLabel="Nuevo Pendiente"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      @if (resource.status() === 'loading' && !resource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (resource.error()) {
        <app-error-state (retry)="resource.reload()" />
      } @else if (resource.hasValue() && resource.value().data.length === 0) {
        <app-empty-state
          title="Sin pendientes"
          message="No hay trabajos pendientes. Crea tu primer pendiente para comenzar."
          actionLabel="Crear Pendiente"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (resource.hasValue()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="resource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="title">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Título
              </th>
              <td mat-cell *matCellDef="let item" class="px-4 py-3 text-sm text-gray-900">
                {{ item.title }}
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Tipo
              </th>
              <td mat-cell *matCellDef="let item" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {{ getTypeLabel(item.type) }}
                </span>
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
              <td mat-cell *matCellDef="let item" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class]="getPriorityColor(item.priority)"
                >
                  {{ getPriorityLabel(item.priority) }}
                </span>
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
              <td mat-cell *matCellDef="let item" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class]="getStatusColor(item.status)"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="dueDate">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Vencimiento
              </th>
              <td mat-cell *matCellDef="let item" class="px-4 py-3 text-sm text-gray-500">
                {{ item.dueDate | date: 'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="assignedTo">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Asignado a
              </th>
              <td mat-cell *matCellDef="let item" class="px-4 py-3 text-sm text-gray-500">
                {{ item.assignedTo?.name || '-' }}
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
              <td mat-cell *matCellDef="let item" class="px-4 py-3 text-sm text-gray-500">
                {{ item.createdAt | date: 'dd/MM/yyyy HH:mm' }}
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
              <td mat-cell *matCellDef="let item" class="px-4 py-3 text-right">
                <button mat-icon-button (click)="openEditDialog(item)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteItem(item)" title="Eliminar" color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <mat-paginator
            [length]="resource.value().total"
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
export class PendingItemsListComponent {
  private readonly pendingItemsService = inject(PendingItemsService);
  private readonly dialog = inject(MatDialog);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('dueDate');
  readonly sortOrder = signal<'ASC' | 'DESC'>('ASC');

  readonly resource = httpResource<PaginatedResponse<PendingItem>>(
    () => ({
      url: '/api/pending-items',
      params: {
        page: this.currentPage(),
        limit: this.pageSize(),
        sortBy: this.sortBy(),
        order: this.sortOrder(),
      },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<PendingItem>>).data,
    },
  );

  displayedColumns = [
    'title',
    'type',
    'priority',
    'status',
    'dueDate',
    'assignedTo',
    'createdAt',
    'actions',
  ];

  getPriorityLabel(priority: string): string {
    return PRIORITY_LABELS[priority] || priority;
  }

  getPriorityColor(priority: string): string {
    return PRIORITY_COLORS[priority] || 'text-gray-600 bg-gray-100';
  }

  getStatusLabel(status: string): string {
    return STATUS_LABELS[status] || status;
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'text-gray-600 bg-gray-100';
  }

  getTypeLabel(type: string): string {
    return TYPE_LABELS[type] || type;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortOrder.set((sort.direction || 'asc').toUpperCase() as 'ASC' | 'DESC');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PendingItemFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }

  openEditDialog(item: PendingItem): void {
    const dialogRef = this.dialog.open(PendingItemFormComponent, {
      width: '600px',
      data: { mode: 'edit', item },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }

  deleteItem(item: PendingItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar pendiente',
        message: `¿Estás seguro de eliminar "${item.title}"?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.pendingItemsService.delete(item.id).subscribe({
          next: () => this.resource.reload(),
        });
      }
    });
  }
}
