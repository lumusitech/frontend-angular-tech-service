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
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { PaymentFormComponent } from './payment-form.component';
@Component({
  selector: 'app-payments-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, TrackingCodeComponent, CurrencyArsPipe, MobileCardComponent, TranslatePipe, RelativeDatePipe, MatDialogModule],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'payments.title' | translate"
        [subtitle]="'payments.subtitle' | translate"
        [actionLabel]="'payments.newPayment' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
              <mat-option>{{ 'payments.filters.all' | translate }}</mat-option>
              <mat-option value="pending">{{ 'payments.statuses.pending' | translate }}</mat-option>
              <mat-option value="approved">{{ 'payments.statuses.approved' | translate }}</mat-option>
              <mat-option value="rejected">{{ 'payments.statuses.rejected' | translate }}</mat-option>
              <mat-option value="refunded">{{ 'payments.statuses.refunded' | translate }}</mat-option>
              <mat-option value="cancelled">{{
                'payments.statuses.cancelled' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'payments.method' | translate }}</mat-label>
            <mat-select [value]="methodFilter()" (selectionChange)="methodFilter.set($event.value)">
              <mat-option>{{ 'payments.filters.allMethods' | translate }}</mat-option>
              <mat-option value="cash">{{ 'payments.methods.cash' | translate }}</mat-option>
              <mat-option value="transfer">{{ 'payments.methods.transfer' | translate }}</mat-option>
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

          @if (fromNotification()) {
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
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
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (payment of paymentsResource.value().data; track payment.id) {
            <app-mobile-card
              [title]="payment.workOrder?.trackingCode ?? '-'"
              [status]="payment.status"
              [statusType]="$any('paymentStatus')"
              [fields]="getPaymentFields(payment)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(payment)"
              [onDelete]="onDeleteSwipe(payment)"
            >
              <button mat-icon-button (click)="openEditDialog(payment); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deletePayment(payment); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
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
            [dataSource]="paymentsResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
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
                @if (payment.status === 'pending') {
                  <button
                    mat-icon-button
                    (click)="approvePayment(payment); $event.stopPropagation()"
                    [title]="'payments.approve' | translate"
                    color="primary"
                  >
                    <mat-icon>check_circle</mat-icon>
                  </button>
                }
                <button
                  mat-icon-button
                  (click)="openEditDialog(payment); $event.stopPropagation()"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deletePayment(payment); $event.stopPropagation()"
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
            [length]="paymentsResource.value().total"
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
export class PaymentsListComponent implements OnInit {
  private readonly paymentsService = inject(PaymentsService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly highlightedId = signal<string | null>(null);
  readonly fromNotification = signal(stryMutAct_9fa48("3049") ? true : (stryCov_9fa48("3049"), false));
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<PaymentStatus | ''>(stryMutAct_9fa48("3050") ? "Stryker was here!" : (stryCov_9fa48("3050"), ''));
  readonly methodFilter = signal<PaymentMethod | ''>(stryMutAct_9fa48("3051") ? "Stryker was here!" : (stryCov_9fa48("3051"), ''));
  readonly sortBy = signal(stryMutAct_9fa48("3052") ? "" : (stryCov_9fa48("3052"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("3053") ? "" : (stryCov_9fa48("3053"), 'desc'));
  readonly searchFilter = signal(stryMutAct_9fa48("3054") ? "Stryker was here!" : (stryCov_9fa48("3054"), ''));
  readonly dateFrom = signal(stryMutAct_9fa48("3055") ? "Stryker was here!" : (stryCov_9fa48("3055"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("3056") ? "Stryker was here!" : (stryCov_9fa48("3056"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("3057") ? () => undefined : (stryCov_9fa48("3057"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("3058") ? () => undefined : (stryCov_9fa48("3058"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly paymentsResource = httpResource<PaginatedResponse<Payment>>(stryMutAct_9fa48("3059") ? () => undefined : (stryCov_9fa48("3059"), () => stryMutAct_9fa48("3060") ? {} : (stryCov_9fa48("3060"), {
    url: stryMutAct_9fa48("3061") ? "" : (stryCov_9fa48("3061"), '/api/payments'),
    params: stryMutAct_9fa48("3062") ? {} : (stryCov_9fa48("3062"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.statusFilter() ? stryMutAct_9fa48("3063") ? {} : (stryCov_9fa48("3063"), {
        status: this.statusFilter()
      }) : {}),
      ...(this.methodFilter() ? stryMutAct_9fa48("3064") ? {} : (stryCov_9fa48("3064"), {
        method: this.methodFilter()
      }) : {}),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("3065") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("3065"), this.sortOrder().toUpperCase()),
      ...(this.searchFilter() ? stryMutAct_9fa48("3066") ? {} : (stryCov_9fa48("3066"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.dateFrom() ? stryMutAct_9fa48("3067") ? {} : (stryCov_9fa48("3067"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("3068") ? {} : (stryCov_9fa48("3068"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("3069") ? [] : (stryCov_9fa48("3069"), [stryMutAct_9fa48("3070") ? "" : (stryCov_9fa48("3070"), 'trackingCode'), stryMutAct_9fa48("3071") ? "" : (stryCov_9fa48("3071"), 'amount'), stryMutAct_9fa48("3072") ? "" : (stryCov_9fa48("3072"), 'method'), stryMutAct_9fa48("3073") ? "" : (stryCov_9fa48("3073"), 'provider'), stryMutAct_9fa48("3074") ? "" : (stryCov_9fa48("3074"), 'status'), stryMutAct_9fa48("3075") ? "" : (stryCov_9fa48("3075"), 'paidAt'), stryMutAct_9fa48("3076") ? "" : (stryCov_9fa48("3076"), 'createdAt'), stryMutAct_9fa48("3077") ? "" : (stryCov_9fa48("3077"), 'actions')]);
  ngOnInit(): void {
    if (stryMutAct_9fa48("3078")) {
      {}
    } else {
      stryCov_9fa48("3078");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("3079") ? "" : (stryCov_9fa48("3079"), 'highlight'));
      const fromNotification = stryMutAct_9fa48("3082") ? this.route.snapshot.queryParamMap.get('fromNotification') !== 'true' : stryMutAct_9fa48("3081") ? false : stryMutAct_9fa48("3080") ? true : (stryCov_9fa48("3080", "3081", "3082"), this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("3083") ? "" : (stryCov_9fa48("3083"), 'fromNotification')) === (stryMutAct_9fa48("3084") ? "" : (stryCov_9fa48("3084"), 'true')));
      if (stryMutAct_9fa48("3086") ? false : stryMutAct_9fa48("3085") ? true : (stryCov_9fa48("3085", "3086"), highlightId)) {
        if (stryMutAct_9fa48("3087")) {
          {}
        } else {
          stryCov_9fa48("3087");
          this.highlightedId.set(highlightId);
          this.fromNotification.set(fromNotification);
          if (stryMutAct_9fa48("3090") ? false : stryMutAct_9fa48("3089") ? true : stryMutAct_9fa48("3088") ? fromNotification : (stryCov_9fa48("3088", "3089", "3090"), !fromNotification)) {
            if (stryMutAct_9fa48("3091")) {
              {}
            } else {
              stryCov_9fa48("3091");
              this.pageSize.set(50);
              setTimeout(stryMutAct_9fa48("3092") ? () => undefined : (stryCov_9fa48("3092"), () => this.highlightedId.set(null)), 3000);
            }
          }
        }
      }
      const searchQuery = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("3093") ? "" : (stryCov_9fa48("3093"), 'search'));
      if (stryMutAct_9fa48("3095") ? false : stryMutAct_9fa48("3094") ? true : (stryCov_9fa48("3094", "3095"), searchQuery)) {
        if (stryMutAct_9fa48("3096")) {
          {}
        } else {
          stryCov_9fa48("3096");
          this.searchFilter.set(searchQuery);
        }
      }
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("3097")) {
      {}
    } else {
      stryCov_9fa48("3097");
      this.currentPage.set(stryMutAct_9fa48("3098") ? event.pageIndex - 1 : (stryCov_9fa48("3098"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("3099")) {
      {}
    } else {
      stryCov_9fa48("3099");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("3100")) {
      {}
    } else {
      stryCov_9fa48("3100");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("3101")) {
      {}
    } else {
      stryCov_9fa48("3101");
      const date = event.value;
      if (stryMutAct_9fa48("3103") ? false : stryMutAct_9fa48("3102") ? true : (stryCov_9fa48("3102", "3103"), date)) {
        if (stryMutAct_9fa48("3104")) {
          {}
        } else {
          stryCov_9fa48("3104");
          this.dateFrom.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("3105")) {
          {}
        } else {
          stryCov_9fa48("3105");
          this.dateFrom.set(stryMutAct_9fa48("3106") ? "Stryker was here!" : (stryCov_9fa48("3106"), ''));
        }
      }
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("3107")) {
      {}
    } else {
      stryCov_9fa48("3107");
      const date = event.value;
      if (stryMutAct_9fa48("3109") ? false : stryMutAct_9fa48("3108") ? true : (stryCov_9fa48("3108", "3109"), date)) {
        if (stryMutAct_9fa48("3110")) {
          {}
        } else {
          stryCov_9fa48("3110");
          this.dateTo.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("3111")) {
          {}
        } else {
          stryCov_9fa48("3111");
          this.dateTo.set(stryMutAct_9fa48("3112") ? "Stryker was here!" : (stryCov_9fa48("3112"), ''));
        }
      }
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("3113")) {
      {}
    } else {
      stryCov_9fa48("3113");
      return stryMutAct_9fa48("3116") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.methodFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '') && this.fromNotification() : stryMutAct_9fa48("3115") ? false : stryMutAct_9fa48("3114") ? true : (stryCov_9fa48("3114", "3115", "3116"), (stryMutAct_9fa48("3118") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.methodFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("3117") ? false : (stryCov_9fa48("3117", "3118"), (stryMutAct_9fa48("3120") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.methodFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("3119") ? false : (stryCov_9fa48("3119", "3120"), (stryMutAct_9fa48("3122") ? (this.searchFilter() !== '' || this.statusFilter() !== '') && this.methodFilter() !== '' : stryMutAct_9fa48("3121") ? false : (stryCov_9fa48("3121", "3122"), (stryMutAct_9fa48("3124") ? this.searchFilter() !== '' && this.statusFilter() !== '' : stryMutAct_9fa48("3123") ? false : (stryCov_9fa48("3123", "3124"), (stryMutAct_9fa48("3126") ? this.searchFilter() === '' : stryMutAct_9fa48("3125") ? false : (stryCov_9fa48("3125", "3126"), this.searchFilter() !== (stryMutAct_9fa48("3127") ? "Stryker was here!" : (stryCov_9fa48("3127"), '')))) || (stryMutAct_9fa48("3129") ? this.statusFilter() === '' : stryMutAct_9fa48("3128") ? false : (stryCov_9fa48("3128", "3129"), this.statusFilter() !== (stryMutAct_9fa48("3130") ? "Stryker was here!" : (stryCov_9fa48("3130"), '')))))) || (stryMutAct_9fa48("3132") ? this.methodFilter() === '' : stryMutAct_9fa48("3131") ? false : (stryCov_9fa48("3131", "3132"), this.methodFilter() !== (stryMutAct_9fa48("3133") ? "Stryker was here!" : (stryCov_9fa48("3133"), '')))))) || (stryMutAct_9fa48("3135") ? this.dateFrom() === '' : stryMutAct_9fa48("3134") ? false : (stryCov_9fa48("3134", "3135"), this.dateFrom() !== (stryMutAct_9fa48("3136") ? "Stryker was here!" : (stryCov_9fa48("3136"), '')))))) || (stryMutAct_9fa48("3138") ? this.dateTo() === '' : stryMutAct_9fa48("3137") ? false : (stryCov_9fa48("3137", "3138"), this.dateTo() !== (stryMutAct_9fa48("3139") ? "Stryker was here!" : (stryCov_9fa48("3139"), '')))))) || this.fromNotification());
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("3140")) {
      {}
    } else {
      stryCov_9fa48("3140");
      this.searchFilter.set(stryMutAct_9fa48("3141") ? "Stryker was here!" : (stryCov_9fa48("3141"), ''));
      this.statusFilter.set(stryMutAct_9fa48("3142") ? "Stryker was here!" : (stryCov_9fa48("3142"), ''));
      this.methodFilter.set(stryMutAct_9fa48("3143") ? "Stryker was here!" : (stryCov_9fa48("3143"), ''));
      this.dateFrom.set(stryMutAct_9fa48("3144") ? "Stryker was here!" : (stryCov_9fa48("3144"), ''));
      this.dateTo.set(stryMutAct_9fa48("3145") ? "Stryker was here!" : (stryCov_9fa48("3145"), ''));
      this.highlightedId.set(null);
      this.fromNotification.set(stryMutAct_9fa48("3146") ? true : (stryCov_9fa48("3146"), false));
    }
  }
  approvePayment(payment: Payment): void {
    if (stryMutAct_9fa48("3147")) {
      {}
    } else {
      stryCov_9fa48("3147");
      if (stryMutAct_9fa48("3150") ? payment.status === 'pending' : stryMutAct_9fa48("3149") ? false : stryMutAct_9fa48("3148") ? true : (stryCov_9fa48("3148", "3149", "3150"), payment.status !== (stryMutAct_9fa48("3151") ? "" : (stryCov_9fa48("3151"), 'pending')))) return;
      this.paymentsService.update(payment.id, stryMutAct_9fa48("3152") ? {} : (stryCov_9fa48("3152"), {
        status: stryMutAct_9fa48("3153") ? "" : (stryCov_9fa48("3153"), 'approved'),
        paidAt: new Date().toISOString()
      })).subscribe(stryMutAct_9fa48("3154") ? {} : (stryCov_9fa48("3154"), {
        next: stryMutAct_9fa48("3155") ? () => undefined : (stryCov_9fa48("3155"), () => this.paymentsResource.reload())
      }));
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("3156")) {
      {}
    } else {
      stryCov_9fa48("3156");
      const dialogRef = this.dialog.open(PaymentFormComponent, stryMutAct_9fa48("3157") ? {} : (stryCov_9fa48("3157"), {
        width: stryMutAct_9fa48("3158") ? "" : (stryCov_9fa48("3158"), '600px'),
        data: stryMutAct_9fa48("3159") ? {} : (stryCov_9fa48("3159"), {
          mode: stryMutAct_9fa48("3160") ? "" : (stryCov_9fa48("3160"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("3161")) {
          {}
        } else {
          stryCov_9fa48("3161");
          if (stryMutAct_9fa48("3163") ? false : stryMutAct_9fa48("3162") ? true : (stryCov_9fa48("3162", "3163"), result)) this.paymentsResource.reload();
        }
      });
    }
  }
  openEditDialog(payment: Payment): void {
    if (stryMutAct_9fa48("3164")) {
      {}
    } else {
      stryCov_9fa48("3164");
      const dialogRef = this.dialog.open(PaymentFormComponent, stryMutAct_9fa48("3165") ? {} : (stryCov_9fa48("3165"), {
        width: stryMutAct_9fa48("3166") ? "" : (stryCov_9fa48("3166"), '600px'),
        data: stryMutAct_9fa48("3167") ? {} : (stryCov_9fa48("3167"), {
          mode: stryMutAct_9fa48("3168") ? "" : (stryCov_9fa48("3168"), 'edit'),
          payment
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("3169")) {
          {}
        } else {
          stryCov_9fa48("3169");
          if (stryMutAct_9fa48("3171") ? false : stryMutAct_9fa48("3170") ? true : (stryCov_9fa48("3170", "3171"), result)) this.paymentsResource.reload();
        }
      });
    }
  }
  getPaymentFields(payment: Payment): MobileCardField[] {
    if (stryMutAct_9fa48("3172")) {
      {}
    } else {
      stryCov_9fa48("3172");
      return stryMutAct_9fa48("3173") ? [] : (stryCov_9fa48("3173"), [stryMutAct_9fa48("3174") ? {} : (stryCov_9fa48("3174"), {
        label: this.translationService.instant(stryMutAct_9fa48("3175") ? "" : (stryCov_9fa48("3175"), 'payments.amount')),
        value: String(payment.amount)
      }), stryMutAct_9fa48("3176") ? {} : (stryCov_9fa48("3176"), {
        label: this.translationService.instant(stryMutAct_9fa48("3177") ? "" : (stryCov_9fa48("3177"), 'payments.method')),
        value: payment.method
      }), stryMutAct_9fa48("3178") ? {} : (stryCov_9fa48("3178"), {
        label: this.translationService.instant(stryMutAct_9fa48("3179") ? "" : (stryCov_9fa48("3179"), 'payments.provider')),
        value: stryMutAct_9fa48("3182") ? payment.provider && '-' : stryMutAct_9fa48("3181") ? false : stryMutAct_9fa48("3180") ? true : (stryCov_9fa48("3180", "3181", "3182"), payment.provider || (stryMutAct_9fa48("3183") ? "" : (stryCov_9fa48("3183"), '-')))
      }), stryMutAct_9fa48("3184") ? {} : (stryCov_9fa48("3184"), {
        label: this.translationService.instant(stryMutAct_9fa48("3185") ? "" : (stryCov_9fa48("3185"), 'payments.paymentDate')),
        value: stryMutAct_9fa48("3188") ? payment.paidAt && '-' : stryMutAct_9fa48("3187") ? false : stryMutAct_9fa48("3186") ? true : (stryCov_9fa48("3186", "3187", "3188"), payment.paidAt || (stryMutAct_9fa48("3189") ? "" : (stryCov_9fa48("3189"), '-'))),
        type: stryMutAct_9fa48("3190") ? "" : (stryCov_9fa48("3190"), 'date')
      }), stryMutAct_9fa48("3191") ? {} : (stryCov_9fa48("3191"), {
        label: this.translationService.instant(stryMutAct_9fa48("3192") ? "" : (stryCov_9fa48("3192"), 'common.created')),
        value: payment.createdAt,
        type: stryMutAct_9fa48("3193") ? "" : (stryCov_9fa48("3193"), 'date')
      })]);
    }
  }
  deletePayment(payment: Payment): void {
    if (stryMutAct_9fa48("3194")) {
      {}
    } else {
      stryCov_9fa48("3194");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("3195") ? {} : (stryCov_9fa48("3195"), {
        width: stryMutAct_9fa48("3196") ? "" : (stryCov_9fa48("3196"), '400px'),
        data: stryMutAct_9fa48("3197") ? {} : (stryCov_9fa48("3197"), {
          title: this.translationService.instant(stryMutAct_9fa48("3198") ? "" : (stryCov_9fa48("3198"), 'payments.deleteTitle')),
          message: this.translationService.instant(stryMutAct_9fa48("3199") ? "" : (stryCov_9fa48("3199"), 'payments.deleteMessage'), stryMutAct_9fa48("3200") ? {} : (stryCov_9fa48("3200"), {
            amount: String(payment.amount)
          })),
          confirmLabel: this.translationService.instant(stryMutAct_9fa48("3201") ? "" : (stryCov_9fa48("3201"), 'common.delete')),
          color: stryMutAct_9fa48("3202") ? "" : (stryCov_9fa48("3202"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("3203")) {
          {}
        } else {
          stryCov_9fa48("3203");
          if (stryMutAct_9fa48("3205") ? false : stryMutAct_9fa48("3204") ? true : (stryCov_9fa48("3204", "3205"), confirmed)) {
            if (stryMutAct_9fa48("3206")) {
              {}
            } else {
              stryCov_9fa48("3206");
              this.paymentsService.delete(payment.id).subscribe(stryMutAct_9fa48("3207") ? {} : (stryCov_9fa48("3207"), {
                next: () => {
                  if (stryMutAct_9fa48("3208")) {
                    {}
                  } else {
                    stryCov_9fa48("3208");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("3209") ? "" : (stryCov_9fa48("3209"), 'common.toast.deleted')), stryMutAct_9fa48("3210") ? "" : (stryCov_9fa48("3210"), 'success'));
                    this.paymentsResource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("3211")) {
                    {}
                  } else {
                    stryCov_9fa48("3211");
                    const msg = Array.isArray(stryMutAct_9fa48("3212") ? err.error.message : (stryCov_9fa48("3212"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("3213") ? "" : (stryCov_9fa48("3213"), ', ')) : stryMutAct_9fa48("3216") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("3215") ? false : stryMutAct_9fa48("3214") ? true : (stryCov_9fa48("3214", "3215", "3216"), (stryMutAct_9fa48("3217") ? err.error.message : (stryCov_9fa48("3217"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("3218") ? "" : (stryCov_9fa48("3218"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("3219") ? "" : (stryCov_9fa48("3219"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  onEditSwipe(payment: Payment): (event: Event) => void {
    if (stryMutAct_9fa48("3220")) {
      {}
    } else {
      stryCov_9fa48("3220");
      return stryMutAct_9fa48("3221") ? () => undefined : (stryCov_9fa48("3221"), (_event: Event) => this.openEditDialog(payment));
    }
  }
  onDeleteSwipe(payment: Payment): (event: Event) => void {
    if (stryMutAct_9fa48("3222")) {
      {}
    } else {
      stryCov_9fa48("3222");
      return stryMutAct_9fa48("3223") ? () => undefined : (stryCov_9fa48("3223"), (_event: Event) => this.deletePayment(payment));
    }
  }
}