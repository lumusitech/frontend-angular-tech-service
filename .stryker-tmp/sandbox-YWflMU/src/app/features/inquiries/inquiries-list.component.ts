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
import { ActivatedRoute, Router } from '@angular/router';
import { InquiriesService } from '../../core/services/inquiries.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { Inquiry, InquiryStatus, InquirySource, PaginatedResponse } from '../../core/models/inquiry.interfaces';
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
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { InquiryFormComponent } from './inquiry-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
const STATUS_COLORS: Record<string, string> = stryMutAct_9fa48("2395") ? {} : (stryCov_9fa48("2395"), {
  new: stryMutAct_9fa48("2396") ? "" : (stryCov_9fa48("2396"), 'text-blue-400 bg-blue-500/15'),
  contacted: stryMutAct_9fa48("2397") ? "" : (stryCov_9fa48("2397"), 'text-yellow-400 bg-yellow-500/15'),
  reviewed: stryMutAct_9fa48("2398") ? "" : (stryCov_9fa48("2398"), 'text-purple-400 bg-purple-500/15'),
  approved: stryMutAct_9fa48("2399") ? "" : (stryCov_9fa48("2399"), 'text-green-400 bg-green-500/15'),
  rejected: stryMutAct_9fa48("2400") ? "" : (stryCov_9fa48("2400"), 'text-red-400 bg-red-500/15'),
  converted: stryMutAct_9fa48("2401") ? "" : (stryCov_9fa48("2401"), 'text-gray-400 bg-gray-500/15')
});
@Component({
  selector: 'app-inquiries-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'inquiries.title' | translate"
        [subtitle]="'inquiries.subtitle' | translate"
        [actionLabel]="'inquiries.newInquiry' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
              <mat-option value="">{{ 'inquiries.filters.all' | translate }}</mat-option>
              <mat-option value="new">{{ 'inquiries.statuses.new' | translate }}</mat-option>
              <mat-option value="contacted">{{ 'inquiries.statuses.contacted' | translate }}</mat-option>
              <mat-option value="reviewed">{{ 'inquiries.statuses.reviewed' | translate }}</mat-option>
              <mat-option value="approved">{{ 'inquiries.statuses.approved' | translate }}</mat-option>
              <mat-option value="rejected">{{ 'inquiries.statuses.rejected' | translate }}</mat-option>
              <mat-option value="converted">{{ 'inquiries.statuses.converted' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'inquiries.source' | translate }}</mat-label>
            <mat-select [value]="sourceFilter()" (selectionChange)="sourceFilter.set($event.value)">
              <mat-option value="">{{ 'inquiries.filters.allSources' | translate }}</mat-option>
              <mat-option value="phone">{{ 'inquiries.sources.phone' | translate }}</mat-option>
              <mat-option value="email">{{ 'inquiries.sources.email' | translate }}</mat-option>
              <mat-option value="website">{{ 'inquiries.sources.website' | translate }}</mat-option>
              <mat-option value="referral">{{ 'inquiries.sources.referral' | translate }}</mat-option>
              <mat-option value="social_media">{{ 'inquiries.sources.socialMedia' | translate }}</mat-option>
              <mat-option value="walk_in">{{ 'inquiries.sources.walkIn' | translate }}</mat-option>
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

      @if (resource.status() === 'loading' && !resource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (resource.error()) {
        <app-error-state (retry)="resource.reload()" />
      } @else if (resource.hasValue() && resource.value().data.length === 0) {
        <app-empty-state
          [title]="'inquiries.noInquiries' | translate"
          [message]="'inquiries.noInquiriesMessage' | translate"
          [actionLabel]="'inquiries.newInquiry' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (resource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (inquiry of resource.value().data; track inquiry.id) {
            <app-mobile-card
              [title]="inquiry.clientName"
              [status]="inquiry.status"
              [statusType]="$any('inquiryStatus')"
              [fields]="getInquiryFields(inquiry)"
            >
              <button mat-icon-button (click)="openEditDialog(inquiry); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteItem(inquiry); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
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
            [dataSource]="resource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="clientName">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'inquiries.clientName' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let inquiry"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ inquiry.clientName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="clientAddress">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'common.address' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let inquiry"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ inquiry.clientAddress || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="source">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'inquiries.source' | translate }}
              </th>
              <td mat-cell *matCellDef="let inquiry" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {{ 'statusLabels.' + inquiry.source | translate }}
                </span>
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
              <td mat-cell *matCellDef="let inquiry" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class]="getStatusColor(inquiry.status)"
                >
                  {{ 'statusLabels.' + inquiry.status | translate }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="assignedTo">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'inquiries.assignedTo' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let inquiry"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ inquiry.assignedTo?.name || '-' }}
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
                *matCellDef="let inquiry"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ inquiry.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let inquiry" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="viewDetail(inquiry)"
                  [title]="'common.details' | translate"
                >
                  <mat-icon>visibility</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="openEditDialog(inquiry); $event.stopPropagation()"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteItem(inquiry); $event.stopPropagation()"
                  [title]="'common.delete' | translate"
                  color="warn"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" [class.highlight-pulse]="highlightedId() === row.id"></tr>
          </table>

          <mat-paginator
            [length]="resource.value().total"
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
export class InquiriesListComponent implements OnInit {
  private readonly inquiriesService = inject(InquiriesService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly _routeHighlight = signal<string | null>(null);
  private readonly _clearHighlight = signal(stryMutAct_9fa48("2402") ? true : (stryCov_9fa48("2402"), false));
  readonly fromNotification = signal(stryMutAct_9fa48("2403") ? true : (stryCov_9fa48("2403"), false));
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal(stryMutAct_9fa48("2404") ? "" : (stryCov_9fa48("2404"), 'createdAt'));
  readonly sortOrder = signal<'ASC' | 'DESC'>(stryMutAct_9fa48("2405") ? "" : (stryCov_9fa48("2405"), 'DESC'));
  readonly statusFilter = signal(stryMutAct_9fa48("2406") ? "Stryker was here!" : (stryCov_9fa48("2406"), ''));
  readonly sourceFilter = signal(stryMutAct_9fa48("2407") ? "Stryker was here!" : (stryCov_9fa48("2407"), ''));
  readonly searchFilter = signal(stryMutAct_9fa48("2408") ? "Stryker was here!" : (stryCov_9fa48("2408"), ''));
  readonly dateFrom = signal(stryMutAct_9fa48("2409") ? "Stryker was here!" : (stryCov_9fa48("2409"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("2410") ? "Stryker was here!" : (stryCov_9fa48("2410"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("2411") ? () => undefined : (stryCov_9fa48("2411"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("2412") ? () => undefined : (stryCov_9fa48("2412"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly resource = httpResource<PaginatedResponse<Inquiry>>(stryMutAct_9fa48("2413") ? () => undefined : (stryCov_9fa48("2413"), () => stryMutAct_9fa48("2414") ? {} : (stryCov_9fa48("2414"), {
    url: stryMutAct_9fa48("2415") ? "" : (stryCov_9fa48("2415"), '/api/inquiries'),
    params: stryMutAct_9fa48("2416") ? {} : (stryCov_9fa48("2416"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: this.sortOrder(),
      ...(this.statusFilter() ? stryMutAct_9fa48("2417") ? {} : (stryCov_9fa48("2417"), {
        status: this.statusFilter()
      }) : {}),
      ...(this.sourceFilter() ? stryMutAct_9fa48("2418") ? {} : (stryCov_9fa48("2418"), {
        source: this.sourceFilter()
      }) : {}),
      ...(this.searchFilter() ? stryMutAct_9fa48("2419") ? {} : (stryCov_9fa48("2419"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.dateFrom() ? stryMutAct_9fa48("2420") ? {} : (stryCov_9fa48("2420"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("2421") ? {} : (stryCov_9fa48("2421"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  readonly highlightedId = computed(() => {
    if (stryMutAct_9fa48("2422")) {
      {}
    } else {
      stryCov_9fa48("2422");
      const data = this.resource.value();
      const search = this.searchFilter();
      const fromNotif = this.fromNotification();
      const loading = this.resource.isLoading();
      const cleared = this._clearHighlight();
      const routeHighlight = this._routeHighlight();
      if (stryMutAct_9fa48("2425") ? (!data || cleared) && loading : stryMutAct_9fa48("2424") ? false : stryMutAct_9fa48("2423") ? true : (stryCov_9fa48("2423", "2424", "2425"), (stryMutAct_9fa48("2427") ? !data && cleared : stryMutAct_9fa48("2426") ? false : (stryCov_9fa48("2426", "2427"), (stryMutAct_9fa48("2428") ? data : (stryCov_9fa48("2428"), !data)) || cleared)) || loading)) return null;
      if (stryMutAct_9fa48("2431") ? fromNotif || search : stryMutAct_9fa48("2430") ? false : stryMutAct_9fa48("2429") ? true : (stryCov_9fa48("2429", "2430", "2431"), fromNotif && search)) {
        if (stryMutAct_9fa48("2432")) {
          {}
        } else {
          stryCov_9fa48("2432");
          const match = data.data.find(stryMutAct_9fa48("2433") ? () => undefined : (stryCov_9fa48("2433"), row => stryMutAct_9fa48("2436") ? row.clientName === search && row.id === search : stryMutAct_9fa48("2435") ? false : stryMutAct_9fa48("2434") ? true : (stryCov_9fa48("2434", "2435", "2436"), (stryMutAct_9fa48("2438") ? row.clientName !== search : stryMutAct_9fa48("2437") ? false : (stryCov_9fa48("2437", "2438"), row.clientName === search)) || (stryMutAct_9fa48("2440") ? row.id !== search : stryMutAct_9fa48("2439") ? false : (stryCov_9fa48("2439", "2440"), row.id === search)))));
          return stryMutAct_9fa48("2441") ? match?.id && null : (stryCov_9fa48("2441"), (stryMutAct_9fa48("2442") ? match.id : (stryCov_9fa48("2442"), match?.id)) ?? null);
        }
      }
      if (stryMutAct_9fa48("2445") ? routeHighlight || !fromNotif : stryMutAct_9fa48("2444") ? false : stryMutAct_9fa48("2443") ? true : (stryCov_9fa48("2443", "2444", "2445"), routeHighlight && (stryMutAct_9fa48("2446") ? fromNotif : (stryCov_9fa48("2446"), !fromNotif)))) {
        if (stryMutAct_9fa48("2447")) {
          {}
        } else {
          stryCov_9fa48("2447");
          const match = data.data.find(stryMutAct_9fa48("2448") ? () => undefined : (stryCov_9fa48("2448"), row => stryMutAct_9fa48("2451") ? row.id !== routeHighlight : stryMutAct_9fa48("2450") ? false : stryMutAct_9fa48("2449") ? true : (stryCov_9fa48("2449", "2450", "2451"), row.id === routeHighlight)));
          return stryMutAct_9fa48("2452") ? match?.id && null : (stryCov_9fa48("2452"), (stryMutAct_9fa48("2453") ? match.id : (stryCov_9fa48("2453"), match?.id)) ?? null);
        }
      }
      return null;
    }
  });
  displayedColumns = stryMutAct_9fa48("2454") ? [] : (stryCov_9fa48("2454"), [stryMutAct_9fa48("2455") ? "" : (stryCov_9fa48("2455"), 'clientName'), stryMutAct_9fa48("2456") ? "" : (stryCov_9fa48("2456"), 'clientAddress'), stryMutAct_9fa48("2457") ? "" : (stryCov_9fa48("2457"), 'source'), stryMutAct_9fa48("2458") ? "" : (stryCov_9fa48("2458"), 'status'), stryMutAct_9fa48("2459") ? "" : (stryCov_9fa48("2459"), 'assignedTo'), stryMutAct_9fa48("2460") ? "" : (stryCov_9fa48("2460"), 'createdAt'), stryMutAct_9fa48("2461") ? "" : (stryCov_9fa48("2461"), 'actions')]);
  ngOnInit(): void {
    if (stryMutAct_9fa48("2462")) {
      {}
    } else {
      stryCov_9fa48("2462");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("2463") ? "" : (stryCov_9fa48("2463"), 'highlight'));
      const fromNotification = stryMutAct_9fa48("2466") ? this.route.snapshot.queryParamMap.get('fromNotification') !== 'true' : stryMutAct_9fa48("2465") ? false : stryMutAct_9fa48("2464") ? true : (stryCov_9fa48("2464", "2465", "2466"), this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("2467") ? "" : (stryCov_9fa48("2467"), 'fromNotification')) === (stryMutAct_9fa48("2468") ? "" : (stryCov_9fa48("2468"), 'true')));
      const searchQuery = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("2469") ? "" : (stryCov_9fa48("2469"), 'search'));
      this.fromNotification.set(fromNotification);
      if (stryMutAct_9fa48("2472") ? fromNotification || !searchQuery : stryMutAct_9fa48("2471") ? false : stryMutAct_9fa48("2470") ? true : (stryCov_9fa48("2470", "2471", "2472"), fromNotification && (stryMutAct_9fa48("2473") ? searchQuery : (stryCov_9fa48("2473"), !searchQuery)))) {
        if (stryMutAct_9fa48("2474")) {
          {}
        } else {
          stryCov_9fa48("2474");
          this.pageSize.set(100);
        }
      } else if (stryMutAct_9fa48("2477") ? highlightId || !fromNotification : stryMutAct_9fa48("2476") ? false : stryMutAct_9fa48("2475") ? true : (stryCov_9fa48("2475", "2476", "2477"), highlightId && (stryMutAct_9fa48("2478") ? fromNotification : (stryCov_9fa48("2478"), !fromNotification)))) {
        if (stryMutAct_9fa48("2479")) {
          {}
        } else {
          stryCov_9fa48("2479");
          this._routeHighlight.set(highlightId);
          this.pageSize.set(50);
          setTimeout(stryMutAct_9fa48("2480") ? () => undefined : (stryCov_9fa48("2480"), () => this._clearHighlight.set(stryMutAct_9fa48("2481") ? false : (stryCov_9fa48("2481"), true))), 3000);
        }
      }
      if (stryMutAct_9fa48("2483") ? false : stryMutAct_9fa48("2482") ? true : (stryCov_9fa48("2482", "2483"), searchQuery)) {
        if (stryMutAct_9fa48("2484")) {
          {}
        } else {
          stryCov_9fa48("2484");
          this.searchFilter.set(searchQuery);
        }
      }
    }
  }
  getStatusColor(status: string): string {
    if (stryMutAct_9fa48("2485")) {
      {}
    } else {
      stryCov_9fa48("2485");
      return stryMutAct_9fa48("2488") ? STATUS_COLORS[status] && 'text-gray-400 bg-gray-500/15' : stryMutAct_9fa48("2487") ? false : stryMutAct_9fa48("2486") ? true : (stryCov_9fa48("2486", "2487", "2488"), STATUS_COLORS[status] || (stryMutAct_9fa48("2489") ? "" : (stryCov_9fa48("2489"), 'text-gray-400 bg-gray-500/15')));
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("2490")) {
      {}
    } else {
      stryCov_9fa48("2490");
      this.currentPage.set(stryMutAct_9fa48("2491") ? event.pageIndex - 1 : (stryCov_9fa48("2491"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("2492")) {
      {}
    } else {
      stryCov_9fa48("2492");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc').toUpperCase() as 'ASC' | 'DESC');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("2493")) {
      {}
    } else {
      stryCov_9fa48("2493");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("2494")) {
      {}
    } else {
      stryCov_9fa48("2494");
      const date = event.value;
      if (stryMutAct_9fa48("2496") ? false : stryMutAct_9fa48("2495") ? true : (stryCov_9fa48("2495", "2496"), date)) {
        if (stryMutAct_9fa48("2497")) {
          {}
        } else {
          stryCov_9fa48("2497");
          this.dateFrom.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("2498")) {
          {}
        } else {
          stryCov_9fa48("2498");
          this.dateFrom.set(stryMutAct_9fa48("2499") ? "Stryker was here!" : (stryCov_9fa48("2499"), ''));
        }
      }
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("2500")) {
      {}
    } else {
      stryCov_9fa48("2500");
      const date = event.value;
      if (stryMutAct_9fa48("2502") ? false : stryMutAct_9fa48("2501") ? true : (stryCov_9fa48("2501", "2502"), date)) {
        if (stryMutAct_9fa48("2503")) {
          {}
        } else {
          stryCov_9fa48("2503");
          this.dateTo.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("2504")) {
          {}
        } else {
          stryCov_9fa48("2504");
          this.dateTo.set(stryMutAct_9fa48("2505") ? "Stryker was here!" : (stryCov_9fa48("2505"), ''));
        }
      }
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("2506")) {
      {}
    } else {
      stryCov_9fa48("2506");
      return stryMutAct_9fa48("2509") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.sourceFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '') && this.fromNotification() : stryMutAct_9fa48("2508") ? false : stryMutAct_9fa48("2507") ? true : (stryCov_9fa48("2507", "2508", "2509"), (stryMutAct_9fa48("2511") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.sourceFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("2510") ? false : (stryCov_9fa48("2510", "2511"), (stryMutAct_9fa48("2513") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.sourceFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("2512") ? false : (stryCov_9fa48("2512", "2513"), (stryMutAct_9fa48("2515") ? (this.searchFilter() !== '' || this.statusFilter() !== '') && this.sourceFilter() !== '' : stryMutAct_9fa48("2514") ? false : (stryCov_9fa48("2514", "2515"), (stryMutAct_9fa48("2517") ? this.searchFilter() !== '' && this.statusFilter() !== '' : stryMutAct_9fa48("2516") ? false : (stryCov_9fa48("2516", "2517"), (stryMutAct_9fa48("2519") ? this.searchFilter() === '' : stryMutAct_9fa48("2518") ? false : (stryCov_9fa48("2518", "2519"), this.searchFilter() !== (stryMutAct_9fa48("2520") ? "Stryker was here!" : (stryCov_9fa48("2520"), '')))) || (stryMutAct_9fa48("2522") ? this.statusFilter() === '' : stryMutAct_9fa48("2521") ? false : (stryCov_9fa48("2521", "2522"), this.statusFilter() !== (stryMutAct_9fa48("2523") ? "Stryker was here!" : (stryCov_9fa48("2523"), '')))))) || (stryMutAct_9fa48("2525") ? this.sourceFilter() === '' : stryMutAct_9fa48("2524") ? false : (stryCov_9fa48("2524", "2525"), this.sourceFilter() !== (stryMutAct_9fa48("2526") ? "Stryker was here!" : (stryCov_9fa48("2526"), '')))))) || (stryMutAct_9fa48("2528") ? this.dateFrom() === '' : stryMutAct_9fa48("2527") ? false : (stryCov_9fa48("2527", "2528"), this.dateFrom() !== (stryMutAct_9fa48("2529") ? "Stryker was here!" : (stryCov_9fa48("2529"), '')))))) || (stryMutAct_9fa48("2531") ? this.dateTo() === '' : stryMutAct_9fa48("2530") ? false : (stryCov_9fa48("2530", "2531"), this.dateTo() !== (stryMutAct_9fa48("2532") ? "Stryker was here!" : (stryCov_9fa48("2532"), '')))))) || this.fromNotification());
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("2533")) {
      {}
    } else {
      stryCov_9fa48("2533");
      this.searchFilter.set(stryMutAct_9fa48("2534") ? "Stryker was here!" : (stryCov_9fa48("2534"), ''));
      this.statusFilter.set(stryMutAct_9fa48("2535") ? "Stryker was here!" : (stryCov_9fa48("2535"), ''));
      this.sourceFilter.set(stryMutAct_9fa48("2536") ? "Stryker was here!" : (stryCov_9fa48("2536"), ''));
      this.dateFrom.set(stryMutAct_9fa48("2537") ? "Stryker was here!" : (stryCov_9fa48("2537"), ''));
      this.dateTo.set(stryMutAct_9fa48("2538") ? "Stryker was here!" : (stryCov_9fa48("2538"), ''));
      this._clearHighlight.set(stryMutAct_9fa48("2539") ? false : (stryCov_9fa48("2539"), true));
      this._routeHighlight.set(null);
      this.fromNotification.set(stryMutAct_9fa48("2540") ? true : (stryCov_9fa48("2540"), false));
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("2541")) {
      {}
    } else {
      stryCov_9fa48("2541");
      const dialogRef = this.dialog.open(InquiryFormComponent, stryMutAct_9fa48("2542") ? {} : (stryCov_9fa48("2542"), {
        width: stryMutAct_9fa48("2543") ? "" : (stryCov_9fa48("2543"), '600px'),
        data: stryMutAct_9fa48("2544") ? {} : (stryCov_9fa48("2544"), {
          mode: stryMutAct_9fa48("2545") ? "" : (stryCov_9fa48("2545"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("2546")) {
          {}
        } else {
          stryCov_9fa48("2546");
          if (stryMutAct_9fa48("2548") ? false : stryMutAct_9fa48("2547") ? true : (stryCov_9fa48("2547", "2548"), result)) this.resource.reload();
        }
      });
    }
  }
  openEditDialog(inquiry: Inquiry): void {
    if (stryMutAct_9fa48("2549")) {
      {}
    } else {
      stryCov_9fa48("2549");
      const dialogRef = this.dialog.open(InquiryFormComponent, stryMutAct_9fa48("2550") ? {} : (stryCov_9fa48("2550"), {
        width: stryMutAct_9fa48("2551") ? "" : (stryCov_9fa48("2551"), '600px'),
        data: stryMutAct_9fa48("2552") ? {} : (stryCov_9fa48("2552"), {
          mode: stryMutAct_9fa48("2553") ? "" : (stryCov_9fa48("2553"), 'edit'),
          inquiry
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("2554")) {
          {}
        } else {
          stryCov_9fa48("2554");
          if (stryMutAct_9fa48("2556") ? false : stryMutAct_9fa48("2555") ? true : (stryCov_9fa48("2555", "2556"), result)) this.resource.reload();
        }
      });
    }
  }
  getInquiryFields(inquiry: Inquiry): MobileCardField[] {
    if (stryMutAct_9fa48("2557")) {
      {}
    } else {
      stryCov_9fa48("2557");
      return stryMutAct_9fa48("2558") ? [] : (stryCov_9fa48("2558"), [stryMutAct_9fa48("2559") ? {} : (stryCov_9fa48("2559"), {
        label: this.translationService.instant(stryMutAct_9fa48("2560") ? "" : (stryCov_9fa48("2560"), 'inquiries.source')),
        value: inquiry.source
      }), stryMutAct_9fa48("2561") ? {} : (stryCov_9fa48("2561"), {
        label: this.translationService.instant(stryMutAct_9fa48("2562") ? "" : (stryCov_9fa48("2562"), 'inquiries.assignedTo')),
        value: stryMutAct_9fa48("2565") ? inquiry.assignedTo?.name && '-' : stryMutAct_9fa48("2564") ? false : stryMutAct_9fa48("2563") ? true : (stryCov_9fa48("2563", "2564", "2565"), (stryMutAct_9fa48("2566") ? inquiry.assignedTo.name : (stryCov_9fa48("2566"), inquiry.assignedTo?.name)) || (stryMutAct_9fa48("2567") ? "" : (stryCov_9fa48("2567"), '-')))
      }), stryMutAct_9fa48("2568") ? {} : (stryCov_9fa48("2568"), {
        label: this.translationService.instant(stryMutAct_9fa48("2569") ? "" : (stryCov_9fa48("2569"), 'common.created')),
        value: inquiry.createdAt,
        type: stryMutAct_9fa48("2570") ? "" : (stryCov_9fa48("2570"), 'date')
      })]);
    }
  }
  viewDetail(inquiry: Inquiry): void {
    if (stryMutAct_9fa48("2571")) {
      {}
    } else {
      stryCov_9fa48("2571");
      this.router.navigate(stryMutAct_9fa48("2572") ? [] : (stryCov_9fa48("2572"), [stryMutAct_9fa48("2573") ? "" : (stryCov_9fa48("2573"), '/admin/inquiries'), inquiry.id]));
    }
  }
  deleteItem(inquiry: Inquiry): void {
    if (stryMutAct_9fa48("2574")) {
      {}
    } else {
      stryCov_9fa48("2574");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("2575") ? {} : (stryCov_9fa48("2575"), {
        width: stryMutAct_9fa48("2576") ? "" : (stryCov_9fa48("2576"), '400px'),
        data: stryMutAct_9fa48("2577") ? {} : (stryCov_9fa48("2577"), {
          titleKey: stryMutAct_9fa48("2578") ? "" : (stryCov_9fa48("2578"), 'inquiries.deleteTitle'),
          messageKey: stryMutAct_9fa48("2579") ? "" : (stryCov_9fa48("2579"), 'inquiries.deleteMessage'),
          messageParams: stryMutAct_9fa48("2580") ? {} : (stryCov_9fa48("2580"), {
            name: inquiry.clientName
          }),
          confirmLabel: stryMutAct_9fa48("2581") ? "" : (stryCov_9fa48("2581"), 'Eliminar'),
          color: stryMutAct_9fa48("2582") ? "" : (stryCov_9fa48("2582"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("2583")) {
          {}
        } else {
          stryCov_9fa48("2583");
          if (stryMutAct_9fa48("2585") ? false : stryMutAct_9fa48("2584") ? true : (stryCov_9fa48("2584", "2585"), confirmed)) {
            if (stryMutAct_9fa48("2586")) {
              {}
            } else {
              stryCov_9fa48("2586");
              this.inquiriesService.delete(inquiry.id).subscribe(stryMutAct_9fa48("2587") ? {} : (stryCov_9fa48("2587"), {
                next: () => {
                  if (stryMutAct_9fa48("2588")) {
                    {}
                  } else {
                    stryCov_9fa48("2588");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("2589") ? "" : (stryCov_9fa48("2589"), 'common.toast.deleted')), stryMutAct_9fa48("2590") ? "" : (stryCov_9fa48("2590"), 'success'));
                    this.resource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("2591")) {
                    {}
                  } else {
                    stryCov_9fa48("2591");
                    const msg = Array.isArray(stryMutAct_9fa48("2592") ? err.error.message : (stryCov_9fa48("2592"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("2593") ? "" : (stryCov_9fa48("2593"), ', ')) : stryMutAct_9fa48("2596") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("2595") ? false : stryMutAct_9fa48("2594") ? true : (stryCov_9fa48("2594", "2595", "2596"), (stryMutAct_9fa48("2597") ? err.error.message : (stryCov_9fa48("2597"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("2598") ? "" : (stryCov_9fa48("2598"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("2599") ? "" : (stryCov_9fa48("2599"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
}