import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { toLocalDateString, parseLocalDate } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from '../../core/services/payments.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { Payment, PaymentStatus, PaymentMethod } from '../../core/models/payment.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import {
  MobileCardComponent,
  MobileCardField,
} from '../../shared/components/mobile-card/mobile-card.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { PaymentFormComponent } from './payment-form.component';
import {
  DateFieldSelectorComponent,
  DateFieldOption,
} from '../../shared/components/date-field-selector/date-field-selector.component';
import { MobileFilterBarComponent } from '../../shared/components/mobile-filter-bar/mobile-filter-bar.component';
import { BulkActionsComponent } from '../../shared/components/bulk-actions/bulk-actions.component';
import {
  StatusChangeDialogComponent,
  StatusChangeDialogResult,
  StatusChangeOption,
} from '../../shared/components/status-change-dialog/status-change-dialog.component';
import { exportToCsv } from '../../shared/utils/csv-export.util';

@Component({
  selector: 'app-payments-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAccordion,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    TrackingCodeComponent,
    CurrencyArsPipe,
    MobileCardComponent,
    MobileFilterBarComponent,
    DateFieldSelectorComponent,
    BulkActionsComponent,
    TranslatePipe,
    RelativeDatePipe,
    MatDialogModule,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'payments.title' | translate"
        [subtitle]="'payments.subtitle' | translate"
        [actionLabel]="'payments.newPayment' | translate"
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
            <mat-form-field appearance="outline" class="w-40">
              <mat-label>{{ 'common.status' | translate }}</mat-label>
              <mat-select
                [value]="statusFilter()"
                (selectionChange)="statusFilter.set($event.value)"
              >
                <mat-option>{{ 'payments.filters.all' | translate }}</mat-option>
                <mat-option value="pending">{{
                  'payments.statuses.pending' | translate
                }}</mat-option>
                <mat-option value="approved">{{
                  'payments.statuses.approved' | translate
                }}</mat-option>
                <mat-option value="rejected">{{
                  'payments.statuses.rejected' | translate
                }}</mat-option>
                <mat-option value="refunded">{{
                  'payments.statuses.refunded' | translate
                }}</mat-option>
                <mat-option value="cancelled">{{
                  'payments.statuses.cancelled' | translate
                }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-40">
              <mat-label>{{ 'payments.method' | translate }}</mat-label>
              <mat-select
                [value]="methodFilter()"
                (selectionChange)="methodFilter.set($event.value)"
              >
                <mat-option>{{ 'payments.filters.allMethods' | translate }}</mat-option>
                <mat-option value="cash">{{ 'payments.methods.cash' | translate }}</mat-option>
                <mat-option value="transfer">{{
                  'payments.methods.transfer' | translate
                }}</mat-option>
                <mat-option value="credit_card">{{
                  'payments.methods.creditCard' | translate
                }}</mat-option>
                <mat-option value="debit_card">{{
                  'payments.methods.debitCard' | translate
                }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-44">
              <mat-label>{{ 'common.search' | translate }}</mat-label>
              <input
                matInput
                [value]="searchFilter()"
                (input)="searchFilter.set(getInputValue($event))"
                inputmode="search"
                enterkeyhint="done"
                (keydown.enter)="$event.target.blur()"
                [placeholder]="'common.search' | translate"
              />
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
          </app-mobile-filter-bar>

          @if (dateError()) {
            <div class="w-40 text-red-500 dark:text-red-400 text-xs">
              {{ dateError() | translate }}
            </div>
          }

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

      @if (paymentsResource.status() === 'loading' && !paymentsResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (paymentsResource.error()) {
        <app-error-state (retry)="paymentsResource.reload()" />
      } @else if (paymentsResource.hasValue() && paymentsResource.value().data.length === 0) {
        <app-empty-state
          [title]="'payments.noPayments' | translate"
          [message]="'payments.noPaymentsMessage' | translate"
        />
      } @else if (paymentsResource.hasValue()) {
        <app-bulk-actions
          [selectedCount]="selectedIds().size"
          [totalCount]="currentPageData().length"
          [showStatusChange]="true"
          [statusChangeLabel]="'bulk.changeStatus' | translate"
          [showActivateDeactivate]="false"
          [showDelete]="true"
          [loading]="bulkLoading()"
          (selectAll)="onSelectAllPage($event)"
          (clearSelection)="clearSelection()"
          (exportCsv)="exportSelectedCsv()"
          (statusChange)="openBulkStatusDialog()"
          (deleteSelected)="bulkDeletePayments()"
        />

        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (payment of paymentsResource.value().data; track payment.id) {
            <app-mobile-card
              [title]="payment.workOrder?.trackingCode ?? '-'"
              [status]="payment.status"
              [statusType]="$any('paymentStatus')"
              [fields]="getPaymentFields(payment)"
              [canSwipe]="true"
              [selectable]="true"
              [checked]="isSelected(payment.id)"
              (selectionChange)="toggleSelection(payment.id, $event)"
              [onEdit]="onEditSwipe(payment)"
              [onDelete]="onDeleteSwipe(payment)"
            >
              <button
                mat-icon-button
                (click)="openEditDialog(payment); $event.stopPropagation()"
                class="!w-8 !h-8"
              >
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button
                mat-icon-button
                (click)="deletePayment(payment); $event.stopPropagation()"
                class="!w-8 !h-8"
                color="warn"
              >
                <mat-icon class="!w-4 !h-4">delete</mat-icon>
              </button>
            </app-mobile-card>
          }
        </mat-accordion>

        <!-- Desktop: Table -->
        <div
          class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto"
        >
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="paymentsResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 w-12">
                <mat-checkbox
                  color="primary"
                  [checked]="allPageSelected()"
                  [indeterminate]="somePageSelected()"
                  (change)="onSelectAllPage($event.checked)"
                  [title]="'bulk.selectAll' | translate"
                />
              </th>
              <td
                mat-cell
                *matCellDef="let payment"
                class="px-4 py-3"
                (click)="$event.stopPropagation()"
              >
                <mat-checkbox
                  color="primary"
                  [checked]="isSelected(payment.id)"
                  (change)="toggleSelection(payment.id, $event.checked)"
                />
              </td>
            </ng-container>

            <ng-container matColumnDef="trackingCode">
              <th
                mat-header-cell
                mat-sort-header="trackingCode"
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'payments.order' | translate }}
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3">
                <app-tracking-code [code]="payment.workOrder?.trackingCode ?? '-'" />
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'payments.amount' | translate }}
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm font-medium">
                {{ payment.amount | currencyArs }}
              </td>
            </ng-container>

            <ng-container matColumnDef="method">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'payments.method' | translate }}
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3">
                <app-status-badge [value]="payment.method" type="paymentMethod" />
              </td>
            </ng-container>

            <ng-container matColumnDef="provider">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'payments.provider' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let payment"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ payment.provider }}
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
              <td mat-cell *matCellDef="let payment" class="px-4 py-3">
                <app-status-badge [value]="payment.status" type="paymentStatus" />
              </td>
            </ng-container>

            <ng-container matColumnDef="paidAt">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'payments.paymentDate' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let payment"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ payment.paidAt ? (payment.paidAt | relativeDate) : '-' }}
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
                *matCellDef="let payment"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ payment.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-right">
                <div class="action-btn-group">
                  <button
                    mat-icon-button
                    (click)="$event.stopPropagation()"
                    [matMenuTriggerFor]="paymentActionsMenu"
                    [title]="'common.actions' | translate"
                  >
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #paymentActionsMenu="matMenu">
                    @if (payment.status === 'pending') {
                      <button
                        mat-menu-item
                        (click)="approvePayment(payment); $event.stopPropagation()"
                      >
                        <mat-icon>check_circle</mat-icon>
                        <span>{{ 'payments.approve' | translate }}</span>
                      </button>
                    }
                    <button
                      mat-menu-item
                      (click)="openEditDialog(payment); $event.stopPropagation()"
                    >
                      <mat-icon>edit</mat-icon>
                      <span>{{ 'common.edit' | translate }}</span>
                    </button>
                    <button
                      mat-menu-item
                      (click)="deletePayment(payment); $event.stopPropagation()"
                    >
                      <mat-icon>delete</mat-icon>
                      <span>{{ 'common.delete' | translate }}</span>
                    </button>
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              [class.highlight-pulse]="highlightedId() === row.id"
              [class.selected-row]="isSelected(row.id)"
              (click)="openEditDialog(row)"
              class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            ></tr>
          </table>

          <mat-paginator
            [length]="paymentsResource.value().total"
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
export class PaymentsListComponent {
  private readonly paymentsService = inject(PaymentsService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly parseLocalDate = parseLocalDate;

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: false });

  readonly highlightedId = signal<string | null>(null);
  readonly fromNotification = signal(false);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<PaymentStatus | ''>('');
  readonly methodFilter = signal<PaymentMethod | ''>('');
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly searchFilter = signal('');
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
    { value: 'paidAt', labelKey: 'payments.paymentDate' },
  ];

  readonly paymentsResource = httpResource<PaginatedResponse<Payment>>(() => ({
    url: '/api/payments',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.statusFilter() ? { status: this.statusFilter() } : {}),
      ...(this.methodFilter() ? { method: this.methodFilter() } : {}),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      ...(this.dateFrom() ? { dateFrom: this.dateFrom(), dateField: this.dateField() } : {}),
      ...(this.dateTo() ? { dateTo: this.dateTo(), dateField: this.dateField() } : {}),
    },
  }));

  displayedColumns = [
    'select',
    'trackingCode',
    'amount',
    'method',
    'provider',
    'status',
    'paidAt',
    'createdAt',
    'actions',
  ];

  readonly selectedIds = signal<Set<string>>(new Set());
  readonly bulkLoading = signal(false);

  readonly currentPageData = computed<Payment[]>(() => this.paymentsResource.value()?.data ?? []);
  readonly allPageSelected = computed(
    () =>
      this.currentPageData().length > 0 &&
      this.currentPageData().every((payment) => this.selectedIds().has(payment.id)),
  );
  readonly somePageSelected = computed(
    () =>
      this.currentPageData().some((payment) => this.selectedIds().has(payment.id)) &&
      !this.allPageSelected(),
  );

  private readonly paymentStatusOptions: StatusChangeOption[] = [
    { value: 'pending', labelKey: 'payments.statuses.pending' },
    { value: 'approved', labelKey: 'payments.statuses.approved' },
    { value: 'rejected', labelKey: 'payments.statuses.rejected' },
    { value: 'refunded', labelKey: 'payments.statuses.refunded' },
    { value: 'cancelled', labelKey: 'payments.statuses.cancelled' },
  ];

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleSelection(id: string, checked: boolean): void {
    const next = new Set(this.selectedIds());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selectedIds.set(next);
  }

  onSelectAllPage(checked: boolean): void {
    const next = new Set(this.selectedIds());
    for (const payment of this.currentPageData()) {
      if (checked) {
        next.add(payment.id);
      } else {
        next.delete(payment.id);
      }
    }
    this.selectedIds.set(next);
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  exportSelectedCsv(): void {
    const selected = this.currentPageData().filter((payment) => this.selectedIds().has(payment.id));
    if (selected.length === 0) return;

    const t = (key: string): string => this.translationService.instant(key);
    const headers = [
      t('payments.order'),
      t('payments.amount'),
      t('payments.method'),
      t('payments.provider'),
      t('common.status'),
      t('payments.paymentDate'),
      t('common.created'),
    ];
    const rows = selected.map((payment) => [
      payment.workOrder?.trackingCode ?? '-',
      String(payment.amount),
      payment.method,
      payment.provider ?? '-',
      payment.status,
      payment.paidAt ?? '',
      payment.createdAt,
    ]);
    exportToCsv(`payments-${toLocalDateString(new Date())}.csv`, headers, rows);
  }

  openBulkStatusDialog(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    const entity = this.translationService.instant('payments.title');
    const dialogRef = this.dialog.open(StatusChangeDialogComponent, {
      width: '420px',
      data: {
        titleKey: 'bulk.changeStatus',
        message: this.translationService.instant('bulk.changeStatusMessage', {
          count: String(ids.length),
          entity,
        }),
        confirmLabel: this.translationService.instant('bulk.changeStatus'),
        color: 'primary',
        statusOptions: this.paymentStatusOptions,
        statusLabel: this.translationService.instant('bulk.status'),
      },
    });

    dialogRef.afterClosed().subscribe((result: StatusChangeDialogResult | undefined) => {
      if (result?.confirmed && result.status) {
        this.applyBulkStatus(ids, result.status as PaymentStatus);
      }
    });
  }

  private applyBulkStatus(ids: string[], status: PaymentStatus): void {
    this.bulkLoading.set(true);
    this.paymentsService.bulkUpdateStatus(ids, status).subscribe({
      next: (result) => {
        this.bulkLoading.set(false);
        const failedCount = result.failed.length;
        if (failedCount === 0) {
          this.toastService.show(
            this.translationService.instant('bulk.toast.statusChanged'),
            'success',
          );
        } else {
          this.toastService.show(
            this.translationService.instant('bulk.toast.partial', {
              succeeded: String(result.succeeded.length),
              failed: String(failedCount),
            }),
            'info',
          );
        }
        this.clearSelection();
        this.paymentsResource.reload();
      },
      error: (err) => {
        this.bulkLoading.set(false);
        const msg = Array.isArray(err.error?.message)
          ? err.error.message.join(', ')
          : err.error?.message || this.translationService.instant('bulk.toast.error');
        this.toastService.show(msg, 'error');
      },
    });
  }

  bulkDeletePayments(): void {
    const count = this.selectedIds().size;
    if (count === 0) return;
    const entity = this.translationService.instant('payments.title');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translationService.instant('bulk.deleteTitle', { entity }),
        message: this.translationService.instant('bulk.deleteMessage', {
          count: String(count),
          entity,
        }),
        confirmLabel: this.translationService.instant('common.delete'),
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      const ids = Array.from(this.selectedIds());
      this.bulkLoading.set(true);
      this.paymentsService.bulkDelete(ids).subscribe({
        next: (result) => {
          this.bulkLoading.set(false);
          const failedCount = result.failed.length;
          if (failedCount === 0) {
            this.toastService.show(
              this.translationService.instant('common.toast.deleted'),
              'success',
            );
          } else {
            this.toastService.show(
              this.translationService.instant('bulk.toast.partial', {
                succeeded: String(result.succeeded.length),
                failed: String(failedCount),
              }),
              'info',
            );
          }
          this.clearSelection();
          this.paymentsResource.reload();
        },
        error: (err) => {
          this.bulkLoading.set(false);
          const msg = Array.isArray(err.error?.message)
            ? err.error.message.join(', ')
            : err.error?.message || this.translationService.instant('bulk.toast.error');
          this.toastService.show(msg, 'error');
        },
      });
    });
  }

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

  onDateFieldChange(field: string): void {
    this.dateField.set(field);
    this.dateFrom.set('');
    this.dateTo.set('');
  }

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
      const newDateFrom = toLocalDateString(date);
      if (this.dateTo()) {
        const from = parseLocalDate(newDateFrom);
        const to = parseLocalDate(this.dateTo());
        if (from > to) {
          this.dateError.set('common.invalidDateTo');
          return;
        }
      }
      this.dateFrom.set(newDateFrom);
      this.dateError.set('');
    } else {
      this.dateFrom.set('');
      this.dateError.set('');
    }
  }

  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    if (date) {
      const newDateTo = toLocalDateString(date);
      // Validate dateTo is not before dateFrom
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

  readonly hasActiveFilters = computed(() => {
    return (
      this.searchFilter() !== '' ||
      this.statusFilter() !== '' ||
      this.methodFilter() !== '' ||
      this.dateFrom() !== '' ||
      this.dateTo() !== '' ||
      this.fromNotification()
    );
  });

  clearFilters(): void {
    this.searchFilter.set('');
    this.statusFilter.set('');
    this.methodFilter.set('');
    this.dateField.set('createdAt');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.dateError.set('');
    this.highlightedId.set(null);
    this.fromNotification.set(false);
  }

  approvePayment(payment: Payment): void {
    if (payment.status !== 'pending') return;

    this.paymentsService
      .update(payment.id, {
        status: 'approved',
        paidAt: new Date().toISOString(),
      })
      .subscribe({
        next: () => this.paymentsResource.reload(),
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.paymentsResource.reload();
    });
  }

  openEditDialog(payment: Payment): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '600px',
      data: { mode: 'edit', payment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.paymentsResource.reload();
    });
  }

  getPaymentFields(payment: Payment): MobileCardField[] {
    return [
      { label: this.translationService.instant('payments.amount'), value: String(payment.amount) },
      { label: this.translationService.instant('payments.method'), value: payment.method },
      {
        label: this.translationService.instant('payments.provider'),
        value: payment.provider || '-',
      },
      {
        label: this.translationService.instant('payments.paymentDate'),
        value: payment.paidAt || '-',
        type: 'date',
      },
      {
        label: this.translationService.instant('common.created'),
        value: payment.createdAt,
        type: 'date',
      },
    ];
  }

  deletePayment(payment: Payment): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translationService.instant('payments.deleteTitle'),
        message: this.translationService.instant('payments.deleteMessage', {
          amount: String(payment.amount),
        }),
        confirmLabel: this.translationService.instant('common.delete'),
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.paymentsService.delete(payment.id).subscribe({
          next: () => {
            this.toastService.show(
              this.translationService.instant('common.toast.deleted'),
              'success',
            );
            this.paymentsResource.reload();
          },
          error: (err) => {
            const msg = Array.isArray(err.error?.message)
              ? err.error.message.join(', ')
              : err.error?.message || this.translationService.instant('common.toast.errorDeleted');
            this.toastService.show(msg, 'error');
          },
        });
      }
    });
  }

  onEditSwipe(payment: Payment): (event: Event) => void {
    return () => this.openEditDialog(payment);
  }

  onDeleteSwipe(payment: Payment): (event: Event) => void {
    return () => this.deletePayment(payment);
  }
}
