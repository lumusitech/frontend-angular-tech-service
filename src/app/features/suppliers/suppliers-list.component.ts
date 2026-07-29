import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toLocalDateString, parseLocalDate } from '../../core/utils/date.utils';
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
    MobileCardComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
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

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateFromPicker" [value]="dateFromValue()" (dateChange)="onDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateFromPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-44">
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
  `,
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
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly searchFilter = signal('');
  readonly isActiveFilter = signal<'true' | 'false' | ''>('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly dateFromValue = computed(() => this.dateFrom() ? parseLocalDate(this.dateFrom()) : null);
  readonly dateToValue = computed(() => this.dateTo() ? parseLocalDate(this.dateTo()) : null);

  readonly suppliersResource = httpResource<PaginatedResponse<Supplier>>(() => ({
    url: '/api/suppliers',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      ...(this.isActiveFilter() ? { isActive: this.isActiveFilter() === 'true' } : {}),
      ...(this.dateFrom() ? { dateFrom: this.dateFrom() } : {}),
      ...(this.dateTo() ? { dateTo: this.dateTo() } : {}),
    },
  }));

  displayedColumns = ['name', 'contact', 'phone', 'email', 'address', 'isActive', 'createdAt', 'actions'];

  ngOnInit(): void {
    const highlightId = this.route.snapshot.queryParamMap.get('highlight');
    if (highlightId) {
      this.highlightedId.set(highlightId);
      setTimeout(() => this.highlightedId.set(null), 3000);
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

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    this.dateFrom.set(date ? toLocalDateString(date) : '');
  }

  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    this.dateTo.set(date ? toLocalDateString(date) : '');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.suppliersResource.reload();
    });
  }

  openEditDialog(supplier: Supplier): void {
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: '600px',
      data: { mode: 'edit', supplier },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.suppliersResource.reload();
    });
  }

  readonly hasActiveFilters = computed(() => {
    return this.searchFilter() !== '' || this.isActiveFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '';
  });

  clearFilters(): void {
    this.searchFilter.set('');
    this.isActiveFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
  }

  getSupplierFields(supplier: Supplier): MobileCardField[] {
    return [
      { label: this.translationService.instant('suppliers.contact'), value: supplier.contact || '-' },
      { label: this.translationService.instant('suppliers.phone'), value: supplier.phone || '-', type: 'phone' },
      { label: this.translationService.instant('suppliers.email'), value: supplier.email || '-', type: 'email' },
      { label: this.translationService.instant('common.address'), value: supplier.address || '-' },
      { label: this.translationService.instant('common.created'), value: supplier.createdAt, type: 'date' },
    ];
  }

  deleteSupplier(supplier: Supplier): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar proveedor',
        message: `¿Estás seguro de eliminar a ${supplier.name}?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.suppliersService.delete(supplier.id).subscribe({
          next: () => {
            this.toastService.show(this.translationService.instant('common.toast.deleted'), 'success');
            this.suppliersResource.reload();
          },
          error: (err) => {
            const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorDeleted');
            this.toastService.show(msg, 'error');
          },
        });
      }
    });
  }

  onEditSwipe(supplier: Supplier): (event: Event) => void {
    return (_event: Event) => this.openEditDialog(supplier);
  }

  onDeleteSwipe(supplier: Supplier): (event: Event) => void {
    return (_event: Event) => this.deleteSupplier(supplier);
  }
}
