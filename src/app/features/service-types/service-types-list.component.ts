import { Component, inject, signal, OnInit } from '@angular/core';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ServiceType, ServiceTypeFilters } from '../../core/models/service-type.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
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
  ],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Tipos de Servicio</h1>
          <p class="text-gray-500 mt-1">Gestiona el catálogo de servicios</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Servicio
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (serviceTypes().length === 0) {
        <app-empty-state
          title="Sin servicios"
          message="No hay tipos de servicio registrados. Crea tu primer servicio para comenzar."
          actionLabel="Crear Servicio"
          [action]="openCreateDialog.bind(this)"
        />
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table mat-table [dataSource]="serviceTypes()" class="w-full">
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
                @if (serviceType.isActive) {
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    Activo
                  </span>
                } @else {
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    Inactivo
                  </span>
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
            [length]="totalServiceTypes()"
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
export class ServiceTypesListComponent implements OnInit {
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly dialog = inject(MatDialog);

  readonly serviceTypes = signal<ServiceType[]>([]);
  readonly loading = signal(true);
  readonly totalServiceTypes = signal(0);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);

  displayedColumns = ['name', 'description', 'estimatedDuration', 'isActive', 'actions'];

  ngOnInit(): void {
    this.loadServiceTypes();
  }

  loadServiceTypes(): void {
    this.loading.set(true);
    const filters: ServiceTypeFilters = {
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    this.serviceTypesService.getAll(filters).subscribe({
      next: (response) => {
        this.serviceTypes.set(response.data);
        this.totalServiceTypes.set(response.total);
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
    this.loadServiceTypes();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ServiceTypeFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadServiceTypes();
      }
    });
  }

  openEditDialog(serviceType: ServiceType): void {
    const dialogRef = this.dialog.open(ServiceTypeFormComponent, {
      width: '600px',
      data: { mode: 'edit', serviceType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadServiceTypes();
      }
    });
  }

  deleteServiceType(serviceType: ServiceType): void {
    if (confirm(`¿Estás seguro de eliminar "${serviceType.name}"?`)) {
      this.serviceTypesService.delete(serviceType.id).subscribe({
        next: () => this.loadServiceTypes(),
      });
    }
  }
}
