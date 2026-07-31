import { Component, computed, DestroyRef, effect, inject, signal, OnInit } from '@angular/core';
import { toLocalDateString, parseLocalDate } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WebsocketService } from '../../core/services/websocket.service';
import {
  WorkOrder,
  WorkOrderStatus,
  WorkOrderPriority,
} from '../../core/models/work-order.interfaces';
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
import {
  MobileCardComponent,
  MobileCardField,
} from '../../shared/components/mobile-card/mobile-card.component';
import { WorkOrderFormComponent } from './work-order-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { TranslationService } from '../../core/services/translation.service';
import {
  DateFieldSelectorComponent,
  DateFieldOption,
} from '../../shared/components/date-field-selector/date-field-selector.component';
import { MobileFilterBarComponent } from '../../shared/components/mobile-filter-bar/mobile-filter-bar.component';

@Component({
  selector: 'app-work-orders-list',
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
    TrackingCodeComponent,
    MobileCardComponent,
    MobileFilterBarComponent,
    DateFieldSelectorComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'workOrders.title' | translate"
        [subtitle]="'workOrders.subtitle' | translate"
        [actionLabel]="'workOrders.newOrder' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3"
      >
        <div class="flex items-center gap-3 flex-wrap">
          <app-mobile-filter-bar
            [hasActiveFilters]="hasActiveFilters()"
            (clearFilters)="clearFilters()"
          >
            <mat-form-field appearance="outline" class="w-44">
              <mat-label>{{ 'common.search' | translate }}</mat-label>
              <input
                matInput
                [value]="searchFilter()"
                (input)="searchFilter.set(getInputValue($event))"
                [placeholder]="'common.search' | translate"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-44">
              <mat-label>{{ 'common.status' | translate }}</mat-label>
              <mat-select
                [value]="statusFilter()"
                (selectionChange)="statusFilter.set($event.value)"
              >
                <mat-option value="">{{ 'workOrders.filters.all' | translate }}</mat-option>
                <mat-option value="pending">{{
                  'workOrders.statuses.pending' | translate
                }}</mat-option>
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
                <mat-option value="">{{
                  'workOrders.filters.allPriorities' | translate
                }}</mat-option>
                <mat-option value="low">{{ 'workOrders.priorities.low' | translate }}</mat-option>
                <mat-option value="medium">{{
                  'workOrders.priorities.medium' | translate
                }}</mat-option>
                <mat-option value="high">{{ 'workOrders.priorities.high' | translate }}</mat-option>
                <mat-option value="urgent">{{
                  'workOrders.priorities.urgent' | translate
                }}</mat-option>
              </mat-select>
            </mat-form-field>

            <app-date-field-selector
              [fields]="dateFieldOptions"
              [value]="dateField()"
              (valueChange)="onDateFieldChange($event)"
            />
            <mat-form-field appearance="outline" class="w-44">
              <mat-label>{{ 'common.from' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="dateFromPicker"
                [value]="dateFromValue()"
                (dateChange)="onDateFromChange($event)"
              />
              <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
              <mat-datepicker #dateFromPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-44">
              <mat-label>{{ 'common.to' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="dateToPicker"
                [value]="dateToValue()"
                (dateChange)="onDateToChange($event)"
              />
              <mat-datepicker-toggle matIconSuffix [for]="dateToPicker"></mat-datepicker-toggle>
              <mat-datepicker #dateToPicker></mat-datepicker>
            </mat-form-field>
            @if (dateError()) {
              <div class="w-40 text-red-500 dark:text-red-400 text-xs">
                {{ dateError() | translate }}
              </div>
            }
          </app-mobile-filter-bar>

          @if (fromNotification()) {
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
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
      } @else if (workOrdersResource.hasValue() && liveOrders()!.data.length === 0) {
        <app-empty-state
          [title]="'workOrders.noOrders' | translate"
          [message]="'workOrders.noOrdersMessage' | translate"
          [actionLabel]="'workOrders.createOrder' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (workOrdersResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (order of liveOrders()!.data; track order.id) {
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
            [dataSource]="liveOrders()!.data"
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
            [length]="liveOrders()!.total"
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
export class WorkOrdersListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly websocketService = inject(WebsocketService);
  readonly translationService = inject(TranslationService);
  readonly parseLocalDate = parseLocalDate;

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: false });

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<WorkOrderStatus | ''>('');
  readonly priorityFilter = signal<WorkOrderPriority | ''>('');
  readonly searchFilter = signal('');
  readonly sortBy = signal('updatedAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly highlightedId = signal<string | null>(null);
  readonly fromNotification = signal(false);
  readonly dateField = signal('createdAt');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly dateError = signal('');
  readonly dateFromValue = computed(() =>
    this.dateFrom() ? parseLocalDate(this.dateFrom()) : null,
  );
  readonly dateToValue = computed(() => (this.dateTo() ? parseLocalDate(this.dateTo()) : null));

  readonly dateFieldOptions: DateFieldOption[] = [
    { value: 'createdAt', labelKey: 'common.dateFieldCreated' },
    { value: 'scheduledDate', labelKey: 'workOrders.scheduledDate' },
  ];

  constructor() {
    effect(() => {
      const params = this.queryParams();
      if (!params) return;

      const search = params.get('search');
      if (search) {
        this.searchFilter.set(search);
      }

      const fromNotification = params.get('fromNotification') === 'true';
      const highlight = params.get('highlight');

      if (highlight) {
        this.highlightedId.set(highlight);
        this.fromNotification.set(fromNotification);
        if (!fromNotification) {
          this.pageSize.set(50);
          const timeout = setTimeout(() => this.highlightedId.set(null), 3000);
          this.destroyRef.onDestroy(() => clearTimeout(timeout));
        }
      }
    });
  }

  ngOnInit(): void {}

  readonly workOrdersResource = httpResource<PaginatedResponse<WorkOrder>>(() => ({
    url: '/api/work-orders',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.statusFilter() ? { status: this.statusFilter() } : {}),
      ...(this.priorityFilter() ? { priority: this.priorityFilter() } : {}),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.dateFrom() ? { dateFrom: this.dateFrom() } : {}),
      ...(this.dateTo() ? { dateTo: this.dateTo() } : {}),
    },
  }));

  readonly liveOrders = computed(() => {
    const response = this.workOrdersResource.value();
    if (!response) return null;
    const changes = this.websocketService.workOrderStatusChanges();
    const keys = Object.keys(changes);
    if (keys.length === 0) return response;
    return {
      ...response,
      data: response.data.map((order) =>
        changes[order.id] ? { ...order, status: changes[order.id] as WorkOrderStatus } : order,
      ),
    };
  });

  displayedColumns = [
    'trackingCode',
    'status',
    'priority',
    'client',
    'workAddress',
    'serviceType',
    'scheduledDate',
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

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onDateFieldChange(field: string): void {
    this.dateField.set(field);
    this.dateFrom.set('');
    this.dateTo.set('');
  }

  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    if (date) {
      this.dateFrom.set(toLocalDateString(date));
      this.dateError.set('');
      if (this.dateTo()) {
        const from = parseLocalDate(this.dateFrom());
        const to = parseLocalDate(this.dateTo());
        if (from > to) {
          this.dateError.set('common.invalidDateTo');
        }
      }
    } else {
      this.dateFrom.set('');
      this.dateError.set('');
    }
  }

  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    if (date) {
      const newDateTo = toLocalDateString(date);
      if (this.dateFrom()) {
        const from = parseLocalDate(this.dateFrom());
        const to = parseLocalDate(newDateTo);
        if (to < from) {
          this.dateError.set('common.invalidDateFrom');
          return;
        }
      }
      this.dateTo.set(newDateTo);
      this.dateError.set('');
    } else {
      this.dateTo.set('');
      this.dateError.set('');
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(WorkOrderFormComponent, {
      width: '700px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.workOrdersResource.reload();
    });
  }

  readonly hasActiveFilters = computed(() => {
    return (
      this.searchFilter() !== '' ||
      this.statusFilter() !== '' ||
      this.priorityFilter() !== '' ||
      this.dateFrom() !== '' ||
      this.dateTo() !== '' ||
      this.fromNotification()
    );
  });


  clearFilters(): void {
    this.searchFilter.set('');
    this.statusFilter.set('');
    this.priorityFilter.set('');
    this.dateField.set('createdAt');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.dateError.set('');
    this.highlightedId.set(null);
    this.fromNotification.set(false);
  }

  getOrderFields(order: WorkOrder): MobileCardField[] {
    return [
      {
        label: this.translationService.instant('workOrders.client'),
        value: order.client?.name || '-',
      },
      {
        label: this.translationService.instant('workOrders.service'),
        value: order.serviceType?.name || '-',
      },
      { label: this.translationService.instant('workOrders.priority'), value: order.priority },
      {
        label: this.translationService.instant('workOrders.date'),
        value: order.scheduledDate || '-',
        type: 'date',
      },
      {
        label: this.translationService.instant('common.created'),
        value: order.createdAt,
        type: 'date',
      },
    ];
  }

  viewDetail(order: WorkOrder): void {
    this.router.navigate(['/admin/work-orders', order.id]);
  }

  onEditSwipe(order: WorkOrder): (event: Event) => void {
    return (_event: Event) => this.viewDetail(order);
  }
}
