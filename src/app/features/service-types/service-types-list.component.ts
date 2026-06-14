import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ServiceType } from '../../core/models/service-type.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceTypeFormComponent } from './service-type-form.component';

@Component({
  selector: 'app-service-types-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  template: `
    <div class="space-y-4">
      <app-page-header
        title="Tipos de Servicio"
        subtitle="Gestiona el catálogo de servicios"
        actionLabel="Nuevo Servicio"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      @if (serviceTypesResource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (serviceTypesResource.error()) {
        <app-error-state (retry)="serviceTypesResource.reload()" />
      } @else if (
        serviceTypesResource.hasValue() && serviceTypesResource.value().data.length === 0
      ) {
        <app-empty-state
          title="Sin servicios"
          message="No hay tipos de servicio registrados. Crea tu primer servicio para comenzar."
          actionLabel="Crear Servicio"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (serviceTypesResource.hasValue()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table mat-table [dataSource]="serviceTypesResource.value().data" class="w-full">
            <ng-container matColumnDef="name">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Nombre
              </th>
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3 text-sm text-gray-900">
                {{ serviceType.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Descripción
              </th>
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3 text-sm text-gray-500">
                {{ serviceType.description || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="estimatedDuration">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Duración Est.
              </th>
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3 text-sm text-gray-500">
                @if (serviceType.estimatedDuration) {
                  {{ serviceType.estimatedDuration }} min
                } @else {
                  -
                }
              </td>
            </ng-container>

            <ng-container matColumnDef="isActive">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Estado
              </th>
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3">
                <app-status-badge [value]="serviceType.isActive" type="activeInactive" />
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
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3 text-right">
                <button mat-icon-button (click)="openEditDialog(serviceType)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteServiceType(serviceType)"
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
            [length]="serviceTypesResource.value().total"
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
export class ServiceTypesListComponent {
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly dialog = inject(MatDialog);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);

  readonly serviceTypesResource = httpResource<PaginatedResponse<ServiceType>>(
    () => `/api/service-types?page=${this.currentPage()}&limit=${this.pageSize()}`,
  );

  displayedColumns = ['name', 'description', 'estimatedDuration', 'isActive', 'actions'];

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ServiceTypeFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.serviceTypesResource.reload();
    });
  }

  openEditDialog(serviceType: ServiceType): void {
    const dialogRef = this.dialog.open(ServiceTypeFormComponent, {
      width: '600px',
      data: { mode: 'edit', serviceType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.serviceTypesResource.reload();
    });
  }

  deleteServiceType(serviceType: ServiceType): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar tipo de servicio',
        message: `¿Estás seguro de eliminar "${serviceType.name}"?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.serviceTypesService.delete(serviceType.id).subscribe({
          next: () => this.serviceTypesResource.reload(),
        });
      }
    });
  }
}
