import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { InquiriesService } from '../../core/services/inquiries.service';
import {
  Inquiry,
  InquiryStatus,
  InquirySource,
  PaginatedResponse,
} from '../../core/models/inquiry.interfaces';
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
import { InquiryFormComponent } from './inquiry-form.component';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const STATUS_LABELS: Record<string, string> = {
  new: 'Nueva',
  contacted: 'Contactada',
  reviewed: 'Revisada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  converted: 'Convertida',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  contacted: 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
  reviewed: 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  approved: 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  rejected: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  converted: 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
};

const SOURCE_LABELS: Record<string, string> = {
  phone: 'Teléfono',
  whatsapp: 'WhatsApp',
  email: 'Email',
  walk_in: 'Presencial',
  social_media: 'Redes sociales',
  referral: 'Referido',
};

@Component({
  selector: 'app-inquiries-list',
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
    TranslatePipe,
  ],
  template: `
    <div class="space-y-4">
      <app-page-header
        title="Consultas"
        subtitle="Gestión de consultas de clientes"
        actionLabel="Nueva consulta"
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
          title="Sin consultas"
          message="No hay consultas registradas"
          actionLabel="Crear consulta"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (resource.hasValue()) {
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="resource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="clientName">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Cliente
              </th>
              <td
                mat-cell
                *matCellDef="let inquiry"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ inquiry.clientName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="source">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Origen
              </th>
              <td mat-cell *matCellDef="let inquiry" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {{ getSourceLabel(inquiry.source) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Estado
              </th>
              <td mat-cell *matCellDef="let inquiry" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class]="getStatusColor(inquiry.status)"
                >
                  {{ getStatusLabel(inquiry.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="assignedTo">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Asignado a
              </th>
              <td
                mat-cell
                *matCellDef="let inquiry"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ inquiry.assignedTo?.name || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Fecha
              </th>
              <td
                mat-cell
                *matCellDef="let inquiry"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ inquiry.createdAt | date: 'dd/MM/yyyy HH:mm' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Acciones
              </th>
              <td mat-cell *matCellDef="let inquiry" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="viewDetail(inquiry)"
                  title="Ver detalle"
                >
                  <mat-icon>visibility</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="openEditDialog(inquiry)"
                  title="Editar"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteItem(inquiry)"
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
export class InquiriesListComponent {
  private readonly inquiriesService = inject(InquiriesService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');

  readonly resource = httpResource<PaginatedResponse<Inquiry>>(
    () => ({
      url: '/api/inquiries',
      params: {
        page: this.currentPage(),
        limit: this.pageSize(),
        sortBy: this.sortBy(),
        order: this.sortOrder(),
      },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<Inquiry>>).data,
    },
  );

  displayedColumns = ['clientName', 'source', 'status', 'assignedTo', 'createdAt', 'actions'];

  getStatusLabel(status: string): string {
    return STATUS_LABELS[status] || status;
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
  }

  getSourceLabel(source: string): string {
    return SOURCE_LABELS[source] || source;
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
    const dialogRef = this.dialog.open(InquiryFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }

  openEditDialog(inquiry: Inquiry): void {
    const dialogRef = this.dialog.open(InquiryFormComponent, {
      width: '600px',
      data: { mode: 'edit', inquiry },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }

  viewDetail(inquiry: Inquiry): void {
    this.router.navigate(['/admin/inquiries', inquiry.id]);
  }

  deleteItem(inquiry: Inquiry): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar consulta',
        message: `¿Estás seguro de eliminar la consulta de "${inquiry.clientName}"?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.inquiriesService.delete(inquiry.id).subscribe({
          next: () => this.resource.reload(),
        });
      }
    });
  }
}
