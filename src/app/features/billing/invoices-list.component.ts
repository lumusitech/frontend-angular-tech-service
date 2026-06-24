import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { BillingService } from '../../core/services/billing.service';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { InvoiceFormComponent } from './invoice-form.component';

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
    MatProgressSpinnerModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    CurrencyArsPipe,
    DatePipe,
    TranslatePipe,
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
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                {{ invoice.createdAt | date : 'dd/MM/yyyy' }}
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

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<InvoiceStatus | ''>('');
  readonly typeFilter = signal<InvoiceType | ''>('');
  readonly clientNameFilter = signal('');
  readonly sortBy = signal('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  readonly invoicesResource = httpResource<PaginatedResponse<Invoice>>(() => ({
    url: '/api/billing/invoices',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.statusFilter() ? { status: this.statusFilter() } : {}),
      ...(this.typeFilter() ? { invoiceType: this.typeFilter() } : {}),
      ...(this.clientNameFilter() ? { clientName: this.clientNameFilter() } : {}),
      ...(this.sortBy() ? { sortBy: this.sortBy(), order: this.sortOrder().toUpperCase() } : {}),
    },
  }));

  displayedColumns = ['invoiceNumber', 'invoiceType', 'status', 'clientName', 'total', 'createdAt'];

  readonly hasActiveFilters = computed(() => {
    return this.statusFilter() !== '' || this.typeFilter() !== '' || this.clientNameFilter() !== '';
  });

  clearFilters(): void {
    this.statusFilter.set('');
    this.typeFilter.set('');
    this.clientNameFilter.set('');
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
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
}
