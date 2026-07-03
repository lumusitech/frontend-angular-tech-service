import { Component, computed, inject, signal } from '@angular/core';
import { toLocalDateString, parseLocalDate } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { BillingService } from '../../core/services/billing.service';
import { TranslationService } from '../../core/services/translation.service';
import { Invoice, InvoiceType, InvoiceStatus } from '../../core/models/invoice.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { InvoiceFormComponent } from './invoice-form.component';
import { DateFieldSelectorComponent, DateFieldOption } from '../../shared/components/date-field-selector/date-field-selector.component';

@Component({
  selector: 'app-invoices-list',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatAccordion,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    CurrencyArsPipe,
    MobileCardComponent,
    DateFieldSelectorComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'billing.title' | translate"
        [subtitle]="'billing.subtitle' | translate"
        [actionLabel]="'billing.newInvoice' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
              <mat-option value="">{{ 'billing.filters.allStatuses' | translate }}</mat-option>
              <mat-option value="draft">{{ 'billing.statuses.draft' | translate }}</mat-option>
              <mat-option value="issued">{{ 'billing.statuses.issued' | translate }}</mat-option>
              <mat-option value="cancelled">{{ 'billing.statuses.cancelled' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'billing.invoiceType' | translate }}</mat-label>
            <mat-select [value]="typeFilter()" (selectionChange)="typeFilter.set($event.value)">
              <mat-option value="">{{ 'billing.filters.allTypes' | translate }}</mat-option>
              <mat-option value="A">{{ 'billing.types.A' | translate }}</mat-option>
              <mat-option value="B">{{ 'billing.types.B' | translate }}</mat-option>
              <mat-option value="C">{{ 'billing.types.C' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'billing.clientName' | translate }}</mat-label>
            <input
              matInput
              [value]="clientNameFilter()"
              (input)="clientNameFilter.set(getInputValue($event))"
              [placeholder]="'common.search' | translate"
            />
          </mat-form-field>

          <app-date-field-selector
            [fields]="dateFieldOptions"
            [value]="dateField()"
            (valueChange)="onDateFieldChange($event)"
          />

          <mat-form-field appearance="outline" class="w-40" [class.!border-red-500]="dateError()">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateFromPicker" [value]="dateFromValue()" (dateChange)="onDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateFromPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-40" [class.!border-red-500]="dateError()">
            <mat-label>{{ 'common.to' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateToPicker" [value]="dateToValue()" (dateChange)="onDateToChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateToPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateToPicker></mat-datepicker>
          </mat-form-field>

          @if (dateError()) {
            <span class="text-red-500 dark:text-red-400 text-xs w-full">
              {{ dateError() | translate }}
            </span>
          }

          @if (hasActiveFilters()) {
            <button mat-stroked-button (click)="clearFilters()" class="!text-gray-500 dark:!text-gray-400">
              <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
              {{ 'common.clearFilters' | translate }}
            </button>
          }
        </div>
      </div>

      @if (invoicesResource.status() === 'loading' && !invoicesResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (invoicesResource.error()) {
        <app-error-state (retry)="invoicesResource.reload()" />
      } @else if (invoicesResource.hasValue() && invoicesResource.value().data.length === 0) {
        <app-empty-state
          [title]="'billing.noInvoices' | translate"
          [message]="'billing.noInvoicesMessage' | translate"
          [actionLabel]="'billing.createInvoice' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (invoicesResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (invoice of invoicesResource.value().data; track invoice.id) {
            <app-mobile-card
              [title]="invoice.invoiceNumber"
              [status]="invoice.status"
              [statusType]="$any('invoiceStatus')"
              [fields]="getInvoiceFields(invoice)"
            />
          }
        </mat-accordion>

        <!-- Desktop: Table -->
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="invoicesResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="invoiceNumber">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.invoiceNumber' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                <span class="font-mono text-sm">{{ invoice.invoiceNumber }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="invoiceType">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.invoiceType' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                <app-status-badge [value]="invoice.invoiceType" type="invoiceType" />
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'common.status' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                <app-status-badge [value]="invoice.status" type="invoiceStatus" />
              </td>
            </ng-container>

            <ng-container matColumnDef="clientName">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.clientName' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                {{ invoice.clientName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.total' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                {{ invoice.total | currencyArs }}
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.createdAt' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                {{ invoice.createdAt | relativeDate }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              (click)="goToDetail(row)"
              class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            ></tr>
          </table>

          <mat-paginator
            [length]="invoicesResource.value().total"
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
export class InvoicesListComponent {
  private readonly billingService = inject(BillingService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<InvoiceStatus | ''>('');
  readonly typeFilter = signal<InvoiceType | ''>('');
  readonly clientNameFilter = signal('');
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly dateField = signal('createdAt');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly dateError = signal('');
  readonly dateFromValue = computed(() => this.dateFrom() ? parseLocalDate(this.dateFrom()) : null);
  readonly dateToValue = computed(() => this.dateTo() ? parseLocalDate(this.dateTo()) : null);

  readonly dateFieldOptions: DateFieldOption[] = [
    { value: 'createdAt', labelKey: 'common.dateFieldCreated' },
    { value: 'issuedAt', labelKey: 'billing.dateFieldIssued' },
  ];

  readonly invoicesResource = httpResource<PaginatedResponse<Invoice>>(() => ({
    url: '/api/billing/invoices',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.statusFilter() ? { status: this.statusFilter() } : {}),
      ...(this.typeFilter() ? { invoiceType: this.typeFilter() } : {}),
      ...(this.clientNameFilter() ? { clientName: this.clientNameFilter() } : {}),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.dateFrom() ? { dateFrom: this.dateFrom() } : {}),
      ...(this.dateTo() ? { dateTo: this.dateTo() } : {}),
    },
  }));

  displayedColumns = ['invoiceNumber', 'invoiceType', 'status', 'clientName', 'total', 'createdAt'];

  readonly hasActiveFilters = computed(() => {
    return this.statusFilter() !== '' || this.typeFilter() !== '' || this.clientNameFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '';
  });

  clearFilters(): void {
    this.statusFilter.set('');
    this.typeFilter.set('');
    this.clientNameFilter.set('');
    this.dateField.set('createdAt');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.dateError.set('');
  }

  onDateFieldChange(field: string): void {
    this.dateField.set(field);
    this.dateFrom.set('');
    this.dateTo.set('');
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
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
          this.dateError.set('common.invalidDateRange');
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
          this.dateError.set('common.invalidDateRange');
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

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(InvoiceFormComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.invoicesResource.reload();
        this.router.navigate(['/admin/billing', result.id]);
      }
    });
  }

  goToDetail(invoice: Invoice): void {
    this.router.navigate(['/admin/billing', invoice.id]);
  }

  getInvoiceFields(invoice: Invoice): MobileCardField[] {
    return [
      { label: this.translationService.instant('billing.invoiceType'), value: invoice.invoiceType },
      { label: this.translationService.instant('billing.clientName'), value: invoice.clientName || '-' },
      { label: this.translationService.instant('billing.total'), value: String(invoice.total) },
      { label: this.translationService.instant('billing.createdAt'), value: invoice.createdAt, type: 'date' },
    ];
  }
}
