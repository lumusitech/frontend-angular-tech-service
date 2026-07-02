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
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../../core/models/work-order.interfaces';
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
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { WorkOrderFormComponent } from './work-order-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { TranslationService } from '../../core/services/translation.service';
@Component({
  selector: 'app-work-orders-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, TrackingCodeComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'workOrders.title' | translate"
        [subtitle]="'workOrders.subtitle' | translate"
        [actionLabel]="'workOrders.newOrder' | translate"
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
            <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
              <mat-option value="">{{ 'workOrders.filters.all' | translate }}</mat-option>
              <mat-option value="pending">{{ 'workOrders.statuses.pending' | translate }}</mat-option>
              <mat-option value="assigned">{{
                'workOrders.statuses.assigned' | translate
              }}</mat-option>
              <mat-option value="in_progress">{{
                'workOrders.statuses.inProgress' | translate
              }}</mat-option>
              <mat-option value="completed">{{
                'workOrders.statuses.completed' | translate
              }}</mat-option>
              <mat-option value="delivered">{{
                'workOrders.statuses.delivered' | translate
              }}</mat-option>
              <mat-option value="cancelled">{{
                'workOrders.statuses.cancelled' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'workOrders.priority' | translate }}</mat-label>
            <mat-select
              [value]="priorityFilter()"
              (selectionChange)="priorityFilter.set($event.value)"
            >
              <mat-option value="">{{ 'workOrders.filters.allPriorities' | translate }}</mat-option>
              <mat-option value="low">{{ 'workOrders.priorities.low' | translate }}</mat-option>
              <mat-option value="medium">{{ 'workOrders.priorities.medium' | translate }}</mat-option>
              <mat-option value="high">{{ 'workOrders.priorities.high' | translate }}</mat-option>
              <mat-option value="urgent">{{ 'workOrders.priorities.urgent' | translate }}</mat-option>
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

          @if (fromNotification()) {
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <mat-icon class="!w-3.5 !h-3.5">notifications</mat-icon>
              {{ 'notifications.filteredFromNotification' | translate }}
            </span>
          }
        </div>
      </div>

      @if (workOrdersResource.status() === 'loading' && !workOrdersResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (workOrdersResource.error()) {
        <app-error-state (retry)="workOrdersResource.reload()" />
      } @else if (workOrdersResource.hasValue() && workOrdersResource.value().data.length === 0) {
        <app-empty-state
          [title]="'workOrders.noOrders' | translate"
          [message]="'workOrders.noOrdersMessage' | translate"
          [actionLabel]="'workOrders.createOrder' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (workOrdersResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (order of workOrdersResource.value().data; track order.id) {
            <app-mobile-card
              [title]="order.trackingCode"
              [status]="order.status"
              [statusType]="$any('workOrderStatus')"
              [fields]="getOrderFields(order)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(order)"
            />
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
            [dataSource]="workOrdersResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="trackingCode">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'workOrders.code' | translate }}
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <app-tracking-code [code]="order.trackingCode" />
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'common.status' | translate }}
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <app-status-badge [value]="order.status" type="workOrderStatus" />
              </td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'workOrders.priority' | translate }}
              </th>
              <td mat-cell *matCellDef="let order" class="px-4 py-3">
                <app-status-badge [value]="order.priority" type="workOrderPriority" />
              </td>
            </ng-container>

            <ng-container matColumnDef="client">
              <th
                mat-header-cell
                mat-sort-header="client"
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'workOrders.client' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let order"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ order.client?.name || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="workAddress">
              <th
                mat-header-cell
                mat-sort-header="workAddress"
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'workOrders.workAddress' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let order"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ order.workAddress || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="serviceType">
              <th
                mat-header-cell
                mat-sort-header="serviceType"
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'workOrders.service' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let order"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ order.serviceType?.name || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="scheduledDate">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'workOrders.date' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let order"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                @if (order.scheduledDate) {
                  {{ order.scheduledDate | relativeDate }}
                } @else {
                  -
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
                *matCellDef="let order"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ order.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let order" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="viewDetail(order)"
                  [title]="'common.view' | translate"
                >
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              [class.highlight-pulse]="highlightedId() === row.id"
              (click)="viewDetail(row)"
            ></tr>
          </table>

          <mat-paginator
            [length]="workOrdersResource.value().total"
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
export class WorkOrdersListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  readonly translationService = inject(TranslationService);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<WorkOrderStatus | ''>(stryMutAct_9fa48("5625") ? "Stryker was here!" : (stryCov_9fa48("5625"), ''));
  readonly priorityFilter = signal<WorkOrderPriority | ''>(stryMutAct_9fa48("5626") ? "Stryker was here!" : (stryCov_9fa48("5626"), ''));
  readonly searchFilter = signal(stryMutAct_9fa48("5627") ? "Stryker was here!" : (stryCov_9fa48("5627"), ''));
  readonly sortBy = signal(stryMutAct_9fa48("5628") ? "" : (stryCov_9fa48("5628"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("5629") ? "" : (stryCov_9fa48("5629"), 'desc'));
  readonly highlightedId = signal<string | null>(null);
  readonly fromNotification = signal(stryMutAct_9fa48("5630") ? true : (stryCov_9fa48("5630"), false));
  readonly dateFrom = signal(stryMutAct_9fa48("5631") ? "Stryker was here!" : (stryCov_9fa48("5631"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("5632") ? "Stryker was here!" : (stryCov_9fa48("5632"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("5633") ? () => undefined : (stryCov_9fa48("5633"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("5634") ? () => undefined : (stryCov_9fa48("5634"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  ngOnInit(): void {
    if (stryMutAct_9fa48("5635")) {
      {}
    } else {
      stryCov_9fa48("5635");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("5636") ? "" : (stryCov_9fa48("5636"), 'highlight'));
      const fromNotification = stryMutAct_9fa48("5639") ? this.route.snapshot.queryParamMap.get('fromNotification') !== 'true' : stryMutAct_9fa48("5638") ? false : stryMutAct_9fa48("5637") ? true : (stryCov_9fa48("5637", "5638", "5639"), this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("5640") ? "" : (stryCov_9fa48("5640"), 'fromNotification')) === (stryMutAct_9fa48("5641") ? "" : (stryCov_9fa48("5641"), 'true')));
      if (stryMutAct_9fa48("5643") ? false : stryMutAct_9fa48("5642") ? true : (stryCov_9fa48("5642", "5643"), highlightId)) {
        if (stryMutAct_9fa48("5644")) {
          {}
        } else {
          stryCov_9fa48("5644");
          this.highlightedId.set(highlightId);
          this.fromNotification.set(fromNotification);
          if (stryMutAct_9fa48("5647") ? false : stryMutAct_9fa48("5646") ? true : stryMutAct_9fa48("5645") ? fromNotification : (stryCov_9fa48("5645", "5646", "5647"), !fromNotification)) {
            if (stryMutAct_9fa48("5648")) {
              {}
            } else {
              stryCov_9fa48("5648");
              this.pageSize.set(50);
              setTimeout(stryMutAct_9fa48("5649") ? () => undefined : (stryCov_9fa48("5649"), () => this.highlightedId.set(null)), 3000);
            }
          }
        }
      }
      const searchQuery = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("5650") ? "" : (stryCov_9fa48("5650"), 'search'));
      if (stryMutAct_9fa48("5652") ? false : stryMutAct_9fa48("5651") ? true : (stryCov_9fa48("5651", "5652"), searchQuery)) {
        if (stryMutAct_9fa48("5653")) {
          {}
        } else {
          stryCov_9fa48("5653");
          this.searchFilter.set(searchQuery);
        }
      }
    }
  }
  readonly workOrdersResource = httpResource<PaginatedResponse<WorkOrder>>(stryMutAct_9fa48("5654") ? () => undefined : (stryCov_9fa48("5654"), () => stryMutAct_9fa48("5655") ? {} : (stryCov_9fa48("5655"), {
    url: stryMutAct_9fa48("5656") ? "" : (stryCov_9fa48("5656"), '/api/work-orders'),
    params: stryMutAct_9fa48("5657") ? {} : (stryCov_9fa48("5657"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.statusFilter() ? stryMutAct_9fa48("5658") ? {} : (stryCov_9fa48("5658"), {
        status: this.statusFilter()
      }) : {}),
      ...(this.priorityFilter() ? stryMutAct_9fa48("5659") ? {} : (stryCov_9fa48("5659"), {
        priority: this.priorityFilter()
      }) : {}),
      ...(this.searchFilter() ? stryMutAct_9fa48("5660") ? {} : (stryCov_9fa48("5660"), {
        search: this.searchFilter()
      }) : {}),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("5661") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("5661"), this.sortOrder().toUpperCase()),
      ...(this.dateFrom() ? stryMutAct_9fa48("5662") ? {} : (stryCov_9fa48("5662"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("5663") ? {} : (stryCov_9fa48("5663"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("5664") ? [] : (stryCov_9fa48("5664"), [stryMutAct_9fa48("5665") ? "" : (stryCov_9fa48("5665"), 'trackingCode'), stryMutAct_9fa48("5666") ? "" : (stryCov_9fa48("5666"), 'status'), stryMutAct_9fa48("5667") ? "" : (stryCov_9fa48("5667"), 'priority'), stryMutAct_9fa48("5668") ? "" : (stryCov_9fa48("5668"), 'client'), stryMutAct_9fa48("5669") ? "" : (stryCov_9fa48("5669"), 'workAddress'), stryMutAct_9fa48("5670") ? "" : (stryCov_9fa48("5670"), 'serviceType'), stryMutAct_9fa48("5671") ? "" : (stryCov_9fa48("5671"), 'scheduledDate'), stryMutAct_9fa48("5672") ? "" : (stryCov_9fa48("5672"), 'createdAt'), stryMutAct_9fa48("5673") ? "" : (stryCov_9fa48("5673"), 'actions')]);
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("5674")) {
      {}
    } else {
      stryCov_9fa48("5674");
      this.currentPage.set(stryMutAct_9fa48("5675") ? event.pageIndex - 1 : (stryCov_9fa48("5675"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("5676")) {
      {}
    } else {
      stryCov_9fa48("5676");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("5677")) {
      {}
    } else {
      stryCov_9fa48("5677");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("5678")) {
      {}
    } else {
      stryCov_9fa48("5678");
      const date = event.value;
      if (stryMutAct_9fa48("5680") ? false : stryMutAct_9fa48("5679") ? true : (stryCov_9fa48("5679", "5680"), date)) {
        if (stryMutAct_9fa48("5681")) {
          {}
        } else {
          stryCov_9fa48("5681");
          this.dateFrom.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("5682")) {
          {}
        } else {
          stryCov_9fa48("5682");
          this.dateFrom.set(stryMutAct_9fa48("5683") ? "Stryker was here!" : (stryCov_9fa48("5683"), ''));
        }
      }
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("5684")) {
      {}
    } else {
      stryCov_9fa48("5684");
      const date = event.value;
      if (stryMutAct_9fa48("5686") ? false : stryMutAct_9fa48("5685") ? true : (stryCov_9fa48("5685", "5686"), date)) {
        if (stryMutAct_9fa48("5687")) {
          {}
        } else {
          stryCov_9fa48("5687");
          this.dateTo.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("5688")) {
          {}
        } else {
          stryCov_9fa48("5688");
          this.dateTo.set(stryMutAct_9fa48("5689") ? "Stryker was here!" : (stryCov_9fa48("5689"), ''));
        }
      }
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("5690")) {
      {}
    } else {
      stryCov_9fa48("5690");
      const dialogRef = this.dialog.open(WorkOrderFormComponent, stryMutAct_9fa48("5691") ? {} : (stryCov_9fa48("5691"), {
        width: stryMutAct_9fa48("5692") ? "" : (stryCov_9fa48("5692"), '700px'),
        data: stryMutAct_9fa48("5693") ? {} : (stryCov_9fa48("5693"), {
          mode: stryMutAct_9fa48("5694") ? "" : (stryCov_9fa48("5694"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("5695")) {
          {}
        } else {
          stryCov_9fa48("5695");
          if (stryMutAct_9fa48("5697") ? false : stryMutAct_9fa48("5696") ? true : (stryCov_9fa48("5696", "5697"), result)) this.workOrdersResource.reload();
        }
      });
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("5698")) {
      {}
    } else {
      stryCov_9fa48("5698");
      return stryMutAct_9fa48("5701") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.priorityFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '') && this.fromNotification() : stryMutAct_9fa48("5700") ? false : stryMutAct_9fa48("5699") ? true : (stryCov_9fa48("5699", "5700", "5701"), (stryMutAct_9fa48("5703") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.priorityFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("5702") ? false : (stryCov_9fa48("5702", "5703"), (stryMutAct_9fa48("5705") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.priorityFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("5704") ? false : (stryCov_9fa48("5704", "5705"), (stryMutAct_9fa48("5707") ? (this.searchFilter() !== '' || this.statusFilter() !== '') && this.priorityFilter() !== '' : stryMutAct_9fa48("5706") ? false : (stryCov_9fa48("5706", "5707"), (stryMutAct_9fa48("5709") ? this.searchFilter() !== '' && this.statusFilter() !== '' : stryMutAct_9fa48("5708") ? false : (stryCov_9fa48("5708", "5709"), (stryMutAct_9fa48("5711") ? this.searchFilter() === '' : stryMutAct_9fa48("5710") ? false : (stryCov_9fa48("5710", "5711"), this.searchFilter() !== (stryMutAct_9fa48("5712") ? "Stryker was here!" : (stryCov_9fa48("5712"), '')))) || (stryMutAct_9fa48("5714") ? this.statusFilter() === '' : stryMutAct_9fa48("5713") ? false : (stryCov_9fa48("5713", "5714"), this.statusFilter() !== (stryMutAct_9fa48("5715") ? "Stryker was here!" : (stryCov_9fa48("5715"), '')))))) || (stryMutAct_9fa48("5717") ? this.priorityFilter() === '' : stryMutAct_9fa48("5716") ? false : (stryCov_9fa48("5716", "5717"), this.priorityFilter() !== (stryMutAct_9fa48("5718") ? "Stryker was here!" : (stryCov_9fa48("5718"), '')))))) || (stryMutAct_9fa48("5720") ? this.dateFrom() === '' : stryMutAct_9fa48("5719") ? false : (stryCov_9fa48("5719", "5720"), this.dateFrom() !== (stryMutAct_9fa48("5721") ? "Stryker was here!" : (stryCov_9fa48("5721"), '')))))) || (stryMutAct_9fa48("5723") ? this.dateTo() === '' : stryMutAct_9fa48("5722") ? false : (stryCov_9fa48("5722", "5723"), this.dateTo() !== (stryMutAct_9fa48("5724") ? "Stryker was here!" : (stryCov_9fa48("5724"), '')))))) || this.fromNotification());
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("5725")) {
      {}
    } else {
      stryCov_9fa48("5725");
      this.searchFilter.set(stryMutAct_9fa48("5726") ? "Stryker was here!" : (stryCov_9fa48("5726"), ''));
      this.statusFilter.set(stryMutAct_9fa48("5727") ? "Stryker was here!" : (stryCov_9fa48("5727"), ''));
      this.priorityFilter.set(stryMutAct_9fa48("5728") ? "Stryker was here!" : (stryCov_9fa48("5728"), ''));
      this.dateFrom.set(stryMutAct_9fa48("5729") ? "Stryker was here!" : (stryCov_9fa48("5729"), ''));
      this.dateTo.set(stryMutAct_9fa48("5730") ? "Stryker was here!" : (stryCov_9fa48("5730"), ''));
      this.highlightedId.set(null);
      this.fromNotification.set(stryMutAct_9fa48("5731") ? true : (stryCov_9fa48("5731"), false));
    }
  }
  getOrderFields(order: WorkOrder): MobileCardField[] {
    if (stryMutAct_9fa48("5732")) {
      {}
    } else {
      stryCov_9fa48("5732");
      return stryMutAct_9fa48("5733") ? [] : (stryCov_9fa48("5733"), [stryMutAct_9fa48("5734") ? {} : (stryCov_9fa48("5734"), {
        label: this.translationService.instant(stryMutAct_9fa48("5735") ? "" : (stryCov_9fa48("5735"), 'workOrders.client')),
        value: stryMutAct_9fa48("5738") ? order.client?.name && '-' : stryMutAct_9fa48("5737") ? false : stryMutAct_9fa48("5736") ? true : (stryCov_9fa48("5736", "5737", "5738"), (stryMutAct_9fa48("5739") ? order.client.name : (stryCov_9fa48("5739"), order.client?.name)) || (stryMutAct_9fa48("5740") ? "" : (stryCov_9fa48("5740"), '-')))
      }), stryMutAct_9fa48("5741") ? {} : (stryCov_9fa48("5741"), {
        label: this.translationService.instant(stryMutAct_9fa48("5742") ? "" : (stryCov_9fa48("5742"), 'workOrders.service')),
        value: stryMutAct_9fa48("5745") ? order.serviceType?.name && '-' : stryMutAct_9fa48("5744") ? false : stryMutAct_9fa48("5743") ? true : (stryCov_9fa48("5743", "5744", "5745"), (stryMutAct_9fa48("5746") ? order.serviceType.name : (stryCov_9fa48("5746"), order.serviceType?.name)) || (stryMutAct_9fa48("5747") ? "" : (stryCov_9fa48("5747"), '-')))
      }), stryMutAct_9fa48("5748") ? {} : (stryCov_9fa48("5748"), {
        label: this.translationService.instant(stryMutAct_9fa48("5749") ? "" : (stryCov_9fa48("5749"), 'workOrders.priority')),
        value: order.priority
      }), stryMutAct_9fa48("5750") ? {} : (stryCov_9fa48("5750"), {
        label: this.translationService.instant(stryMutAct_9fa48("5751") ? "" : (stryCov_9fa48("5751"), 'workOrders.date')),
        value: stryMutAct_9fa48("5754") ? order.scheduledDate && '-' : stryMutAct_9fa48("5753") ? false : stryMutAct_9fa48("5752") ? true : (stryCov_9fa48("5752", "5753", "5754"), order.scheduledDate || (stryMutAct_9fa48("5755") ? "" : (stryCov_9fa48("5755"), '-'))),
        type: stryMutAct_9fa48("5756") ? "" : (stryCov_9fa48("5756"), 'date')
      }), stryMutAct_9fa48("5757") ? {} : (stryCov_9fa48("5757"), {
        label: this.translationService.instant(stryMutAct_9fa48("5758") ? "" : (stryCov_9fa48("5758"), 'common.created')),
        value: order.createdAt,
        type: stryMutAct_9fa48("5759") ? "" : (stryCov_9fa48("5759"), 'date')
      })]);
    }
  }
  viewDetail(order: WorkOrder): void {
    if (stryMutAct_9fa48("5760")) {
      {}
    } else {
      stryCov_9fa48("5760");
      this.router.navigate(stryMutAct_9fa48("5761") ? [] : (stryCov_9fa48("5761"), [stryMutAct_9fa48("5762") ? "" : (stryCov_9fa48("5762"), '/admin/work-orders'), order.id]));
    }
  }
  onEditSwipe(order: WorkOrder): (event: Event) => void {
    if (stryMutAct_9fa48("5763")) {
      {}
    } else {
      stryCov_9fa48("5763");
      return stryMutAct_9fa48("5764") ? () => undefined : (stryCov_9fa48("5764"), (_event: Event) => this.viewDetail(order));
    }
  }
}