import { Component, inject, signal, OnInit } from '@angular/core';
import { ExpensesService } from '../../core/services/expenses.service';
import { Expense, ExpenseFilters, ExpenseCategory } from '../../core/models/expense.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ExpenseFormComponent } from './expense-form.component';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-expenses-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    EmptyStateComponent,
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gastos Operativos</h1>
          <p class="text-gray-500 mt-1">Gestiona los gastos del negocio</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Gasto
        </button>
      </div>

      <div class="flex gap-3 flex-wrap">
        <mat-form-field appearance="outline" class="w-48">
          <mat-label>Categoría</mat-label>
          <mat-select
            [value]="categoryFilter()"
            (selectionChange)="categoryFilter.set($event.value); loadExpenses()"
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

      @if (loading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (expenses().length === 0) {
        <app-empty-state
          title="Sin gastos"
          message="No hay gastos registrados. Crea tu primer gasto para comenzar."
          actionLabel="Crear Gasto"
          [action]="openCreateDialog.bind(this)"
        />
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table mat-table [dataSource]="expenses()" class="w-full">
            <ng-container matColumnDef="description">
              <th
                mat-header-cell
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
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Categoría
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="getCategoryClass(expense.category)"
                >
                  {{ getCategoryLabel(expense.category) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Monto
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3 text-sm font-medium">
                {{ expense.amount | currency: 'ARS' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th
                mat-header-cell
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
            [length]="totalExpenses()"
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
export class ExpensesListComponent implements OnInit {
  private readonly expensesService = inject(ExpensesService);
  private readonly dialog = inject(MatDialog);

  readonly expenses = signal<Expense[]>([]);
  readonly loading = signal(true);
  readonly totalExpenses = signal(0);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly categoryFilter = signal<ExpenseCategory | ''>('');

  displayedColumns = ['description', 'category', 'amount', 'date', 'isRecurring', 'actions'];

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.loading.set(true);
    const filters: ExpenseFilters = {
      page: this.currentPage(),
      limit: this.pageSize(),
      category: (this.categoryFilter() as ExpenseCategory) || undefined,
    };

    this.expensesService.getAll(filters).subscribe({
      next: (response) => {
        this.expenses.set(response.data);
        this.totalExpenses.set(response.total);
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
    this.loadExpenses();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ExpenseFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadExpenses();
      }
    });
  }

  openEditDialog(expense: Expense): void {
    const dialogRef = this.dialog.open(ExpenseFormComponent, {
      width: '600px',
      data: { mode: 'edit', expense },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadExpenses();
      }
    });
  }

  deleteExpense(expense: Expense): void {
    if (confirm(`¿Estás seguro de eliminar "${expense.description}"?`)) {
      this.expensesService.delete(expense.id).subscribe({
        next: () => this.loadExpenses(),
      });
    }
  }

  getCategoryClass(category: ExpenseCategory): string {
    const classes: Record<ExpenseCategory, string> = {
      rent: 'bg-purple-100 text-purple-800',
      utilities: 'bg-blue-100 text-blue-800',
      salaries: 'bg-green-100 text-green-800',
      tools: 'bg-orange-100 text-orange-800',
      transport: 'bg-yellow-100 text-yellow-800',
      advertising: 'bg-pink-100 text-pink-800',
      supplies: 'bg-indigo-100 text-indigo-800',
      maintenance: 'bg-red-100 text-red-800',
      hosting: 'bg-cyan-100 text-cyan-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return classes[category] || 'bg-gray-100 text-gray-800';
  }

  getCategoryLabel(category: ExpenseCategory): string {
    const labels: Record<ExpenseCategory, string> = {
      rent: 'Alquiler',
      utilities: 'Servicios',
      salaries: 'Sueldos',
      tools: 'Herramientas',
      transport: 'Transporte',
      advertising: 'Publicidad',
      supplies: 'Insumos',
      maintenance: 'Mantenimiento',
      hosting: 'Hosting',
      other: 'Otros',
    };
    return labels[category] || category;
  }
}
