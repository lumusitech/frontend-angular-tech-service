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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { Client, PaginatedResponse } from '../../core/models/client.interfaces';
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
import { ClientFormComponent } from './client-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
@Component({
  selector: 'app-clients-list',
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'clients.title' | translate"
        [subtitle]="'clients.subtitle' | translate"
        [actionLabel]="'clients.newClient' | translate"
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

      @if (clientsResource.status() === 'loading' && !clientsResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (clientsResource.error()) {
        <app-error-state (retry)="clientsResource.reload()" />
      } @else if (clientsResource.hasValue() && clientsResource.value().data.length === 0) {
        <app-empty-state
          [title]="'clients.noClients' | translate"
          [message]="'clients.noClientsMessage' | translate"
          [actionLabel]="'clients.createClient' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (clientsResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (client of clientsResource.value().data; track client.id) {
            <app-mobile-card
              [title]="client.name"
              [status]="client.isActive ? translationService.instant('common.active') : translationService.instant('common.inactive')"
              [statusType]="$any('activeInactive')"
              [fields]="getClientFields(client)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(client)"
              [onDelete]="onDeleteSwipe(client)"
            />
          }
        </mat-accordion>

        <!-- Desktop: Table -->
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="clientsResource.value().data"
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
                {{ 'clients.name' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let client"
                class="px-4 py-3 text-sm"
              >
                <a
                  [routerLink]="['/admin/clients', client.id]"
                  class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {{ client.name }}
                </a>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'clients.email' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.email }}
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'clients.phone' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.phone }}
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
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.address }}
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
              <td mat-cell *matCellDef="let client" class="px-4 py-3">
                <app-status-badge [value]="client.isActive" type="activeInactive" />
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
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let client" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="openEditDialog(client); $event.stopPropagation()"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteClient(client); $event.stopPropagation()"
                  [title]="'common.delete' | translate"
                  color="warn"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" [class.highlight-pulse]="highlightedId() === row.id" (click)="viewDetail(row)" class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"></tr>
          </table>

          <mat-paginator
            [length]="clientsResource.value().total"
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
export class ClientsListComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  readonly translationService = inject(TranslationService);
  readonly highlightedId = signal<string | null>(null);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal(stryMutAct_9fa48("1896") ? "" : (stryCov_9fa48("1896"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("1897") ? "" : (stryCov_9fa48("1897"), 'desc'));
  readonly searchFilter = signal(stryMutAct_9fa48("1898") ? "Stryker was here!" : (stryCov_9fa48("1898"), ''));
  readonly isActiveFilter = signal<'true' | 'false' | ''>(stryMutAct_9fa48("1899") ? "Stryker was here!" : (stryCov_9fa48("1899"), ''));
  readonly dateFrom = signal(stryMutAct_9fa48("1900") ? "Stryker was here!" : (stryCov_9fa48("1900"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("1901") ? "Stryker was here!" : (stryCov_9fa48("1901"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("1902") ? () => undefined : (stryCov_9fa48("1902"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("1903") ? () => undefined : (stryCov_9fa48("1903"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly clientsResource = httpResource<PaginatedResponse<Client>>(stryMutAct_9fa48("1904") ? () => undefined : (stryCov_9fa48("1904"), () => stryMutAct_9fa48("1905") ? {} : (stryCov_9fa48("1905"), {
    url: stryMutAct_9fa48("1906") ? "" : (stryCov_9fa48("1906"), '/api/clients'),
    params: stryMutAct_9fa48("1907") ? {} : (stryCov_9fa48("1907"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("1908") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("1908"), this.sortOrder().toUpperCase()),
      ...(this.searchFilter() ? stryMutAct_9fa48("1909") ? {} : (stryCov_9fa48("1909"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.isActiveFilter() ? stryMutAct_9fa48("1910") ? {} : (stryCov_9fa48("1910"), {
        isActive: stryMutAct_9fa48("1913") ? this.isActiveFilter() !== 'true' : stryMutAct_9fa48("1912") ? false : stryMutAct_9fa48("1911") ? true : (stryCov_9fa48("1911", "1912", "1913"), this.isActiveFilter() === (stryMutAct_9fa48("1914") ? "" : (stryCov_9fa48("1914"), 'true')))
      }) : {}),
      ...(this.dateFrom() ? stryMutAct_9fa48("1915") ? {} : (stryCov_9fa48("1915"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("1916") ? {} : (stryCov_9fa48("1916"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("1917") ? [] : (stryCov_9fa48("1917"), [stryMutAct_9fa48("1918") ? "" : (stryCov_9fa48("1918"), 'name'), stryMutAct_9fa48("1919") ? "" : (stryCov_9fa48("1919"), 'email'), stryMutAct_9fa48("1920") ? "" : (stryCov_9fa48("1920"), 'phone'), stryMutAct_9fa48("1921") ? "" : (stryCov_9fa48("1921"), 'address'), stryMutAct_9fa48("1922") ? "" : (stryCov_9fa48("1922"), 'isActive'), stryMutAct_9fa48("1923") ? "" : (stryCov_9fa48("1923"), 'createdAt'), stryMutAct_9fa48("1924") ? "" : (stryCov_9fa48("1924"), 'actions')]);
  ngOnInit(): void {
    if (stryMutAct_9fa48("1925")) {
      {}
    } else {
      stryCov_9fa48("1925");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("1926") ? "" : (stryCov_9fa48("1926"), 'highlight'));
      if (stryMutAct_9fa48("1928") ? false : stryMutAct_9fa48("1927") ? true : (stryCov_9fa48("1927", "1928"), highlightId)) {
        if (stryMutAct_9fa48("1929")) {
          {}
        } else {
          stryCov_9fa48("1929");
          this.highlightedId.set(highlightId);
          setTimeout(stryMutAct_9fa48("1930") ? () => undefined : (stryCov_9fa48("1930"), () => this.highlightedId.set(null)), 3000);
        }
      }
      const searchQuery = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("1931") ? "" : (stryCov_9fa48("1931"), 'search'));
      if (stryMutAct_9fa48("1933") ? false : stryMutAct_9fa48("1932") ? true : (stryCov_9fa48("1932", "1933"), searchQuery)) {
        if (stryMutAct_9fa48("1934")) {
          {}
        } else {
          stryCov_9fa48("1934");
          this.searchFilter.set(searchQuery);
        }
      }
    }
  }
  viewDetail(client: Client): void {
    if (stryMutAct_9fa48("1935")) {
      {}
    } else {
      stryCov_9fa48("1935");
      this.router.navigate(stryMutAct_9fa48("1936") ? [] : (stryCov_9fa48("1936"), [stryMutAct_9fa48("1937") ? "" : (stryCov_9fa48("1937"), '/admin/clients'), client.id]));
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("1938")) {
      {}
    } else {
      stryCov_9fa48("1938");
      this.currentPage.set(stryMutAct_9fa48("1939") ? event.pageIndex - 1 : (stryCov_9fa48("1939"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("1940")) {
      {}
    } else {
      stryCov_9fa48("1940");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("1941")) {
      {}
    } else {
      stryCov_9fa48("1941");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("1942")) {
      {}
    } else {
      stryCov_9fa48("1942");
      const date = event.value;
      this.dateFrom.set(date ? toLocalDateString(date) : stryMutAct_9fa48("1943") ? "Stryker was here!" : (stryCov_9fa48("1943"), ''));
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("1944")) {
      {}
    } else {
      stryCov_9fa48("1944");
      const date = event.value;
      this.dateTo.set(date ? toLocalDateString(date) : stryMutAct_9fa48("1945") ? "Stryker was here!" : (stryCov_9fa48("1945"), ''));
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("1946")) {
      {}
    } else {
      stryCov_9fa48("1946");
      const dialogRef = this.dialog.open(ClientFormComponent, stryMutAct_9fa48("1947") ? {} : (stryCov_9fa48("1947"), {
        width: stryMutAct_9fa48("1948") ? "" : (stryCov_9fa48("1948"), '600px'),
        data: stryMutAct_9fa48("1949") ? {} : (stryCov_9fa48("1949"), {
          mode: stryMutAct_9fa48("1950") ? "" : (stryCov_9fa48("1950"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("1951")) {
          {}
        } else {
          stryCov_9fa48("1951");
          if (stryMutAct_9fa48("1953") ? false : stryMutAct_9fa48("1952") ? true : (stryCov_9fa48("1952", "1953"), result)) this.clientsResource.reload();
        }
      });
    }
  }
  openEditDialog(client: Client): void {
    if (stryMutAct_9fa48("1954")) {
      {}
    } else {
      stryCov_9fa48("1954");
      const dialogRef = this.dialog.open(ClientFormComponent, stryMutAct_9fa48("1955") ? {} : (stryCov_9fa48("1955"), {
        width: stryMutAct_9fa48("1956") ? "" : (stryCov_9fa48("1956"), '600px'),
        data: stryMutAct_9fa48("1957") ? {} : (stryCov_9fa48("1957"), {
          mode: stryMutAct_9fa48("1958") ? "" : (stryCov_9fa48("1958"), 'edit'),
          client
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("1959")) {
          {}
        } else {
          stryCov_9fa48("1959");
          if (stryMutAct_9fa48("1961") ? false : stryMutAct_9fa48("1960") ? true : (stryCov_9fa48("1960", "1961"), result)) this.clientsResource.reload();
        }
      });
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("1962")) {
      {}
    } else {
      stryCov_9fa48("1962");
      return stryMutAct_9fa48("1965") ? (this.searchFilter() !== '' || this.isActiveFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("1964") ? false : stryMutAct_9fa48("1963") ? true : (stryCov_9fa48("1963", "1964", "1965"), (stryMutAct_9fa48("1967") ? (this.searchFilter() !== '' || this.isActiveFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("1966") ? false : (stryCov_9fa48("1966", "1967"), (stryMutAct_9fa48("1969") ? this.searchFilter() !== '' && this.isActiveFilter() !== '' : stryMutAct_9fa48("1968") ? false : (stryCov_9fa48("1968", "1969"), (stryMutAct_9fa48("1971") ? this.searchFilter() === '' : stryMutAct_9fa48("1970") ? false : (stryCov_9fa48("1970", "1971"), this.searchFilter() !== (stryMutAct_9fa48("1972") ? "Stryker was here!" : (stryCov_9fa48("1972"), '')))) || (stryMutAct_9fa48("1974") ? this.isActiveFilter() === '' : stryMutAct_9fa48("1973") ? false : (stryCov_9fa48("1973", "1974"), this.isActiveFilter() !== (stryMutAct_9fa48("1975") ? "Stryker was here!" : (stryCov_9fa48("1975"), '')))))) || (stryMutAct_9fa48("1977") ? this.dateFrom() === '' : stryMutAct_9fa48("1976") ? false : (stryCov_9fa48("1976", "1977"), this.dateFrom() !== (stryMutAct_9fa48("1978") ? "Stryker was here!" : (stryCov_9fa48("1978"), '')))))) || (stryMutAct_9fa48("1980") ? this.dateTo() === '' : stryMutAct_9fa48("1979") ? false : (stryCov_9fa48("1979", "1980"), this.dateTo() !== (stryMutAct_9fa48("1981") ? "Stryker was here!" : (stryCov_9fa48("1981"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("1982")) {
      {}
    } else {
      stryCov_9fa48("1982");
      this.searchFilter.set(stryMutAct_9fa48("1983") ? "Stryker was here!" : (stryCov_9fa48("1983"), ''));
      this.isActiveFilter.set(stryMutAct_9fa48("1984") ? "Stryker was here!" : (stryCov_9fa48("1984"), ''));
      this.dateFrom.set(stryMutAct_9fa48("1985") ? "Stryker was here!" : (stryCov_9fa48("1985"), ''));
      this.dateTo.set(stryMutAct_9fa48("1986") ? "Stryker was here!" : (stryCov_9fa48("1986"), ''));
    }
  }
  deleteClient(client: Client): void {
    if (stryMutAct_9fa48("1987")) {
      {}
    } else {
      stryCov_9fa48("1987");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("1988") ? {} : (stryCov_9fa48("1988"), {
        width: stryMutAct_9fa48("1989") ? "" : (stryCov_9fa48("1989"), '400px'),
        data: stryMutAct_9fa48("1990") ? {} : (stryCov_9fa48("1990"), {
          title: stryMutAct_9fa48("1991") ? "" : (stryCov_9fa48("1991"), 'Eliminar cliente'),
          message: stryMutAct_9fa48("1992") ? `` : (stryCov_9fa48("1992"), `¿Estás seguro de eliminar a ${client.name}?`),
          confirmLabel: stryMutAct_9fa48("1993") ? "" : (stryCov_9fa48("1993"), 'Eliminar'),
          color: stryMutAct_9fa48("1994") ? "" : (stryCov_9fa48("1994"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("1995")) {
          {}
        } else {
          stryCov_9fa48("1995");
          if (stryMutAct_9fa48("1997") ? false : stryMutAct_9fa48("1996") ? true : (stryCov_9fa48("1996", "1997"), confirmed)) {
            if (stryMutAct_9fa48("1998")) {
              {}
            } else {
              stryCov_9fa48("1998");
              this.clientsService.delete(client.id).subscribe(stryMutAct_9fa48("1999") ? {} : (stryCov_9fa48("1999"), {
                next: () => {
                  if (stryMutAct_9fa48("2000")) {
                    {}
                  } else {
                    stryCov_9fa48("2000");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("2001") ? "" : (stryCov_9fa48("2001"), 'common.toast.deleted')), stryMutAct_9fa48("2002") ? "" : (stryCov_9fa48("2002"), 'success'));
                    this.clientsResource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("2003")) {
                    {}
                  } else {
                    stryCov_9fa48("2003");
                    const msg = Array.isArray(stryMutAct_9fa48("2004") ? err.error.message : (stryCov_9fa48("2004"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("2005") ? "" : (stryCov_9fa48("2005"), ', ')) : stryMutAct_9fa48("2008") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("2007") ? false : stryMutAct_9fa48("2006") ? true : (stryCov_9fa48("2006", "2007", "2008"), (stryMutAct_9fa48("2009") ? err.error.message : (stryCov_9fa48("2009"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("2011") ? "" : (stryCov_9fa48("2011"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  getClientFields(client: Client): MobileCardField[] {
    if (stryMutAct_9fa48("2012")) {
      {}
    } else {
      stryCov_9fa48("2012");
      return stryMutAct_9fa48("2013") ? [] : (stryCov_9fa48("2013"), [stryMutAct_9fa48("2014") ? {} : (stryCov_9fa48("2014"), {
        label: this.translationService.instant(stryMutAct_9fa48("2015") ? "" : (stryCov_9fa48("2015"), 'clients.email')),
        value: client.email,
        type: stryMutAct_9fa48("2016") ? "" : (stryCov_9fa48("2016"), 'email')
      }), stryMutAct_9fa48("2017") ? {} : (stryCov_9fa48("2017"), {
        label: this.translationService.instant(stryMutAct_9fa48("2018") ? "" : (stryCov_9fa48("2018"), 'clients.phone')),
        value: stryMutAct_9fa48("2021") ? client.phone && '-' : stryMutAct_9fa48("2020") ? false : stryMutAct_9fa48("2019") ? true : (stryCov_9fa48("2019", "2020", "2021"), client.phone || (stryMutAct_9fa48("2022") ? "" : (stryCov_9fa48("2022"), '-'))),
        type: stryMutAct_9fa48("2023") ? "" : (stryCov_9fa48("2023"), 'phone')
      }), stryMutAct_9fa48("2024") ? {} : (stryCov_9fa48("2024"), {
        label: this.translationService.instant(stryMutAct_9fa48("2025") ? "" : (stryCov_9fa48("2025"), 'common.address')),
        value: stryMutAct_9fa48("2028") ? client.address && '-' : stryMutAct_9fa48("2027") ? false : stryMutAct_9fa48("2026") ? true : (stryCov_9fa48("2026", "2027", "2028"), client.address || (stryMutAct_9fa48("2029") ? "" : (stryCov_9fa48("2029"), '-')))
      }), stryMutAct_9fa48("2030") ? {} : (stryCov_9fa48("2030"), {
        label: this.translationService.instant(stryMutAct_9fa48("2031") ? "" : (stryCov_9fa48("2031"), 'common.created')),
        value: client.createdAt,
        type: stryMutAct_9fa48("2032") ? "" : (stryCov_9fa48("2032"), 'date')
      })]);
    }
  }
  onEditSwipe(client: Client): (event: Event) => void {
    if (stryMutAct_9fa48("2033")) {
      {}
    } else {
      stryCov_9fa48("2033");
      return stryMutAct_9fa48("2034") ? () => undefined : (stryCov_9fa48("2034"), (_event: Event) => this.openEditDialog(client));
    }
  }
  onDeleteSwipe(client: Client): (event: Event) => void {
    if (stryMutAct_9fa48("2035")) {
      {}
    } else {
      stryCov_9fa48("2035");
      return stryMutAct_9fa48("2036") ? () => undefined : (stryCov_9fa48("2036"), (_event: Event) => this.deleteClient(client));
    }
  }
}