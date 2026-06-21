import { Component, inject, OnInit, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ServiceType } from '../../core/models/service-type.interfaces';
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
import { ServiceTypeFormComponent } from './service-type-form.component';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-service-types-list',
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
    TranslatePipe,
  ],
  template: `
    <div class="space-y-4">
      <app-page-header
        [title]="'serviceTypes.title' | translate"
        [subtitle]="'serviceTypes.subtitle' | translate"
        [actionLabel]="'serviceTypes.newServiceType' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      @if (serviceTypesResource.status() === 'loading' && !serviceTypesResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (serviceTypesResource.error()) {
        <app-error-state (retry)="serviceTypesResource.reload()" />
      } @else if (
        serviceTypesResource.hasValue() && serviceTypesResource.value().data.length === 0
      ) {
        <app-empty-state
          [title]="'serviceTypes.noServiceTypes' | translate"
          [message]="'serviceTypes.noServiceTypesMessage' | translate"
          [actionLabel]="'serviceTypes.createServiceType' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (serviceTypesResource.hasValue()) {
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="serviceTypesResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="name">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'serviceTypes.name' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ serviceType.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'serviceTypes.description' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ serviceType.description || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="estimatedDuration">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'serviceTypes.estimatedDuration' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
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
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'common.status' | translate }}
              </th>
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3">
                <app-status-badge [value]="serviceType.isActive" type="activeInactive" />
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'common.created' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ serviceType.createdAt | date: 'dd/MM/yyyy HH:mm' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'common.actions' | translate }}
              </th>
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="openEditDialog(serviceType)"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteServiceType(serviceType)"
                  [title]="'common.delete' | translate"
                  color="warn"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" [class.highlight-pulse]="highlightedId() === row.id"></tr>
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
export class ServiceTypesListComponent implements OnInit {
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);

  readonly highlightedId = signal<string | null>(null);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  readonly serviceTypesResource = httpResource<PaginatedResponse<ServiceType>>(
    () => ({
      url: '/api/service-types',
      params: {
        page: this.currentPage(),
        limit: this.pageSize(),
        ...(this.sortBy() ? { sortBy: this.sortBy(), order: this.sortOrder().toUpperCase() } : {}),
      },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<ServiceType>>).data,
    },
  );

  displayedColumns = [
    'name',
    'description',
    'estimatedDuration',
    'isActive',
    'createdAt',
    'actions',
  ];

  ngOnInit(): void {
    const highlightId = this.route.snapshot.queryParamMap.get('highlight');
    if (highlightId) {
      this.highlightedId.set(highlightId);
      setTimeout(() => this.highlightedId.set(null), 3000);
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
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
