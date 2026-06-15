import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ExpensesService } from '../../core/services/expenses.service';
import { Expense, ExpenseCategory } from '../../core/models/expense.interfaces';
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
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { ExpenseFormComponent } from './expense-form.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expenses-list',
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
    CurrencyArsPipe,
    DatePipe,
  ],
  template: `
    <div class="space-y-4">
      <app-page-header
        title="Gastos Operativos"
        subtitle="Gestiona los gastos del negocio"
        actionLabel="Nuevo Gasto"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="flex gap-3 flex-wrap">
        <mat-form-field appearance="outline" class="w-48">
          <mat-label>Categoría</mat-label>
          <mat-select
            [value]="categoryFilter()"
            (selectionChange)="categoryFilter.set($event.value)"
          >
            <mat-option>Todas</mat-option>
            <mat-option value="rent">Alquiler</mat-option>
            <mat-option value="utilities">Servicios</mat-option>
            <mat-option value="salaries">Sueldos</mat-option>
            <mat-option value="tools">Herramientas</mat-option>
            <mat-option value="transport">Transporte</mat-option>
            <mat-option value="advertising">Publicidad</mat-option>
            <mat-option value="supplies">Insumos</mat-option>
            <mat-option value="maintenance">Mantenimiento</mat-option>
            <mat-option value="hosting">Hosting</mat-option>
            <mat-option value="other">Otros</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (expensesResource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (expensesResource.error()) {
        <app-error-state (retry)="expensesResource.reload()" />
      } @else if (expensesResource.hasValue() && expensesResource.value().data.length === 0) {
        <app-empty-state
          title="Sin gastos"
          message="No hay gastos registrados. Crea tu primer gasto para comenzar."
          actionLabel="Crear Gasto"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (expensesResource.hasValue()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table
            mat-table
            matSort
            [dataSource]="expensesResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="description">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Descripción
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3 text-sm text-gray-900">
                {{ expense.description }}
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Categoría
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3">
                <app-status-badge [value]="expense.category" type="expenseCategory" />
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Monto
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3 text-sm font-medium">
                {{ expense.amount | currencyArs }}
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Fecha
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3 text-sm text-gray-500">
                {{ expense.date | date: 'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="isRecurring">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Recurrente
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3">
                @if (expense.isRecurring) {
                  <mat-icon class="text-green-500">check_circle</mat-icon>
                } @else {
                  <mat-icon class="text-gray-300">cancel</mat-icon>
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
              <td mat-cell *matCellDef="let expense" class="px-4 py-3 text-sm text-gray-500">
                {{ expense.createdAt | date: 'dd/MM/yyyy HH:mm' }}
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
              <td mat-cell *matCellDef="let expense" class="px-4 py-3 text-right">
                <button mat-icon-button (click)="openEditDialog(expense)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteExpense(expense)"
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
            [length]="expensesResource.value().total"
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
export class ExpensesListComponent {
  private readonly expensesService = inject(ExpensesService);
  private readonly dialog = inject(MatDialog);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly categoryFilter = signal<ExpenseCategory | ''>('');
  readonly sortBy = signal('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  readonly expensesResource = httpResource<PaginatedResponse<Expense>>(
    () => ({
      url: '/api/expenses',
      params: {
        page: this.currentPage(),
        limit: this.pageSize(),
        ...(this.categoryFilter() ? { category: this.categoryFilter() } : {}),
        ...(this.sortBy() ? { sortBy: this.sortBy(), order: this.sortOrder().toUpperCase() } : {}),
      },
    }),
    {
      parse: (res: unknown) => (res as ApiResponse<PaginatedResponse<Expense>>).data,
    },
  );

  displayedColumns = [
    'description',
    'category',
    'amount',
    'date',
    'isRecurring',
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
    const dialogRef = this.dialog.open(ExpenseFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.expensesResource.reload();
    });
  }

  openEditDialog(expense: Expense): void {
    const dialogRef = this.dialog.open(ExpenseFormComponent, {
      width: '600px',
      data: { mode: 'edit', expense },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.expensesResource.reload();
    });
  }

  deleteExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar gasto',
        message: `¿Estás seguro de eliminar "${expense.description}"?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.expensesService.delete(expense.id).subscribe({
          next: () => this.expensesResource.reload(),
        });
      }
    });
  }
}
