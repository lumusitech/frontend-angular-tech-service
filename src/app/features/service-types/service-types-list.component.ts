import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { toLocalDateString, parseLocalDate } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { ServiceType } from '../../core/models/service-type.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import {
  MobileCardComponent,
  MobileCardField,
} from '../../shared/components/mobile-card/mobile-card.component';
import { BulkActionsComponent } from '../../shared/components/bulk-actions/bulk-actions.component';
import { ServiceTypeFormComponent } from './service-type-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { MobileFilterBarComponent } from '../../shared/components/mobile-filter-bar/mobile-filter-bar.component';
import { exportToCsv } from '../../shared/utils/csv-export.util';

@Component({
  selector: 'app-service-types-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
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
    MobileFilterBarComponent,
    BulkActionsComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'serviceTypes.title' | translate"
        [subtitle]="'serviceTypes.subtitle' | translate"
        [actionLabel]="'serviceTypes.newServiceType' | translate"
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
                inputmode="search"
                enterkeyhint="done"
                (keydown.enter)="$event.target.blur()"
                [placeholder]="'common.search' | translate"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-44">
              <mat-label>{{ 'common.status' | translate }}</mat-label>
              <mat-select
                [value]="isActiveFilter()"
                (selectionChange)="isActiveFilter.set($event.value)"
              >
                <mat-option value="">{{ 'common.all' | translate }}</mat-option>
                <mat-option value="true">{{ 'common.active' | translate }}</mat-option>
                <mat-option value="false">{{ 'common.inactive' | translate }}</mat-option>
              </mat-select>
            </mat-form-field>

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
        </div>
      </div>

      @if (serviceTypesResource.status() === 'loading' && !serviceTypesResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (serviceTypesResource.error()) {
        <app-error-state (retry)="serviceTypesResource.reload()" />
      } @else if (
        serviceTypesResource.hasValue() && serviceTypesResource.value().data.length === 0
      ) {
        <app-empty-state
          [title]="'serviceTypes.noServiceTypes' | translate"
          [message]="'serviceTypes.noServiceTypesMessage' | translate"
          [actionLabel]="'serviceTypes.createServiceType' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (serviceTypesResource.hasValue()) {
        <app-bulk-actions
          [selectedCount]="selectedIds().size"
          [totalCount]="currentPageData().length"
          [showStatusChange]="false"
          [showActivateDeactivate]="true"
          [showDelete]="true"
          [loading]="bulkLoading()"
          (selectAll)="onSelectAllPage($event)"
          (clearSelection)="clearSelection()"
          (exportCsv)="exportSelectedCsv()"
          (activate)="bulkSetActive($event)"
          (deleteSelected)="bulkDeleteServiceTypes()"
        />

        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (serviceType of serviceTypesResource.value().data; track serviceType.id) {
            <app-mobile-card
              [title]="serviceType.name"
              [status]="
                serviceType.isActive
                  ? translationService.instant('common.active')
                  : translationService.instant('common.inactive')
              "
              [statusType]="$any('activeInactive')"
              [fields]="getServiceTypeFields(serviceType)"
              [canSwipe]="true"
              [selectable]="true"
              [checked]="isSelected(serviceType.id)"
              (selectionChange)="toggleSelection(serviceType.id, $event)"
              [onEdit]="onEditSwipe(serviceType)"
              [onDelete]="onDeleteSwipe(serviceType)"
            >
              <button
                mat-icon-button
                (click)="openEditDialog(serviceType); $event.stopPropagation()"
                class="!w-8 !h-8"
              >
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button
                mat-icon-button
                (click)="deleteServiceType(serviceType); $event.stopPropagation()"
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
            [dataSource]="serviceTypesResource.value().data"
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
                *matCellDef="let serviceType"
                class="px-4 py-3"
                (click)="$event.stopPropagation()"
              >
                <mat-checkbox
                  color="primary"
                  [checked]="isSelected(serviceType.id)"
                  (change)="toggleSelection(serviceType.id, $event.checked)"
                />
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'serviceTypes.name' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ serviceType.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'serviceTypes.description' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ serviceType.description || '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="estimatedDuration">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'serviceTypes.estimatedDuration' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                @if (serviceType.estimatedDuration) {
                  {{ serviceType.estimatedDuration }} min
                } @else {
                  -
                }
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
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3">
                <app-status-badge [value]="serviceType.isActive" type="activeInactive" />
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
                *matCellDef="let serviceType"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ serviceType.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let serviceType" class="px-4 py-3 text-right">
                <div class="action-btn-group">
                  <button
                    mat-icon-button
                    (click)="$event.stopPropagation()"
                    [matMenuTriggerFor]="serviceTypeActionsMenu"
                    [title]="'common.actions' | translate"
                  >
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #serviceTypeActionsMenu="matMenu">
                    <button
                      mat-menu-item
                      (click)="openEditDialog(serviceType); $event.stopPropagation()"
                    >
                      <mat-icon>edit</mat-icon>
                      <span>{{ 'common.edit' | translate }}</span>
                    </button>
                    <button
                      mat-menu-item
                      (click)="deleteServiceType(serviceType); $event.stopPropagation()"
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
            [length]="serviceTypesResource.value().total"
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
export class ServiceTypesListComponent {
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  readonly translationService = inject(TranslationService);

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: false });

  readonly highlightedId = signal<string | null>(null);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly searchFilter = signal('');
  readonly isActiveFilter = signal<'true' | 'false' | ''>('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly dateError = signal('');
  readonly dateFromValue = computed(() =>
    this.dateFrom() ? parseLocalDate(this.dateFrom()) : null,
  );
  readonly dateToValue = computed(() => (this.dateTo() ? parseLocalDate(this.dateTo()) : null));

  readonly serviceTypesResource = httpResource<PaginatedResponse<ServiceType>>(() => ({
    url: '/api/service-types',
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

  displayedColumns = [
    'select',
    'name',
    'description',
    'estimatedDuration',
    'isActive',
    'createdAt',
    'actions',
  ];

  readonly selectedIds = signal<Set<string>>(new Set());
  readonly bulkLoading = signal(false);

  readonly currentPageData = computed<ServiceType[]>(
    () => this.serviceTypesResource.value()?.data ?? [],
  );
  readonly allPageSelected = computed(
    () =>
      this.currentPageData().length > 0 &&
      this.currentPageData().every((serviceType) => this.selectedIds().has(serviceType.id)),
  );
  readonly somePageSelected = computed(
    () =>
      this.currentPageData().some((serviceType) => this.selectedIds().has(serviceType.id)) &&
      !this.allPageSelected(),
  );

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
    for (const serviceType of this.currentPageData()) {
      if (checked) {
        next.add(serviceType.id);
      } else {
        next.delete(serviceType.id);
      }
    }
    this.selectedIds.set(next);
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  exportSelectedCsv(): void {
    const selected = this.currentPageData().filter((serviceType) =>
      this.selectedIds().has(serviceType.id),
    );
    if (selected.length === 0) return;

    const t = (key: string): string => this.translationService.instant(key);
    const headers = [
      t('serviceTypes.name'),
      t('serviceTypes.description'),
      t('serviceTypes.estimatedDuration'),
      t('common.status'),
      t('common.created'),
    ];
    const rows = selected.map((serviceType) => [
      serviceType.name,
      serviceType.description ?? '-',
      serviceType.estimatedDuration ? `${serviceType.estimatedDuration} min` : '-',
      serviceType.isActive ? t('common.active') : t('common.inactive'),
      serviceType.createdAt,
    ]);
    exportToCsv(`service-types-${toLocalDateString(new Date())}.csv`, headers, rows);
  }

  bulkSetActive(isActive: boolean): void {
    const count = this.selectedIds().size;
    if (count === 0) return;

    const entity = this.translationService.instant('serviceTypes.title');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translationService.instant(
          isActive ? 'bulk.activateConfirmTitle' : 'bulk.deactivateConfirmTitle',
          { entity },
        ),
        message: this.translationService.instant(
          isActive ? 'bulk.activateConfirmMessage' : 'bulk.deactivateConfirmMessage',
          { count: String(count), entity },
        ),
        confirmLabel: this.translationService.instant(
          isActive ? 'bulk.activate' : 'bulk.deactivate',
        ),
        color: isActive ? 'primary' : 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      const ids = Array.from(this.selectedIds());
      const key = isActive ? 'bulk.toast.activated' : 'bulk.toast.deactivated';
      this.bulkLoading.set(true);
      this.serviceTypesService.bulkUpdateStatus(ids, isActive).subscribe({
        next: (result) => {
          this.bulkLoading.set(false);
          const failedCount = result.failed.length;
          if (failedCount === 0) {
            this.toastService.show(this.translationService.instant(key, { entity }), 'success');
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
          this.serviceTypesResource.reload();
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

  bulkDeleteServiceTypes(): void {
    const count = this.selectedIds().size;
    if (count === 0) return;
    const entity = this.translationService.instant('serviceTypes.title');
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
      this.serviceTypesService.bulkDelete(ids).subscribe({
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
          this.serviceTypesResource.reload();
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

      const highlight = params.get('highlight');
      if (highlight) {
        this.highlightedId.set(highlight);
        const timeout = setTimeout(() => this.highlightedId.set(null), 3000);
        this.destroyRef.onDestroy(() => clearTimeout(timeout));
      }
    });
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
    const dialogRef = this.dialog.open(ServiceTypeFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.serviceTypesResource.reload();
    });
  }

  openEditDialog(serviceType: ServiceType): void {
    const dialogRef = this.dialog.open(ServiceTypeFormComponent, {
      width: '600px',
      data: { mode: 'edit', serviceType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.serviceTypesResource.reload();
    });
  }

  readonly hasActiveFilters = computed(() => {
    return (
      this.searchFilter() !== '' ||
      this.isActiveFilter() !== '' ||
      this.dateFrom() !== '' ||
      this.dateTo() !== ''
    );
  });

  clearFilters(): void {
    this.searchFilter.set('');
    this.isActiveFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.dateError.set('');
  }

  getServiceTypeFields(serviceType: ServiceType): MobileCardField[] {
    return [
      {
        label: this.translationService.instant('serviceTypes.description'),
        value: serviceType.description || '-',
      },
      {
        label: this.translationService.instant('serviceTypes.estimatedDuration'),
        value: serviceType.estimatedDuration ? `${serviceType.estimatedDuration} min` : '-',
      },
      {
        label: this.translationService.instant('common.created'),
        value: serviceType.createdAt,
        type: 'date',
      },
    ];
  }

  deleteServiceType(serviceType: ServiceType): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar tipo de servicio',
        message: `¿Estás seguro de eliminar "${serviceType.name}"?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.serviceTypesService.delete(serviceType.id).subscribe({
          next: () => {
            this.toastService.show(
              this.translationService.instant('common.toast.deleted'),
              'success',
            );
            this.serviceTypesResource.reload();
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

  onEditSwipe(serviceType: ServiceType): (event: Event) => void {
    return () => this.openEditDialog(serviceType);
  }

  onDeleteSwipe(serviceType: ServiceType): (event: Event) => void {
    return () => this.deleteServiceType(serviceType);
  }
}
