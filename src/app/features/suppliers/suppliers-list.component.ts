import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SuppliersService } from '../../core/services/suppliers.service';
import { Supplier } from '../../core/models/supplier.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SupplierFormComponent } from './supplier-form.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-suppliers-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    DatePipe,
  ],
  template: `
    <div class="space-y-4">
      <app-page-header
        title="Proveedores"
        subtitle="Gestiona tus proveedores"
        actionLabel="Nuevo Proveedor"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      @if (suppliersResource.status() === 'loading' && !suppliersResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (suppliersResource.error()) {
        <app-error-state (retry)="suppliersResource.reload()" />
      } @else if (suppliersResource.hasValue() && suppliersResource.value().data.length === 0) {
        <app-empty-state
          title="Sin proveedores"
          message="No hay proveedores registrados. Crea tu primer proveedor para comenzar."
          actionLabel="Crear Proveedor"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (suppliersResource.hasValue()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="suppliersResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="name">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Nombre
              </th>
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3 text-sm text-gray-900">
                {{ supplier.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="contact">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Contacto
              </th>
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3 text-sm text-gray-500">
                {{ supplier.contact }}
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Teléfono
              </th>
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3 text-sm text-gray-500">
                {{ supplier.phone }}
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Email
              </th>
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3 text-sm text-gray-500">
                {{ supplier.email || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="isActive">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Estado
              </th>
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3">
                <app-status-badge [value]="supplier.isActive" type="activeInactive" />
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
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3 text-sm text-gray-500">
                {{ supplier.createdAt | date: 'dd/MM/yyyy HH:mm' }}
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
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3 text-right">
                <button mat-icon-button (click)="openEditDialog(supplier)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteSupplier(supplier)"
                  title="Eliminar"
                  color="warn"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <mat-paginator
            [length]="suppliersResource.value().total"
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
export class SuppliersListComponent {
  private readonly suppliersService = inject(SuppliersService);
  private readonly dialog = inject(MatDialog);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  readonly suppliersResource = httpResource<PaginatedResponse<Supplier>>(
    () => ({
      url: '/api/suppliers',
      params: {
        page: this.currentPage(),
        limit: this.pageSize(),
        ...(this.sortBy() ? { sortBy: this.sortBy(), order: this.sortOrder().toUpperCase() } : {}),
      },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<Supplier>>).data,
    },
  );

  displayedColumns = ['name', 'contact', 'phone', 'email', 'isActive', 'createdAt', 'actions'];

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.suppliersResource.reload();
    });
  }

  openEditDialog(supplier: Supplier): void {
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: '600px',
      data: { mode: 'edit', supplier },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.suppliersResource.reload();
    });
  }

  deleteSupplier(supplier: Supplier): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar proveedor',
        message: `¿Estás seguro de eliminar a ${supplier.name}?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.suppliersService.delete(supplier.id).subscribe({
          next: () => this.suppliersResource.reload(),
        });
      }
    });
  }
}
