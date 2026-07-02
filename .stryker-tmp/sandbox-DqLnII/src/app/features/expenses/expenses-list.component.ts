// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
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
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, CurrencyArsPipe, MobileCardComponent, TranslatePipe, RelativeDatePipe],
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

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateFromPicker" [value]="dateFromValue()" (dateChange)="onDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateFromPicker></mat-datepicker>
          </mat-form-field>
            <mat-form-field appearance="outline" class="w-40">
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
  `
})
export class ExpensesListComponent implements OnInit {
  private readonly expensesService = inject(ExpensesService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly highlightedId = signal<string | null>(null);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly categoryFilter = signal<ExpenseCategory | ''>(stryMutAct_9fa48("2264") ? "Stryker was here!" : (stryCov_9fa48("2264"), ''));
  readonly sortBy = signal(stryMutAct_9fa48("2265") ? "" : (stryCov_9fa48("2265"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("2266") ? "" : (stryCov_9fa48("2266"), 'desc'));
  readonly searchFilter = signal(stryMutAct_9fa48("2267") ? "Stryker was here!" : (stryCov_9fa48("2267"), ''));
  readonly dateFrom = signal(stryMutAct_9fa48("2268") ? "Stryker was here!" : (stryCov_9fa48("2268"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("2269") ? "Stryker was here!" : (stryCov_9fa48("2269"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("2270") ? () => undefined : (stryCov_9fa48("2270"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("2271") ? () => undefined : (stryCov_9fa48("2271"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly expensesResource = httpResource<PaginatedResponse<Expense>>(stryMutAct_9fa48("2272") ? () => undefined : (stryCov_9fa48("2272"), () => stryMutAct_9fa48("2273") ? {} : (stryCov_9fa48("2273"), {
    url: stryMutAct_9fa48("2274") ? "" : (stryCov_9fa48("2274"), '/api/expenses'),
    params: stryMutAct_9fa48("2275") ? {} : (stryCov_9fa48("2275"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.categoryFilter() ? stryMutAct_9fa48("2276") ? {} : (stryCov_9fa48("2276"), {
        category: this.categoryFilter()
      }) : {}),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("2277") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("2277"), this.sortOrder().toUpperCase()),
      ...(this.searchFilter() ? stryMutAct_9fa48("2278") ? {} : (stryCov_9fa48("2278"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.dateFrom() ? stryMutAct_9fa48("2279") ? {} : (stryCov_9fa48("2279"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("2280") ? {} : (stryCov_9fa48("2280"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("2281") ? [] : (stryCov_9fa48("2281"), [stryMutAct_9fa48("2282") ? "" : (stryCov_9fa48("2282"), 'description'), stryMutAct_9fa48("2283") ? "" : (stryCov_9fa48("2283"), 'category'), stryMutAct_9fa48("2284") ? "" : (stryCov_9fa48("2284"), 'amount'), stryMutAct_9fa48("2285") ? "" : (stryCov_9fa48("2285"), 'date'), stryMutAct_9fa48("2286") ? "" : (stryCov_9fa48("2286"), 'isRecurring'), stryMutAct_9fa48("2287") ? "" : (stryCov_9fa48("2287"), 'createdAt'), stryMutAct_9fa48("2288") ? "" : (stryCov_9fa48("2288"), 'actions')]);
  ngOnInit(): void {
    if (stryMutAct_9fa48("2289")) {
      {}
    } else {
      stryCov_9fa48("2289");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("2290") ? "" : (stryCov_9fa48("2290"), 'highlight'));
      if (stryMutAct_9fa48("2292") ? false : stryMutAct_9fa48("2291") ? true : (stryCov_9fa48("2291", "2292"), highlightId)) {
        if (stryMutAct_9fa48("2293")) {
          {}
        } else {
          stryCov_9fa48("2293");
          this.highlightedId.set(highlightId);
          setTimeout(stryMutAct_9fa48("2294") ? () => undefined : (stryCov_9fa48("2294"), () => this.highlightedId.set(null)), 3000);
        }
      }
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("2295")) {
      {}
    } else {
      stryCov_9fa48("2295");
      this.currentPage.set(stryMutAct_9fa48("2296") ? event.pageIndex - 1 : (stryCov_9fa48("2296"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("2297")) {
      {}
    } else {
      stryCov_9fa48("2297");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("2298")) {
      {}
    } else {
      stryCov_9fa48("2298");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("2299")) {
      {}
    } else {
      stryCov_9fa48("2299");
      const date = event.value;
      if (stryMutAct_9fa48("2301") ? false : stryMutAct_9fa48("2300") ? true : (stryCov_9fa48("2300", "2301"), date)) {
        if (stryMutAct_9fa48("2302")) {
          {}
        } else {
          stryCov_9fa48("2302");
          this.dateFrom.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("2303")) {
          {}
        } else {
          stryCov_9fa48("2303");
          this.dateFrom.set(stryMutAct_9fa48("2304") ? "Stryker was here!" : (stryCov_9fa48("2304"), ''));
        }
      }
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("2305")) {
      {}
    } else {
      stryCov_9fa48("2305");
      const date = event.value;
      if (stryMutAct_9fa48("2307") ? false : stryMutAct_9fa48("2306") ? true : (stryCov_9fa48("2306", "2307"), date)) {
        if (stryMutAct_9fa48("2308")) {
          {}
        } else {
          stryCov_9fa48("2308");
          this.dateTo.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("2309")) {
          {}
        } else {
          stryCov_9fa48("2309");
          this.dateTo.set(stryMutAct_9fa48("2310") ? "Stryker was here!" : (stryCov_9fa48("2310"), ''));
        }
      }
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("2311")) {
      {}
    } else {
      stryCov_9fa48("2311");
      const dialogRef = this.dialog.open(ExpenseFormComponent, stryMutAct_9fa48("2312") ? {} : (stryCov_9fa48("2312"), {
        width: stryMutAct_9fa48("2313") ? "" : (stryCov_9fa48("2313"), '600px'),
        data: stryMutAct_9fa48("2314") ? {} : (stryCov_9fa48("2314"), {
          mode: stryMutAct_9fa48("2315") ? "" : (stryCov_9fa48("2315"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("2316")) {
          {}
        } else {
          stryCov_9fa48("2316");
          if (stryMutAct_9fa48("2318") ? false : stryMutAct_9fa48("2317") ? true : (stryCov_9fa48("2317", "2318"), result)) this.expensesResource.reload();
        }
      });
    }
  }
  openEditDialog(expense: Expense): void {
    if (stryMutAct_9fa48("2319")) {
      {}
    } else {
      stryCov_9fa48("2319");
      const dialogRef = this.dialog.open(ExpenseFormComponent, stryMutAct_9fa48("2320") ? {} : (stryCov_9fa48("2320"), {
        width: stryMutAct_9fa48("2321") ? "" : (stryCov_9fa48("2321"), '600px'),
        data: stryMutAct_9fa48("2322") ? {} : (stryCov_9fa48("2322"), {
          mode: stryMutAct_9fa48("2323") ? "" : (stryCov_9fa48("2323"), 'edit'),
          expense
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("2324")) {
          {}
        } else {
          stryCov_9fa48("2324");
          if (stryMutAct_9fa48("2326") ? false : stryMutAct_9fa48("2325") ? true : (stryCov_9fa48("2325", "2326"), result)) this.expensesResource.reload();
        }
      });
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("2327")) {
      {}
    } else {
      stryCov_9fa48("2327");
      return stryMutAct_9fa48("2330") ? (this.searchFilter() !== '' || this.categoryFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("2329") ? false : stryMutAct_9fa48("2328") ? true : (stryCov_9fa48("2328", "2329", "2330"), (stryMutAct_9fa48("2332") ? (this.searchFilter() !== '' || this.categoryFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("2331") ? false : (stryCov_9fa48("2331", "2332"), (stryMutAct_9fa48("2334") ? this.searchFilter() !== '' && this.categoryFilter() !== '' : stryMutAct_9fa48("2333") ? false : (stryCov_9fa48("2333", "2334"), (stryMutAct_9fa48("2336") ? this.searchFilter() === '' : stryMutAct_9fa48("2335") ? false : (stryCov_9fa48("2335", "2336"), this.searchFilter() !== (stryMutAct_9fa48("2337") ? "Stryker was here!" : (stryCov_9fa48("2337"), '')))) || (stryMutAct_9fa48("2339") ? this.categoryFilter() === '' : stryMutAct_9fa48("2338") ? false : (stryCov_9fa48("2338", "2339"), this.categoryFilter() !== (stryMutAct_9fa48("2340") ? "Stryker was here!" : (stryCov_9fa48("2340"), '')))))) || (stryMutAct_9fa48("2342") ? this.dateFrom() === '' : stryMutAct_9fa48("2341") ? false : (stryCov_9fa48("2341", "2342"), this.dateFrom() !== (stryMutAct_9fa48("2343") ? "Stryker was here!" : (stryCov_9fa48("2343"), '')))))) || (stryMutAct_9fa48("2345") ? this.dateTo() === '' : stryMutAct_9fa48("2344") ? false : (stryCov_9fa48("2344", "2345"), this.dateTo() !== (stryMutAct_9fa48("2346") ? "Stryker was here!" : (stryCov_9fa48("2346"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("2347")) {
      {}
    } else {
      stryCov_9fa48("2347");
      this.searchFilter.set(stryMutAct_9fa48("2348") ? "Stryker was here!" : (stryCov_9fa48("2348"), ''));
      this.categoryFilter.set(stryMutAct_9fa48("2349") ? "Stryker was here!" : (stryCov_9fa48("2349"), ''));
      this.dateFrom.set(stryMutAct_9fa48("2350") ? "Stryker was here!" : (stryCov_9fa48("2350"), ''));
      this.dateTo.set(stryMutAct_9fa48("2351") ? "Stryker was here!" : (stryCov_9fa48("2351"), ''));
    }
  }
  getExpenseFields(expense: Expense): MobileCardField[] {
    if (stryMutAct_9fa48("2352")) {
      {}
    } else {
      stryCov_9fa48("2352");
      return stryMutAct_9fa48("2353") ? [] : (stryCov_9fa48("2353"), [stryMutAct_9fa48("2354") ? {} : (stryCov_9fa48("2354"), {
        label: this.translationService.instant(stryMutAct_9fa48("2355") ? "" : (stryCov_9fa48("2355"), 'expenses.amount')),
        value: String(expense.amount)
      }), stryMutAct_9fa48("2356") ? {} : (stryCov_9fa48("2356"), {
        label: this.translationService.instant(stryMutAct_9fa48("2357") ? "" : (stryCov_9fa48("2357"), 'expenses.date')),
        value: expense.date,
        type: stryMutAct_9fa48("2358") ? "" : (stryCov_9fa48("2358"), 'date')
      }), stryMutAct_9fa48("2359") ? {} : (stryCov_9fa48("2359"), {
        label: this.translationService.instant(stryMutAct_9fa48("2360") ? "" : (stryCov_9fa48("2360"), 'expenses.recurring')),
        value: expense.isRecurring ? stryMutAct_9fa48("2361") ? "" : (stryCov_9fa48("2361"), 'Sí') : stryMutAct_9fa48("2362") ? "" : (stryCov_9fa48("2362"), 'No')
      }), stryMutAct_9fa48("2363") ? {} : (stryCov_9fa48("2363"), {
        label: this.translationService.instant(stryMutAct_9fa48("2364") ? "" : (stryCov_9fa48("2364"), 'common.created')),
        value: expense.createdAt,
        type: stryMutAct_9fa48("2365") ? "" : (stryCov_9fa48("2365"), 'date')
      })]);
    }
  }
  deleteExpense(expense: Expense): void {
    if (stryMutAct_9fa48("2366")) {
      {}
    } else {
      stryCov_9fa48("2366");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("2367") ? {} : (stryCov_9fa48("2367"), {
        width: stryMutAct_9fa48("2368") ? "" : (stryCov_9fa48("2368"), '400px'),
        data: stryMutAct_9fa48("2369") ? {} : (stryCov_9fa48("2369"), {
          title: stryMutAct_9fa48("2370") ? "" : (stryCov_9fa48("2370"), 'Eliminar gasto'),
          message: stryMutAct_9fa48("2371") ? `` : (stryCov_9fa48("2371"), `¿Estás seguro de eliminar "${expense.description}"?`),
          confirmLabel: stryMutAct_9fa48("2372") ? "" : (stryCov_9fa48("2372"), 'Eliminar'),
          color: stryMutAct_9fa48("2373") ? "" : (stryCov_9fa48("2373"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("2374")) {
          {}
        } else {
          stryCov_9fa48("2374");
          if (stryMutAct_9fa48("2376") ? false : stryMutAct_9fa48("2375") ? true : (stryCov_9fa48("2375", "2376"), confirmed)) {
            if (stryMutAct_9fa48("2377")) {
              {}
            } else {
              stryCov_9fa48("2377");
              this.expensesService.delete(expense.id).subscribe(stryMutAct_9fa48("2378") ? {} : (stryCov_9fa48("2378"), {
                next: () => {
                  if (stryMutAct_9fa48("2379")) {
                    {}
                  } else {
                    stryCov_9fa48("2379");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("2380") ? "" : (stryCov_9fa48("2380"), 'common.toast.deleted')), stryMutAct_9fa48("2381") ? "" : (stryCov_9fa48("2381"), 'success'));
                    this.expensesResource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("2382")) {
                    {}
                  } else {
                    stryCov_9fa48("2382");
                    const msg = Array.isArray(stryMutAct_9fa48("2383") ? err.error.message : (stryCov_9fa48("2383"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("2384") ? "" : (stryCov_9fa48("2384"), ', ')) : stryMutAct_9fa48("2387") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("2386") ? false : stryMutAct_9fa48("2385") ? true : (stryCov_9fa48("2385", "2386", "2387"), (stryMutAct_9fa48("2388") ? err.error.message : (stryCov_9fa48("2388"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("2389") ? "" : (stryCov_9fa48("2389"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("2390") ? "" : (stryCov_9fa48("2390"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  onEditSwipe(expense: Expense): (event: Event) => void {
    if (stryMutAct_9fa48("2391")) {
      {}
    } else {
      stryCov_9fa48("2391");
      return stryMutAct_9fa48("2392") ? () => undefined : (stryCov_9fa48("2392"), (_event: Event) => this.openEditDialog(expense));
    }
  }
  onDeleteSwipe(expense: Expense): (event: Event) => void {
    if (stryMutAct_9fa48("2393")) {
      {}
    } else {
      stryCov_9fa48("2393");
      return stryMutAct_9fa48("2394") ? () => undefined : (stryCov_9fa48("2394"), (_event: Event) => this.deleteExpense(expense));
    }
  }
}