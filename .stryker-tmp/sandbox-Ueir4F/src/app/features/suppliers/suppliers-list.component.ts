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
import { SuppliersService } from '../../core/services/suppliers.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { Supplier } from '../../core/models/supplier.interfaces';
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
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { SupplierFormComponent } from './supplier-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
@Component({
  selector: 'app-suppliers-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'suppliers.title' | translate"
        [subtitle]="'suppliers.subtitle' | translate"
        [actionLabel]="'suppliers.newSupplier' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.search' | translate }}</mat-label>
            <input matInput [value]="searchFilter()" (input)="searchFilter.set(getInputValue($event))" [placeholder]="'common.search' | translate" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [value]="isActiveFilter()" (selectionChange)="isActiveFilter.set($event.value)">
              <mat-option value="">{{ 'common.all' | translate }}</mat-option>
              <mat-option value="true">{{ 'common.active' | translate }}</mat-option>
              <mat-option value="false">{{ 'common.inactive' | translate }}</mat-option>
            </mat-select>
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

      @if (suppliersResource.status() === 'loading' && !suppliersResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (suppliersResource.error()) {
        <app-error-state (retry)="suppliersResource.reload()" />
      } @else if (suppliersResource.hasValue() && suppliersResource.value().data.length === 0) {
        <app-empty-state
          [title]="'suppliers.noSuppliers' | translate"
          [message]="'suppliers.noSuppliersMessage' | translate"
          [actionLabel]="'suppliers.createSupplier' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (suppliersResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (supplier of suppliersResource.value().data; track supplier.id) {
            <app-mobile-card
              [title]="supplier.name"
              [status]="supplier.isActive ? translationService.instant('common.active') : translationService.instant('common.inactive')"
              [statusType]="$any('activeInactive')"
              [fields]="getSupplierFields(supplier)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(supplier)"
              [onDelete]="onDeleteSwipe(supplier)"
            >
              <button mat-icon-button (click)="openEditDialog(supplier); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteSupplier(supplier); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
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
            [dataSource]="suppliersResource.value().data"
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
                {{ 'suppliers.name' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let supplier"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ supplier.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="contact">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'suppliers.contact' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let supplier"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ supplier.contact }}
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'suppliers.phone' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let supplier"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ supplier.phone }}
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'suppliers.email' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let supplier"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ supplier.email || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="address">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'common.address' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let supplier"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ supplier.address }}
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
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3">
                <app-status-badge [value]="supplier.isActive" type="activeInactive" />
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
                *matCellDef="let supplier"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ supplier.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let supplier" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="openEditDialog(supplier); $event.stopPropagation()"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteSupplier(supplier); $event.stopPropagation()"
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
            [length]="suppliersResource.value().total"
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
export class SuppliersListComponent implements OnInit {
  private readonly suppliersService = inject(SuppliersService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  readonly translationService = inject(TranslationService);
  readonly highlightedId = signal<string | null>(null);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal(stryMutAct_9fa48("4725") ? "" : (stryCov_9fa48("4725"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("4726") ? "" : (stryCov_9fa48("4726"), 'desc'));
  readonly searchFilter = signal(stryMutAct_9fa48("4727") ? "Stryker was here!" : (stryCov_9fa48("4727"), ''));
  readonly isActiveFilter = signal<'true' | 'false' | ''>(stryMutAct_9fa48("4728") ? "Stryker was here!" : (stryCov_9fa48("4728"), ''));
  readonly dateFrom = signal(stryMutAct_9fa48("4729") ? "Stryker was here!" : (stryCov_9fa48("4729"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("4730") ? "Stryker was here!" : (stryCov_9fa48("4730"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("4731") ? () => undefined : (stryCov_9fa48("4731"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("4732") ? () => undefined : (stryCov_9fa48("4732"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly suppliersResource = httpResource<PaginatedResponse<Supplier>>(stryMutAct_9fa48("4733") ? () => undefined : (stryCov_9fa48("4733"), () => stryMutAct_9fa48("4734") ? {} : (stryCov_9fa48("4734"), {
    url: stryMutAct_9fa48("4735") ? "" : (stryCov_9fa48("4735"), '/api/suppliers'),
    params: stryMutAct_9fa48("4736") ? {} : (stryCov_9fa48("4736"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("4737") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("4737"), this.sortOrder().toUpperCase()),
      ...(this.searchFilter() ? stryMutAct_9fa48("4738") ? {} : (stryCov_9fa48("4738"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.isActiveFilter() ? stryMutAct_9fa48("4739") ? {} : (stryCov_9fa48("4739"), {
        isActive: stryMutAct_9fa48("4742") ? this.isActiveFilter() !== 'true' : stryMutAct_9fa48("4741") ? false : stryMutAct_9fa48("4740") ? true : (stryCov_9fa48("4740", "4741", "4742"), this.isActiveFilter() === (stryMutAct_9fa48("4743") ? "" : (stryCov_9fa48("4743"), 'true')))
      }) : {}),
      ...(this.dateFrom() ? stryMutAct_9fa48("4744") ? {} : (stryCov_9fa48("4744"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("4745") ? {} : (stryCov_9fa48("4745"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("4746") ? [] : (stryCov_9fa48("4746"), [stryMutAct_9fa48("4747") ? "" : (stryCov_9fa48("4747"), 'name'), stryMutAct_9fa48("4748") ? "" : (stryCov_9fa48("4748"), 'contact'), stryMutAct_9fa48("4749") ? "" : (stryCov_9fa48("4749"), 'phone'), stryMutAct_9fa48("4750") ? "" : (stryCov_9fa48("4750"), 'email'), stryMutAct_9fa48("4751") ? "" : (stryCov_9fa48("4751"), 'address'), stryMutAct_9fa48("4752") ? "" : (stryCov_9fa48("4752"), 'isActive'), stryMutAct_9fa48("4753") ? "" : (stryCov_9fa48("4753"), 'createdAt'), stryMutAct_9fa48("4754") ? "" : (stryCov_9fa48("4754"), 'actions')]);
  ngOnInit(): void {
    if (stryMutAct_9fa48("4755")) {
      {}
    } else {
      stryCov_9fa48("4755");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("4756") ? "" : (stryCov_9fa48("4756"), 'highlight'));
      if (stryMutAct_9fa48("4758") ? false : stryMutAct_9fa48("4757") ? true : (stryCov_9fa48("4757", "4758"), highlightId)) {
        if (stryMutAct_9fa48("4759")) {
          {}
        } else {
          stryCov_9fa48("4759");
          this.highlightedId.set(highlightId);
          setTimeout(stryMutAct_9fa48("4760") ? () => undefined : (stryCov_9fa48("4760"), () => this.highlightedId.set(null)), 3000);
        }
      }
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("4761")) {
      {}
    } else {
      stryCov_9fa48("4761");
      this.currentPage.set(stryMutAct_9fa48("4762") ? event.pageIndex - 1 : (stryCov_9fa48("4762"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("4763")) {
      {}
    } else {
      stryCov_9fa48("4763");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("4764")) {
      {}
    } else {
      stryCov_9fa48("4764");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("4765")) {
      {}
    } else {
      stryCov_9fa48("4765");
      const date = event.value;
      this.dateFrom.set(date ? toLocalDateString(date) : stryMutAct_9fa48("4766") ? "Stryker was here!" : (stryCov_9fa48("4766"), ''));
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("4767")) {
      {}
    } else {
      stryCov_9fa48("4767");
      const date = event.value;
      this.dateTo.set(date ? toLocalDateString(date) : stryMutAct_9fa48("4768") ? "Stryker was here!" : (stryCov_9fa48("4768"), ''));
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("4769")) {
      {}
    } else {
      stryCov_9fa48("4769");
      const dialogRef = this.dialog.open(SupplierFormComponent, stryMutAct_9fa48("4770") ? {} : (stryCov_9fa48("4770"), {
        width: stryMutAct_9fa48("4771") ? "" : (stryCov_9fa48("4771"), '600px'),
        data: stryMutAct_9fa48("4772") ? {} : (stryCov_9fa48("4772"), {
          mode: stryMutAct_9fa48("4773") ? "" : (stryCov_9fa48("4773"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("4774")) {
          {}
        } else {
          stryCov_9fa48("4774");
          if (stryMutAct_9fa48("4776") ? false : stryMutAct_9fa48("4775") ? true : (stryCov_9fa48("4775", "4776"), result)) this.suppliersResource.reload();
        }
      });
    }
  }
  openEditDialog(supplier: Supplier): void {
    if (stryMutAct_9fa48("4777")) {
      {}
    } else {
      stryCov_9fa48("4777");
      const dialogRef = this.dialog.open(SupplierFormComponent, stryMutAct_9fa48("4778") ? {} : (stryCov_9fa48("4778"), {
        width: stryMutAct_9fa48("4779") ? "" : (stryCov_9fa48("4779"), '600px'),
        data: stryMutAct_9fa48("4780") ? {} : (stryCov_9fa48("4780"), {
          mode: stryMutAct_9fa48("4781") ? "" : (stryCov_9fa48("4781"), 'edit'),
          supplier
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("4782")) {
          {}
        } else {
          stryCov_9fa48("4782");
          if (stryMutAct_9fa48("4784") ? false : stryMutAct_9fa48("4783") ? true : (stryCov_9fa48("4783", "4784"), result)) this.suppliersResource.reload();
        }
      });
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("4785")) {
      {}
    } else {
      stryCov_9fa48("4785");
      return stryMutAct_9fa48("4788") ? (this.searchFilter() !== '' || this.isActiveFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("4787") ? false : stryMutAct_9fa48("4786") ? true : (stryCov_9fa48("4786", "4787", "4788"), (stryMutAct_9fa48("4790") ? (this.searchFilter() !== '' || this.isActiveFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("4789") ? false : (stryCov_9fa48("4789", "4790"), (stryMutAct_9fa48("4792") ? this.searchFilter() !== '' && this.isActiveFilter() !== '' : stryMutAct_9fa48("4791") ? false : (stryCov_9fa48("4791", "4792"), (stryMutAct_9fa48("4794") ? this.searchFilter() === '' : stryMutAct_9fa48("4793") ? false : (stryCov_9fa48("4793", "4794"), this.searchFilter() !== (stryMutAct_9fa48("4795") ? "Stryker was here!" : (stryCov_9fa48("4795"), '')))) || (stryMutAct_9fa48("4797") ? this.isActiveFilter() === '' : stryMutAct_9fa48("4796") ? false : (stryCov_9fa48("4796", "4797"), this.isActiveFilter() !== (stryMutAct_9fa48("4798") ? "Stryker was here!" : (stryCov_9fa48("4798"), '')))))) || (stryMutAct_9fa48("4800") ? this.dateFrom() === '' : stryMutAct_9fa48("4799") ? false : (stryCov_9fa48("4799", "4800"), this.dateFrom() !== (stryMutAct_9fa48("4801") ? "Stryker was here!" : (stryCov_9fa48("4801"), '')))))) || (stryMutAct_9fa48("4803") ? this.dateTo() === '' : stryMutAct_9fa48("4802") ? false : (stryCov_9fa48("4802", "4803"), this.dateTo() !== (stryMutAct_9fa48("4804") ? "Stryker was here!" : (stryCov_9fa48("4804"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("4805")) {
      {}
    } else {
      stryCov_9fa48("4805");
      this.searchFilter.set(stryMutAct_9fa48("4806") ? "Stryker was here!" : (stryCov_9fa48("4806"), ''));
      this.isActiveFilter.set(stryMutAct_9fa48("4807") ? "Stryker was here!" : (stryCov_9fa48("4807"), ''));
      this.dateFrom.set(stryMutAct_9fa48("4808") ? "Stryker was here!" : (stryCov_9fa48("4808"), ''));
      this.dateTo.set(stryMutAct_9fa48("4809") ? "Stryker was here!" : (stryCov_9fa48("4809"), ''));
    }
  }
  getSupplierFields(supplier: Supplier): MobileCardField[] {
    if (stryMutAct_9fa48("4810")) {
      {}
    } else {
      stryCov_9fa48("4810");
      return stryMutAct_9fa48("4811") ? [] : (stryCov_9fa48("4811"), [stryMutAct_9fa48("4812") ? {} : (stryCov_9fa48("4812"), {
        label: this.translationService.instant(stryMutAct_9fa48("4813") ? "" : (stryCov_9fa48("4813"), 'suppliers.contact')),
        value: stryMutAct_9fa48("4816") ? supplier.contact && '-' : stryMutAct_9fa48("4815") ? false : stryMutAct_9fa48("4814") ? true : (stryCov_9fa48("4814", "4815", "4816"), supplier.contact || (stryMutAct_9fa48("4817") ? "" : (stryCov_9fa48("4817"), '-')))
      }), stryMutAct_9fa48("4818") ? {} : (stryCov_9fa48("4818"), {
        label: this.translationService.instant(stryMutAct_9fa48("4819") ? "" : (stryCov_9fa48("4819"), 'suppliers.phone')),
        value: stryMutAct_9fa48("4822") ? supplier.phone && '-' : stryMutAct_9fa48("4821") ? false : stryMutAct_9fa48("4820") ? true : (stryCov_9fa48("4820", "4821", "4822"), supplier.phone || (stryMutAct_9fa48("4823") ? "" : (stryCov_9fa48("4823"), '-'))),
        type: stryMutAct_9fa48("4824") ? "" : (stryCov_9fa48("4824"), 'phone')
      }), stryMutAct_9fa48("4825") ? {} : (stryCov_9fa48("4825"), {
        label: this.translationService.instant(stryMutAct_9fa48("4826") ? "" : (stryCov_9fa48("4826"), 'suppliers.email')),
        value: stryMutAct_9fa48("4829") ? supplier.email && '-' : stryMutAct_9fa48("4828") ? false : stryMutAct_9fa48("4827") ? true : (stryCov_9fa48("4827", "4828", "4829"), supplier.email || (stryMutAct_9fa48("4830") ? "" : (stryCov_9fa48("4830"), '-'))),
        type: stryMutAct_9fa48("4831") ? "" : (stryCov_9fa48("4831"), 'email')
      }), stryMutAct_9fa48("4832") ? {} : (stryCov_9fa48("4832"), {
        label: this.translationService.instant(stryMutAct_9fa48("4833") ? "" : (stryCov_9fa48("4833"), 'common.address')),
        value: stryMutAct_9fa48("4836") ? supplier.address && '-' : stryMutAct_9fa48("4835") ? false : stryMutAct_9fa48("4834") ? true : (stryCov_9fa48("4834", "4835", "4836"), supplier.address || (stryMutAct_9fa48("4837") ? "" : (stryCov_9fa48("4837"), '-')))
      }), stryMutAct_9fa48("4838") ? {} : (stryCov_9fa48("4838"), {
        label: this.translationService.instant(stryMutAct_9fa48("4839") ? "" : (stryCov_9fa48("4839"), 'common.created')),
        value: supplier.createdAt,
        type: stryMutAct_9fa48("4840") ? "" : (stryCov_9fa48("4840"), 'date')
      })]);
    }
  }
  deleteSupplier(supplier: Supplier): void {
    if (stryMutAct_9fa48("4841")) {
      {}
    } else {
      stryCov_9fa48("4841");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("4842") ? {} : (stryCov_9fa48("4842"), {
        width: stryMutAct_9fa48("4843") ? "" : (stryCov_9fa48("4843"), '400px'),
        data: stryMutAct_9fa48("4844") ? {} : (stryCov_9fa48("4844"), {
          title: stryMutAct_9fa48("4845") ? "" : (stryCov_9fa48("4845"), 'Eliminar proveedor'),
          message: stryMutAct_9fa48("4846") ? `` : (stryCov_9fa48("4846"), `¿Estás seguro de eliminar a ${supplier.name}?`),
          confirmLabel: stryMutAct_9fa48("4847") ? "" : (stryCov_9fa48("4847"), 'Eliminar'),
          color: stryMutAct_9fa48("4848") ? "" : (stryCov_9fa48("4848"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("4849")) {
          {}
        } else {
          stryCov_9fa48("4849");
          if (stryMutAct_9fa48("4851") ? false : stryMutAct_9fa48("4850") ? true : (stryCov_9fa48("4850", "4851"), confirmed)) {
            if (stryMutAct_9fa48("4852")) {
              {}
            } else {
              stryCov_9fa48("4852");
              this.suppliersService.delete(supplier.id).subscribe(stryMutAct_9fa48("4853") ? {} : (stryCov_9fa48("4853"), {
                next: () => {
                  if (stryMutAct_9fa48("4854")) {
                    {}
                  } else {
                    stryCov_9fa48("4854");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("4855") ? "" : (stryCov_9fa48("4855"), 'common.toast.deleted')), stryMutAct_9fa48("4856") ? "" : (stryCov_9fa48("4856"), 'success'));
                    this.suppliersResource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("4857")) {
                    {}
                  } else {
                    stryCov_9fa48("4857");
                    const msg = Array.isArray(stryMutAct_9fa48("4858") ? err.error.message : (stryCov_9fa48("4858"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("4859") ? "" : (stryCov_9fa48("4859"), ', ')) : stryMutAct_9fa48("4862") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("4861") ? false : stryMutAct_9fa48("4860") ? true : (stryCov_9fa48("4860", "4861", "4862"), (stryMutAct_9fa48("4863") ? err.error.message : (stryCov_9fa48("4863"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("4864") ? "" : (stryCov_9fa48("4864"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("4865") ? "" : (stryCov_9fa48("4865"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  onEditSwipe(supplier: Supplier): (event: Event) => void {
    if (stryMutAct_9fa48("4866")) {
      {}
    } else {
      stryCov_9fa48("4866");
      return stryMutAct_9fa48("4867") ? () => undefined : (stryCov_9fa48("4867"), (_event: Event) => this.openEditDialog(supplier));
    }
  }
  onDeleteSwipe(supplier: Supplier): (event: Event) => void {
    if (stryMutAct_9fa48("4868")) {
      {}
    } else {
      stryCov_9fa48("4868");
      return stryMutAct_9fa48("4869") ? () => undefined : (stryCov_9fa48("4869"), (_event: Event) => this.deleteSupplier(supplier));
    }
  }
}