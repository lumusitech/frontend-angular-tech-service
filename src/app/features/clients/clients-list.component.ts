import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toLocalDateString, parseLocalDate } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { Client, PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
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
import {
  MobileCardComponent,
  MobileCardField,
} from '../../shared/components/mobile-card/mobile-card.component';
import { MobileFilterBarComponent } from '../../shared/components/mobile-filter-bar/mobile-filter-bar.component';
import { ClientFormComponent } from './client-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-clients-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
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
    MobileFilterBarComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'clients.title' | translate"
        [subtitle]="'clients.subtitle' | translate"
        [actionLabel]="'clients.newClient' | translate"
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

      @if (clientsResource.status() === 'loading' && !clientsResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (clientsResource.error()) {
        <app-error-state (retry)="clientsResource.reload()" />
      } @else if (clientsResource.hasValue() && clientsResource.value().data.length === 0) {
        <app-empty-state
          [title]="'clients.noClients' | translate"
          [message]="'clients.noClientsMessage' | translate"
          [actionLabel]="'clients.createClient' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (clientsResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (client of clientsResource.value().data; track client.id) {
            <app-mobile-card
              [title]="client.name"
              [status]="
                client.isActive
                  ? translationService.instant('common.active')
                  : translationService.instant('common.inactive')
              "
              [statusType]="$any('activeInactive')"
              [fields]="getClientFields(client)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(client)"
              [onDelete]="onDeleteSwipe(client)"
            />
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
            [dataSource]="clientsResource.value().data"
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
                {{ 'clients.name' | translate }}
              </th>
              <td mat-cell *matCellDef="let client" class="px-4 py-3 text-sm">
                <a
                  [routerLink]="['/admin/clients', client.id]"
                  class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {{ client.name }}
                </a>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'clients.email' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.email }}
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'clients.phone' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.phone }}
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
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.address }}
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
              <td mat-cell *matCellDef="let client" class="px-4 py-3">
                <app-status-badge [value]="client.isActive" type="activeInactive" />
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
                *matCellDef="let client"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ client.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let client" class="px-4 py-3 text-right">
                <div class="action-btn-group">
                  <button mat-icon-button (click)="$event.stopPropagation()" [matMenuTriggerFor]="clientActionsMenu" [title]="'common.actions' | translate">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #clientActionsMenu="matMenu">
                    <button mat-menu-item (click)="openEditDialog(client); $event.stopPropagation()">
                      <mat-icon>edit</mat-icon>
                      <span>{{ 'common.edit' | translate }}</span>
                    </button>
                    <button mat-menu-item (click)="deleteClient(client); $event.stopPropagation()">
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
              (click)="viewDetail(row)"
              class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            ></tr>
          </table>

          <mat-paginator
            [length]="clientsResource.value().total"
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
export class ClientsListComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly router = inject(Router);
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

  readonly clientsResource = httpResource<PaginatedResponse<Client>>(() => ({
    url: '/api/clients',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      ...(this.isActiveFilter() ? { isActive: this.isActiveFilter() } : {}),
      ...(this.dateFrom() ? { dateFrom: this.dateFrom() } : {}),
      ...(this.dateTo() ? { dateTo: this.dateTo() } : {}),
    },
  }));

  displayedColumns = ['name', 'email', 'phone', 'address', 'isActive', 'createdAt', 'actions'];

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

  ngOnInit(): void {}

  viewDetail(client: Client): void {
    this.router.navigate(['/admin/clients', client.id]);
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
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.clientsResource.reload();
    });
  }

  openEditDialog(client: Client): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '600px',
      data: { mode: 'edit', client },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.clientsResource.reload();
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

  deleteClient(client: Client): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar cliente',
        message: `¿Estás seguro de eliminar a ${client.name}?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.clientsService.delete(client.id).subscribe({
          next: () => {
            this.toastService.show(
              this.translationService.instant('common.toast.deleted'),
              'success',
            );
            this.clientsResource.reload();
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

  getClientFields(client: Client): MobileCardField[] {
    return [
      {
        label: this.translationService.instant('clients.email'),
        value: client.email,
        type: 'email',
      },
      {
        label: this.translationService.instant('clients.phone'),
        value: client.phone || '-',
        type: 'phone',
      },
      {
        label: this.translationService.instant('common.address'),
        value: client.address || '-',
        type: 'address',
      },
      {
        label: this.translationService.instant('common.created'),
        value: client.createdAt,
        type: 'date',
      },
    ];
  }

  onEditSwipe(client: Client): (event: Event) => void {
    return (_event: Event) => this.openEditDialog(client);
  }

  onDeleteSwipe(client: Client): (event: Event) => void {
    return (_event: Event) => this.deleteClient(client);
  }
}
