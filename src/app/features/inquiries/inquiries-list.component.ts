import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { InquiriesService } from '../../core/services/inquiries.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  Inquiry,
  InquiryStatus,
  InquirySource,
  PaginatedResponse,
} from '../../core/models/inquiry.interfaces';
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
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { InquiryFormComponent } from './inquiry-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

const STATUS_COLORS: Record<string, string> = {
  new: 'text-blue-400 bg-blue-500/15',
  contacted: 'text-yellow-400 bg-yellow-500/15',
  reviewed: 'text-purple-400 bg-purple-500/15',
  approved: 'text-green-400 bg-green-500/15',
  rejected: 'text-red-400 bg-red-500/15',
  converted: 'text-gray-400 bg-gray-500/15',
};

@Component({
  selector: 'app-inquiries-list',
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
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
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
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
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
  `,
})
export class InquiriesListComponent implements OnInit {
  private readonly inquiriesService = inject(InquiriesService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly _routeHighlight = signal<string | null>(null);
  private readonly _clearHighlight = signal(false);

  readonly fromNotification = signal(false);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');
  readonly statusFilter = signal('');
  readonly sourceFilter = signal('');
  readonly searchFilter = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly dateFromValue = computed(() => this.dateFrom() ? new Date(this.dateFrom()) : null);
  readonly dateToValue = computed(() => this.dateTo() ? new Date(this.dateTo()) : null);

  readonly resource = httpResource<PaginatedResponse<Inquiry>>(() => ({
    url: '/api/inquiries',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: this.sortOrder(),
      ...(this.statusFilter() ? { status: this.statusFilter() } : {}),
      ...(this.sourceFilter() ? { source: this.sourceFilter() } : {}),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      ...(this.dateFrom() ? { dateFrom: this.dateFrom() } : {}),
      ...(this.dateTo() ? { dateTo: this.dateTo() } : {}),
    },
  }));

  readonly highlightedId = computed(() => {
    const data = this.resource.value();
    const search = this.searchFilter();
    const fromNotif = this.fromNotification();
    const loading = this.resource.isLoading();
    const cleared = this._clearHighlight();
    const routeHighlight = this._routeHighlight();

    if (!data || cleared || loading) return null;

    if (fromNotif && search) {
      const match = data.data.find(
        (row) => row.clientName === search || row.id === search,
      );
      return match?.id ?? null;
    }

    if (routeHighlight && !fromNotif) {
      const match = data.data.find((row) => row.id === routeHighlight);
      return match?.id ?? null;
    }

    return null;
  });

  displayedColumns = ['clientName', 'clientAddress', 'source', 'status', 'assignedTo', 'createdAt', 'actions'];

  ngOnInit(): void {
    const highlightId = this.route.snapshot.queryParamMap.get('highlight');
    const fromNotification = this.route.snapshot.queryParamMap.get('fromNotification') === 'true';
    const searchQuery = this.route.snapshot.queryParamMap.get('search');

    this.fromNotification.set(fromNotification);

    if (fromNotification && !searchQuery) {
      this.pageSize.set(100);
    } else if (highlightId && !fromNotification) {
      this._routeHighlight.set(highlightId);
      this.pageSize.set(50);
      setTimeout(() => this._clearHighlight.set(true), 3000);
    }

    if (searchQuery) {
      this.searchFilter.set(searchQuery);
    }
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'text-gray-400 bg-gray-500/15';
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortOrder.set((sort.direction || 'asc').toUpperCase() as 'ASC' | 'DESC');
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

  readonly hasActiveFilters = computed(() => {
    return this.searchFilter() !== '' || this.statusFilter() !== '' || this.sourceFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '' || this.fromNotification();
  });

  clearFilters(): void {
    this.searchFilter.set('');
    this.statusFilter.set('');
    this.sourceFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this._clearHighlight.set(true);
    this._routeHighlight.set(null);
    this.fromNotification.set(false);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(InquiryFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }

  openEditDialog(inquiry: Inquiry): void {
    const dialogRef = this.dialog.open(InquiryFormComponent, {
      width: '600px',
      data: { mode: 'edit', inquiry },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }

  viewDetail(inquiry: Inquiry): void {
    this.router.navigate(['/admin/inquiries', inquiry.id]);
  }

  deleteItem(inquiry: Inquiry): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titleKey: 'inquiries.deleteTitle',
        messageKey: 'inquiries.deleteMessage',
        messageParams: { name: inquiry.clientName },
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.inquiriesService.delete(inquiry.id).subscribe({
          next: () => {
            this.toastService.show(this.translationService.instant('common.toast.deleted'), 'success');
            this.resource.reload();
          },
          error: (err) => {
            const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorDeleted');
            this.toastService.show(msg, 'error');
          },
        });
      }
    });
  }
}
