import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
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
import { ServiceTypeFormComponent } from './service-type-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-service-types-list',
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
        [title]="'serviceTypes.title' | translate"
        [subtitle]="'serviceTypes.subtitle' | translate"
        [actionLabel]="'serviceTypes.newServiceType' | translate"
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
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (serviceType of serviceTypesResource.value().data; track serviceType.id) {
            <app-mobile-card
              [title]="serviceType.name"
              [status]="serviceType.isActive ? translationService.instant('common.active') : translationService.instant('common.inactive')"
              [statusType]="$any('activeInactive')"
              [fields]="getServiceTypeFields(serviceType)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(serviceType)"
              [onDelete]="onDeleteSwipe(serviceType)"
            >
              <button mat-icon-button (click)="openEditDialog(serviceType); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteServiceType(serviceType); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
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
            [dataSource]="serviceTypesResource.value().data"
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
                <button
                  mat-icon-button
                  (click)="openEditDialog(serviceType); $event.stopPropagation()"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteServiceType(serviceType); $event.stopPropagation()"
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
export class ServiceTypesListComponent implements OnInit {
  private readonly serviceTypesService = inject(ServiceTypesService);
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
  readonly dateFromValue = computed(() => this.dateFrom() ? new Date(this.dateFrom()) : null);
  readonly dateToValue = computed(() => this.dateTo() ? new Date(this.dateTo()) : null);

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
    'name',
    'description',
    'estimatedDuration',
    'isActive',
    'createdAt',
    'actions',
  ];

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
    return this.searchFilter() !== '' || this.isActiveFilter() !== '' || this.dateFrom() !== '' || this.dateTo() !== '';
  });

  clearFilters(): void {
    this.searchFilter.set('');
    this.isActiveFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
  }

  getServiceTypeFields(serviceType: ServiceType): MobileCardField[] {
    return [
      { label: this.translationService.instant('serviceTypes.description'), value: serviceType.description || '-' },
      { label: this.translationService.instant('serviceTypes.estimatedDuration'), value: serviceType.estimatedDuration ? `${serviceType.estimatedDuration} min` : '-' },
      { label: this.translationService.instant('common.created'), value: serviceType.createdAt, type: 'date' },
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
            this.toastService.show(this.translationService.instant('common.toast.deleted'), 'success');
            this.serviceTypesResource.reload();
          },
          error: (err) => {
            const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorDeleted');
            this.toastService.show(msg, 'error');
          },
        });
      }
    });
  }

  onEditSwipe(serviceType: ServiceType): (event: Event) => void {
    return (_event: Event) => this.openEditDialog(serviceType);
  }

  onDeleteSwipe(serviceType: ServiceType): (event: Event) => void {
    return (_event: Event) => this.deleteServiceType(serviceType);
  }
}
