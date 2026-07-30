import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toLocalDateString, parseLocalDate } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ExpensesService } from '../../core/services/expenses.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { Expense, ExpenseCategory } from '../../core/models/expense.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { ExpenseFormComponent } from './expense-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

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
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAccordion,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    CurrencyArsPipe,
    MobileCardComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'expenses.title' | translate"
        [subtitle]="'expenses.subtitle' | translate"
        [actionLabel]="'expenses.newExpense' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-48">
            <mat-label>{{ 'expenses.category' | translate }}</mat-label>
            <mat-select
              [value]="categoryFilter()"
              (selectionChange)="categoryFilter.set($event.value)"
            >
              <mat-option>{{ 'expenses.filters.allCategories' | translate }}</mat-option>
              <mat-option value="rent">{{ 'expenses.categories.rent' | translate }}</mat-option>
              <mat-option value="utilities">{{
                'expenses.categories.utilities' | translate
              }}</mat-option>
              <mat-option value="salaries">{{
                'expenses.categories.salaries' | translate
              }}</mat-option>
              <mat-option value="tools">{{ 'expenses.categories.tools' | translate }}</mat-option>
              <mat-option value="transport">{{
                'expenses.categories.transport' | translate
              }}</mat-option>
              <mat-option value="advertising">{{
                'expenses.categories.advertising' | translate
              }}</mat-option>
              <mat-option value="supplies">{{
                'expenses.categories.supplies' | translate
              }}</mat-option>
              <mat-option value="maintenance">{{
                'expenses.categories.maintenance' | translate
              }}</mat-option>
              <mat-option value="hosting">{{ 'expenses.categories.hosting' | translate }}</mat-option>
              <mat-option value="other">{{ 'expenses.categories.other' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.search' | translate }}</mat-label>
            <input matInput [value]="searchFilter()" (input)="searchFilter.set(getInputValue($event))" [placeholder]="'common.search' | translate" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateFromPicker" [value]="dateFromValue()" (dateChange)="onDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateFromPicker></mat-datepicker>
          </mat-form-field>
            <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.to' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateToPicker" [value]="dateToValue()" (dateChange)="onDateToChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateToPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateToPicker></mat-datepicker>
          </mat-form-field>

          @if (hasActiveFilters()) {
            <button mat-stroked-button (click)="clearFilters()" class="!text-gray-500 dark:!text-gray-400">
              <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
              {{ 'common.clearFilters' | translate }}
            </button>
          }
        </div>
      </div>

      @if (expensesResource.status() === 'loading' && !expensesResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (expensesResource.error()) {
        <app-error-state (retry)="expensesResource.reload()" />
      } @else if (expensesResource.hasValue() && expensesResource.value().data.length === 0) {
        <app-empty-state
          [title]="'expenses.noExpenses' | translate"
          [message]="'expenses.noExpensesMessage' | translate"
          [actionLabel]="'expenses.createExpense' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (expensesResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (expense of expensesResource.value().data; track expense.id) {
            <app-mobile-card
              [title]="expense.description"
              [status]="expense.category"
              [statusType]="$any('expenseCategory')"
              [fields]="getExpenseFields(expense)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(expense)"
              [onDelete]="onDeleteSwipe(expense)"
            >
              <button mat-icon-button (click)="openEditDialog(expense); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteExpense(expense); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
                <mat-icon class="!w-4 !h-4">delete</mat-icon>
              </button>
            </app-mobile-card>
          }
        </mat-accordion>

        <!-- Desktop: Table -->
        <div
          class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="expensesResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="description">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'expenses.description' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let expense"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ expense.description }}
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'expenses.category' | translate }}
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
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'expenses.amount' | translate }}
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
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'expenses.date' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let expense"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ expense.date | relativeDate }}
              </td>
            </ng-container>

            <ng-container matColumnDef="isRecurring">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'expenses.recurring' | translate }}
              </th>
              <td mat-cell *matCellDef="let expense" class="px-4 py-3">
                @if (expense.isRecurring) {
                  <mat-icon class="text-green-500">check_circle</mat-icon>
                } @else {
                  <mat-icon class="text-gray-300 dark:text-gray-600">cancel</mat-icon>
                }
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
                *matCellDef="let expense"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ expense.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let expense" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="openEditDialog(expense); $event.stopPropagation()"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteExpense(expense); $event.stopPropagation()"
                  [title]="'common.delete' | translate"
                  color="warn"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" [class.highlight-pulse]="highlightedId() === row.id" (click)="openEditDialog(row)" class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"></tr>
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
export class ExpensesListComponent implements OnInit {
  private readonly expensesService = inject(ExpensesService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: false });

  readonly highlightedId = signal<string | null>(null);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly categoryFilter = signal<ExpenseCategory | ''>('');
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly searchFilter = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly dateFromValue = computed(() => this.dateFrom() ? parseLocalDate(this.dateFrom()) : null);
  readonly dateToValue = computed(() => this.dateTo() ? parseLocalDate(this.dateTo()) : null);

  readonly expensesResource = httpResource<PaginatedResponse<Expense>>(() => ({
    url: '/api/expenses',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.categoryFilter() ? { category: this.categoryFilter() } : {}),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      ...(this.dateFrom() ? { dateFrom: this.dateFrom() } : {}),
      ...(this.dateTo() ? { dateTo: this.dateTo() } : {}),
    },
  }));

  displayedColumns = [
    'description',
    'category',
    'amount',
    'date',
    'isRecurring',
    'createdAt',
    'actions',
  ];

  constructor() {
    effect(() => {
      const params = this.queryParams();
      if (!params) return;

      const search = params.get('search');
      if (search) {
        this.searchFilter.set(search);
      }

      const highlight = params.get('highlight');
      if (highlight) {
        this.highlightedId.set(highlight);
        const timeout = setTimeout(() => this.highlightedId.set(null), 3000);
        this.destroyRef.onDestroy(() => clearTimeout(timeout));
      }
    });
  }

  ngOnInit(): void {}

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    if (date) {
      this.dateFrom.set(toLocalDateString(date));
    } else {
      this.dateFrom.set('');
    }
  }

  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    if (date) {
      this.dateTo.set(toLocalDateString(date));
    } else {
      this.dateTo.set('');
    }
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

  readonly hasActiveFilters = computed(() => {
    return this.searchFilter() !== '' || this.categoryFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '';
  });

  clearFilters(): void {
    this.searchFilter.set('');
    this.categoryFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
  }

  getExpenseFields(expense: Expense): MobileCardField[] {
    return [
      { label: this.translationService.instant('expenses.amount'), value: String(expense.amount) },
      { label: this.translationService.instant('expenses.date'), value: expense.date, type: 'date' },
      { label: this.translationService.instant('expenses.recurring'), value: expense.isRecurring ? 'Sí' : 'No' },
      { label: this.translationService.instant('common.created'), value: expense.createdAt, type: 'date' },
    ];
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
          next: () => {
            this.toastService.show(this.translationService.instant('common.toast.deleted'), 'success');
            this.expensesResource.reload();
          },
          error: (err) => {
            const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorDeleted');
            this.toastService.show(msg, 'error');
          },
        });
      }
    });
  }

  onEditSwipe(expense: Expense): (event: Event) => void {
    return (_event: Event) => this.openEditDialog(expense);
  }

  onDeleteSwipe(expense: Expense): (event: Event) => void {
    return (_event: Event) => this.deleteExpense(expense);
  }
}
