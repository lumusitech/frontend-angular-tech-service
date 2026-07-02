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
import { PendingItemsService } from '../../core/services/pending-items.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { PendingItem, PendingItemStatus, PendingItemPriority, PendingItemType, PaginatedResponse } from '../../core/models/pending-item.interfaces';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { PendingItemFormComponent } from './pending-item-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
const PRIORITY_LABELS: Record<string, string> = stryMutAct_9fa48("3287") ? {} : (stryCov_9fa48("3287"), {
  low: stryMutAct_9fa48("3288") ? "" : (stryCov_9fa48("3288"), 'Baja'),
  medium: stryMutAct_9fa48("3289") ? "" : (stryCov_9fa48("3289"), 'Media'),
  high: stryMutAct_9fa48("3290") ? "" : (stryCov_9fa48("3290"), 'Alta'),
  urgent: stryMutAct_9fa48("3291") ? "" : (stryCov_9fa48("3291"), 'Urgente')
});
const PRIORITY_COLORS: Record<string, string> = stryMutAct_9fa48("3292") ? {} : (stryCov_9fa48("3292"), {
  low: stryMutAct_9fa48("3293") ? "" : (stryCov_9fa48("3293"), 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'),
  medium: stryMutAct_9fa48("3294") ? "" : (stryCov_9fa48("3294"), 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'),
  high: stryMutAct_9fa48("3295") ? "" : (stryCov_9fa48("3295"), 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'),
  urgent: stryMutAct_9fa48("3296") ? "" : (stryCov_9fa48("3296"), 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30')
});
const STATUS_LABELS: Record<string, string> = stryMutAct_9fa48("3297") ? {} : (stryCov_9fa48("3297"), {
  pending: stryMutAct_9fa48("3298") ? "" : (stryCov_9fa48("3298"), 'Pendiente'),
  in_progress: stryMutAct_9fa48("3299") ? "" : (stryCov_9fa48("3299"), 'En progreso'),
  completed: stryMutAct_9fa48("3300") ? "" : (stryCov_9fa48("3300"), 'Completado'),
  cancelled: stryMutAct_9fa48("3301") ? "" : (stryCov_9fa48("3301"), 'Cancelado')
});
const STATUS_COLORS: Record<string, string> = stryMutAct_9fa48("3302") ? {} : (stryCov_9fa48("3302"), {
  pending: stryMutAct_9fa48("3303") ? "" : (stryCov_9fa48("3303"), 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'),
  in_progress: stryMutAct_9fa48("3304") ? "" : (stryCov_9fa48("3304"), 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'),
  completed: stryMutAct_9fa48("3305") ? "" : (stryCov_9fa48("3305"), 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'),
  cancelled: stryMutAct_9fa48("3306") ? "" : (stryCov_9fa48("3306"), 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700')
});
const TYPE_LABELS: Record<string, string> = stryMutAct_9fa48("3307") ? {} : (stryCov_9fa48("3307"), {
  work_order: stryMutAct_9fa48("3308") ? "" : (stryCov_9fa48("3308"), 'Orden de trabajo'),
  inquiry: stryMutAct_9fa48("3309") ? "" : (stryCov_9fa48("3309"), 'Consulta'),
  maintenance: stryMutAct_9fa48("3310") ? "" : (stryCov_9fa48("3310"), 'Mantenimiento'),
  follow_up: stryMutAct_9fa48("3311") ? "" : (stryCov_9fa48("3311"), 'Seguimiento'),
  other: stryMutAct_9fa48("3312") ? "" : (stryCov_9fa48("3312"), 'Otro')
});
@Component({
  selector: 'app-pending-items-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'pendingItems.title' | translate"
        [subtitle]="'pendingItems.subtitle' | translate"
        [actionLabel]="'pendingItems.newPendingItem' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
              <mat-option value="">{{ 'pendingItems.filters.all' | translate }}</mat-option>
              <mat-option value="pending">{{ 'pendingItems.statuses.pending' | translate }}</mat-option>
              <mat-option value="in_progress">{{ 'pendingItems.statuses.inProgress' | translate }}</mat-option>
              <mat-option value="completed">{{ 'pendingItems.statuses.completed' | translate }}</mat-option>
              <mat-option value="cancelled">{{ 'pendingItems.statuses.cancelled' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'pendingItems.priority' | translate }}</mat-label>
            <mat-select [value]="priorityFilter()" (selectionChange)="priorityFilter.set($event.value)">
              <mat-option value="">{{ 'pendingItems.filters.allPriorities' | translate }}</mat-option>
              <mat-option value="low">{{ 'pendingItems.priorities.low' | translate }}</mat-option>
              <mat-option value="medium">{{ 'pendingItems.priorities.medium' | translate }}</mat-option>
              <mat-option value="high">{{ 'pendingItems.priorities.high' | translate }}</mat-option>
              <mat-option value="urgent">{{ 'pendingItems.priorities.urgent' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.search' | translate }}</mat-label>
            <input matInput [value]="searchFilter()" (input)="searchFilter.set(getInputValue($event))" [placeholder]="'common.search' | translate" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dueDateFromPicker" [value]="dueDateFromValue()" (dateChange)="onDueDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dueDateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dueDateFromPicker></mat-datepicker>
          </mat-form-field>
            <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.to' | translate }}</mat-label>
            <input matInput [matDatepicker]="dueDateToPicker" [value]="dueDateToValue()" (dateChange)="onDueDateToChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dueDateToPicker"></mat-datepicker-toggle>
            <mat-datepicker #dueDateToPicker></mat-datepicker>
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
          [title]="'pendingItems.noPendingItems' | translate"
          [message]="'pendingItems.noPendingItemsMessage' | translate"
          [actionLabel]="'pendingItems.createPendingItem' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (resource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (item of resource.value().data; track item.id) {
            <app-mobile-card
              [title]="item.title"
              [status]="item.status"
              [statusType]="$any('pendingItemStatus')"
              [fields]="getPendingItemFields(item)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(item)"
              [onDelete]="onDeleteSwipe(item)"
            >
              <button mat-icon-button (click)="openEditDialog(item); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteItem(item); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
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
            <ng-container matColumnDef="title">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'pendingItems.titleColumn' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let item"
                class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ item.title }}
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'pendingItems.type' | translate }}
              </th>
              <td mat-cell *matCellDef="let item" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {{ getTypeLabel(item.type) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'pendingItems.priority' | translate }}
              </th>
              <td mat-cell *matCellDef="let item" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class]="getPriorityColor(item.priority)"
                >
                  {{ getPriorityLabel(item.priority) }}
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
              <td mat-cell *matCellDef="let item" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [class]="getStatusColor(item.status)"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="dueDate">
              <th
                mat-header-cell
                mat-sort-header
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'pendingItems.dueDate' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let item"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ item.dueDate | relativeDate }}
              </td>
            </ng-container>

            <ng-container matColumnDef="assignedTo">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {{ 'pendingItems.assignedTo' | translate }}
              </th>
              <td
                mat-cell
                *matCellDef="let item"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ item.assignedTo?.name || '-' }}
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
                *matCellDef="let item"
                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ item.createdAt | relativeDate }}
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
              <td mat-cell *matCellDef="let item" class="px-4 py-3 text-right">
                <button
                  mat-icon-button
                  (click)="openEditDialog(item); $event.stopPropagation()"
                  [title]="'common.edit' | translate"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteItem(item); $event.stopPropagation()"
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
export class PendingItemsListComponent implements OnInit {
  private readonly pendingItemsService = inject(PendingItemsService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly _routeHighlight = signal<string | null>(null);
  private readonly _clearHighlight = signal(stryMutAct_9fa48("3313") ? true : (stryCov_9fa48("3313"), false));
  readonly fromNotification = signal(stryMutAct_9fa48("3314") ? true : (stryCov_9fa48("3314"), false));
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal(stryMutAct_9fa48("3315") ? "" : (stryCov_9fa48("3315"), 'dueDate'));
  readonly sortOrder = signal<'ASC' | 'DESC'>(stryMutAct_9fa48("3316") ? "" : (stryCov_9fa48("3316"), 'ASC'));
  readonly statusFilter = signal(stryMutAct_9fa48("3317") ? "Stryker was here!" : (stryCov_9fa48("3317"), ''));
  readonly priorityFilter = signal(stryMutAct_9fa48("3318") ? "Stryker was here!" : (stryCov_9fa48("3318"), ''));
  readonly searchFilter = signal(stryMutAct_9fa48("3319") ? "Stryker was here!" : (stryCov_9fa48("3319"), ''));
  readonly dueDateFrom = signal(stryMutAct_9fa48("3320") ? "Stryker was here!" : (stryCov_9fa48("3320"), ''));
  readonly dueDateTo = signal(stryMutAct_9fa48("3321") ? "Stryker was here!" : (stryCov_9fa48("3321"), ''));
  readonly dueDateFromValue = computed(stryMutAct_9fa48("3322") ? () => undefined : (stryCov_9fa48("3322"), () => this.dueDateFrom() ? new Date(this.dueDateFrom()) : null));
  readonly dueDateToValue = computed(stryMutAct_9fa48("3323") ? () => undefined : (stryCov_9fa48("3323"), () => this.dueDateTo() ? new Date(this.dueDateTo()) : null));
  readonly resource = httpResource<PaginatedResponse<PendingItem>>(stryMutAct_9fa48("3324") ? () => undefined : (stryCov_9fa48("3324"), () => stryMutAct_9fa48("3325") ? {} : (stryCov_9fa48("3325"), {
    url: stryMutAct_9fa48("3326") ? "" : (stryCov_9fa48("3326"), '/api/pending-items'),
    params: stryMutAct_9fa48("3327") ? {} : (stryCov_9fa48("3327"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: this.sortOrder(),
      ...(this.statusFilter() ? stryMutAct_9fa48("3328") ? {} : (stryCov_9fa48("3328"), {
        status: this.statusFilter()
      }) : {}),
      ...(this.priorityFilter() ? stryMutAct_9fa48("3329") ? {} : (stryCov_9fa48("3329"), {
        priority: this.priorityFilter()
      }) : {}),
      ...(this.searchFilter() ? stryMutAct_9fa48("3330") ? {} : (stryCov_9fa48("3330"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.dueDateFrom() ? stryMutAct_9fa48("3331") ? {} : (stryCov_9fa48("3331"), {
        dueDateFrom: this.dueDateFrom()
      }) : {}),
      ...(this.dueDateTo() ? stryMutAct_9fa48("3332") ? {} : (stryCov_9fa48("3332"), {
        dueDateTo: this.dueDateTo()
      }) : {})
    })
  })));
  readonly highlightedId = computed(() => {
    if (stryMutAct_9fa48("3333")) {
      {}
    } else {
      stryCov_9fa48("3333");
      const data = this.resource.value();
      const search = this.searchFilter();
      const fromNotif = this.fromNotification();
      const loading = this.resource.isLoading();
      const cleared = this._clearHighlight();
      const routeHighlight = this._routeHighlight();
      if (stryMutAct_9fa48("3336") ? (!data || cleared) && loading : stryMutAct_9fa48("3335") ? false : stryMutAct_9fa48("3334") ? true : (stryCov_9fa48("3334", "3335", "3336"), (stryMutAct_9fa48("3338") ? !data && cleared : stryMutAct_9fa48("3337") ? false : (stryCov_9fa48("3337", "3338"), (stryMutAct_9fa48("3339") ? data : (stryCov_9fa48("3339"), !data)) || cleared)) || loading)) return null;
      if (stryMutAct_9fa48("3342") ? fromNotif || search : stryMutAct_9fa48("3341") ? false : stryMutAct_9fa48("3340") ? true : (stryCov_9fa48("3340", "3341", "3342"), fromNotif && search)) {
        if (stryMutAct_9fa48("3343")) {
          {}
        } else {
          stryCov_9fa48("3343");
          const match = data.data.find(stryMutAct_9fa48("3344") ? () => undefined : (stryCov_9fa48("3344"), row => stryMutAct_9fa48("3347") ? (row.title === search || row.title.startsWith(search)) && row.id === search : stryMutAct_9fa48("3346") ? false : stryMutAct_9fa48("3345") ? true : (stryCov_9fa48("3345", "3346", "3347"), (stryMutAct_9fa48("3349") ? row.title === search && row.title.startsWith(search) : stryMutAct_9fa48("3348") ? false : (stryCov_9fa48("3348", "3349"), (stryMutAct_9fa48("3351") ? row.title !== search : stryMutAct_9fa48("3350") ? false : (stryCov_9fa48("3350", "3351"), row.title === search)) || (stryMutAct_9fa48("3352") ? row.title.endsWith(search) : (stryCov_9fa48("3352"), row.title.startsWith(search))))) || (stryMutAct_9fa48("3354") ? row.id !== search : stryMutAct_9fa48("3353") ? false : (stryCov_9fa48("3353", "3354"), row.id === search)))));
          return stryMutAct_9fa48("3355") ? match?.id && null : (stryCov_9fa48("3355"), (stryMutAct_9fa48("3356") ? match.id : (stryCov_9fa48("3356"), match?.id)) ?? null);
        }
      }
      if (stryMutAct_9fa48("3359") ? routeHighlight || !fromNotif : stryMutAct_9fa48("3358") ? false : stryMutAct_9fa48("3357") ? true : (stryCov_9fa48("3357", "3358", "3359"), routeHighlight && (stryMutAct_9fa48("3360") ? fromNotif : (stryCov_9fa48("3360"), !fromNotif)))) {
        if (stryMutAct_9fa48("3361")) {
          {}
        } else {
          stryCov_9fa48("3361");
          const match = data.data.find(stryMutAct_9fa48("3362") ? () => undefined : (stryCov_9fa48("3362"), row => stryMutAct_9fa48("3365") ? row.id !== routeHighlight : stryMutAct_9fa48("3364") ? false : stryMutAct_9fa48("3363") ? true : (stryCov_9fa48("3363", "3364", "3365"), row.id === routeHighlight)));
          return stryMutAct_9fa48("3366") ? match?.id && null : (stryCov_9fa48("3366"), (stryMutAct_9fa48("3367") ? match.id : (stryCov_9fa48("3367"), match?.id)) ?? null);
        }
      }
      return null;
    }
  });
  displayedColumns = stryMutAct_9fa48("3368") ? [] : (stryCov_9fa48("3368"), [stryMutAct_9fa48("3369") ? "" : (stryCov_9fa48("3369"), 'title'), stryMutAct_9fa48("3370") ? "" : (stryCov_9fa48("3370"), 'type'), stryMutAct_9fa48("3371") ? "" : (stryCov_9fa48("3371"), 'priority'), stryMutAct_9fa48("3372") ? "" : (stryCov_9fa48("3372"), 'status'), stryMutAct_9fa48("3373") ? "" : (stryCov_9fa48("3373"), 'dueDate'), stryMutAct_9fa48("3374") ? "" : (stryCov_9fa48("3374"), 'assignedTo'), stryMutAct_9fa48("3375") ? "" : (stryCov_9fa48("3375"), 'createdAt'), stryMutAct_9fa48("3376") ? "" : (stryCov_9fa48("3376"), 'actions')]);
  ngOnInit(): void {
    if (stryMutAct_9fa48("3377")) {
      {}
    } else {
      stryCov_9fa48("3377");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("3378") ? "" : (stryCov_9fa48("3378"), 'highlight'));
      const fromNotification = stryMutAct_9fa48("3381") ? this.route.snapshot.queryParamMap.get('fromNotification') !== 'true' : stryMutAct_9fa48("3380") ? false : stryMutAct_9fa48("3379") ? true : (stryCov_9fa48("3379", "3380", "3381"), this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("3382") ? "" : (stryCov_9fa48("3382"), 'fromNotification')) === (stryMutAct_9fa48("3383") ? "" : (stryCov_9fa48("3383"), 'true')));
      const searchQuery = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("3384") ? "" : (stryCov_9fa48("3384"), 'search'));
      this.fromNotification.set(fromNotification);
      if (stryMutAct_9fa48("3387") ? fromNotification || !searchQuery : stryMutAct_9fa48("3386") ? false : stryMutAct_9fa48("3385") ? true : (stryCov_9fa48("3385", "3386", "3387"), fromNotification && (stryMutAct_9fa48("3388") ? searchQuery : (stryCov_9fa48("3388"), !searchQuery)))) {
        if (stryMutAct_9fa48("3389")) {
          {}
        } else {
          stryCov_9fa48("3389");
          this.pageSize.set(100);
        }
      } else if (stryMutAct_9fa48("3392") ? highlightId || !fromNotification : stryMutAct_9fa48("3391") ? false : stryMutAct_9fa48("3390") ? true : (stryCov_9fa48("3390", "3391", "3392"), highlightId && (stryMutAct_9fa48("3393") ? fromNotification : (stryCov_9fa48("3393"), !fromNotification)))) {
        if (stryMutAct_9fa48("3394")) {
          {}
        } else {
          stryCov_9fa48("3394");
          this._routeHighlight.set(highlightId);
          this.pageSize.set(50);
          setTimeout(stryMutAct_9fa48("3395") ? () => undefined : (stryCov_9fa48("3395"), () => this._clearHighlight.set(stryMutAct_9fa48("3396") ? false : (stryCov_9fa48("3396"), true))), 3000);
        }
      }
      if (stryMutAct_9fa48("3398") ? false : stryMutAct_9fa48("3397") ? true : (stryCov_9fa48("3397", "3398"), searchQuery)) {
        if (stryMutAct_9fa48("3399")) {
          {}
        } else {
          stryCov_9fa48("3399");
          this.searchFilter.set(searchQuery);
        }
      }
    }
  }
  getPriorityLabel(priority: string): string {
    if (stryMutAct_9fa48("3400")) {
      {}
    } else {
      stryCov_9fa48("3400");
      return stryMutAct_9fa48("3403") ? PRIORITY_LABELS[priority] && priority : stryMutAct_9fa48("3402") ? false : stryMutAct_9fa48("3401") ? true : (stryCov_9fa48("3401", "3402", "3403"), PRIORITY_LABELS[priority] || priority);
    }
  }
  getPriorityColor(priority: string): string {
    if (stryMutAct_9fa48("3404")) {
      {}
    } else {
      stryCov_9fa48("3404");
      return stryMutAct_9fa48("3407") ? PRIORITY_COLORS[priority] && 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700' : stryMutAct_9fa48("3406") ? false : stryMutAct_9fa48("3405") ? true : (stryCov_9fa48("3405", "3406", "3407"), PRIORITY_COLORS[priority] || (stryMutAct_9fa48("3408") ? "" : (stryCov_9fa48("3408"), 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700')));
    }
  }
  getStatusLabel(status: string): string {
    if (stryMutAct_9fa48("3409")) {
      {}
    } else {
      stryCov_9fa48("3409");
      return stryMutAct_9fa48("3412") ? STATUS_LABELS[status] && status : stryMutAct_9fa48("3411") ? false : stryMutAct_9fa48("3410") ? true : (stryCov_9fa48("3410", "3411", "3412"), STATUS_LABELS[status] || status);
    }
  }
  getStatusColor(status: string): string {
    if (stryMutAct_9fa48("3413")) {
      {}
    } else {
      stryCov_9fa48("3413");
      return stryMutAct_9fa48("3416") ? STATUS_COLORS[status] && 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700' : stryMutAct_9fa48("3415") ? false : stryMutAct_9fa48("3414") ? true : (stryCov_9fa48("3414", "3415", "3416"), STATUS_COLORS[status] || (stryMutAct_9fa48("3417") ? "" : (stryCov_9fa48("3417"), 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700')));
    }
  }
  getTypeLabel(type: string): string {
    if (stryMutAct_9fa48("3418")) {
      {}
    } else {
      stryCov_9fa48("3418");
      return stryMutAct_9fa48("3421") ? TYPE_LABELS[type] && type : stryMutAct_9fa48("3420") ? false : stryMutAct_9fa48("3419") ? true : (stryCov_9fa48("3419", "3420", "3421"), TYPE_LABELS[type] || type);
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("3422")) {
      {}
    } else {
      stryCov_9fa48("3422");
      this.currentPage.set(stryMutAct_9fa48("3423") ? event.pageIndex - 1 : (stryCov_9fa48("3423"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("3424")) {
      {}
    } else {
      stryCov_9fa48("3424");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc').toUpperCase() as 'ASC' | 'DESC');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("3425")) {
      {}
    } else {
      stryCov_9fa48("3425");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDueDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("3426")) {
      {}
    } else {
      stryCov_9fa48("3426");
      const date = event.value;
      if (stryMutAct_9fa48("3428") ? false : stryMutAct_9fa48("3427") ? true : (stryCov_9fa48("3427", "3428"), date)) {
        if (stryMutAct_9fa48("3429")) {
          {}
        } else {
          stryCov_9fa48("3429");
          this.dueDateFrom.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("3430")) {
          {}
        } else {
          stryCov_9fa48("3430");
          this.dueDateFrom.set(stryMutAct_9fa48("3431") ? "Stryker was here!" : (stryCov_9fa48("3431"), ''));
        }
      }
    }
  }
  onDueDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("3432")) {
      {}
    } else {
      stryCov_9fa48("3432");
      const date = event.value;
      if (stryMutAct_9fa48("3434") ? false : stryMutAct_9fa48("3433") ? true : (stryCov_9fa48("3433", "3434"), date)) {
        if (stryMutAct_9fa48("3435")) {
          {}
        } else {
          stryCov_9fa48("3435");
          this.dueDateTo.set(toLocalDateString(date));
        }
      } else {
        if (stryMutAct_9fa48("3436")) {
          {}
        } else {
          stryCov_9fa48("3436");
          this.dueDateTo.set(stryMutAct_9fa48("3437") ? "Stryker was here!" : (stryCov_9fa48("3437"), ''));
        }
      }
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("3438")) {
      {}
    } else {
      stryCov_9fa48("3438");
      return stryMutAct_9fa48("3441") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.priorityFilter() !== '' || this.dueDateFrom() !== '' || this.dueDateTo() !== '') && this.fromNotification() : stryMutAct_9fa48("3440") ? false : stryMutAct_9fa48("3439") ? true : (stryCov_9fa48("3439", "3440", "3441"), (stryMutAct_9fa48("3443") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.priorityFilter() !== '' || this.dueDateFrom() !== '') && this.dueDateTo() !== '' : stryMutAct_9fa48("3442") ? false : (stryCov_9fa48("3442", "3443"), (stryMutAct_9fa48("3445") ? (this.searchFilter() !== '' || this.statusFilter() !== '' || this.priorityFilter() !== '') && this.dueDateFrom() !== '' : stryMutAct_9fa48("3444") ? false : (stryCov_9fa48("3444", "3445"), (stryMutAct_9fa48("3447") ? (this.searchFilter() !== '' || this.statusFilter() !== '') && this.priorityFilter() !== '' : stryMutAct_9fa48("3446") ? false : (stryCov_9fa48("3446", "3447"), (stryMutAct_9fa48("3449") ? this.searchFilter() !== '' && this.statusFilter() !== '' : stryMutAct_9fa48("3448") ? false : (stryCov_9fa48("3448", "3449"), (stryMutAct_9fa48("3451") ? this.searchFilter() === '' : stryMutAct_9fa48("3450") ? false : (stryCov_9fa48("3450", "3451"), this.searchFilter() !== (stryMutAct_9fa48("3452") ? "Stryker was here!" : (stryCov_9fa48("3452"), '')))) || (stryMutAct_9fa48("3454") ? this.statusFilter() === '' : stryMutAct_9fa48("3453") ? false : (stryCov_9fa48("3453", "3454"), this.statusFilter() !== (stryMutAct_9fa48("3455") ? "Stryker was here!" : (stryCov_9fa48("3455"), '')))))) || (stryMutAct_9fa48("3457") ? this.priorityFilter() === '' : stryMutAct_9fa48("3456") ? false : (stryCov_9fa48("3456", "3457"), this.priorityFilter() !== (stryMutAct_9fa48("3458") ? "Stryker was here!" : (stryCov_9fa48("3458"), '')))))) || (stryMutAct_9fa48("3460") ? this.dueDateFrom() === '' : stryMutAct_9fa48("3459") ? false : (stryCov_9fa48("3459", "3460"), this.dueDateFrom() !== (stryMutAct_9fa48("3461") ? "Stryker was here!" : (stryCov_9fa48("3461"), '')))))) || (stryMutAct_9fa48("3463") ? this.dueDateTo() === '' : stryMutAct_9fa48("3462") ? false : (stryCov_9fa48("3462", "3463"), this.dueDateTo() !== (stryMutAct_9fa48("3464") ? "Stryker was here!" : (stryCov_9fa48("3464"), '')))))) || this.fromNotification());
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("3465")) {
      {}
    } else {
      stryCov_9fa48("3465");
      this.searchFilter.set(stryMutAct_9fa48("3466") ? "Stryker was here!" : (stryCov_9fa48("3466"), ''));
      this.statusFilter.set(stryMutAct_9fa48("3467") ? "Stryker was here!" : (stryCov_9fa48("3467"), ''));
      this.priorityFilter.set(stryMutAct_9fa48("3468") ? "Stryker was here!" : (stryCov_9fa48("3468"), ''));
      this.dueDateFrom.set(stryMutAct_9fa48("3469") ? "Stryker was here!" : (stryCov_9fa48("3469"), ''));
      this.dueDateTo.set(stryMutAct_9fa48("3470") ? "Stryker was here!" : (stryCov_9fa48("3470"), ''));
      this._clearHighlight.set(stryMutAct_9fa48("3471") ? false : (stryCov_9fa48("3471"), true));
      this._routeHighlight.set(null);
      this.fromNotification.set(stryMutAct_9fa48("3472") ? true : (stryCov_9fa48("3472"), false));
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("3473")) {
      {}
    } else {
      stryCov_9fa48("3473");
      const dialogRef = this.dialog.open(PendingItemFormComponent, stryMutAct_9fa48("3474") ? {} : (stryCov_9fa48("3474"), {
        width: stryMutAct_9fa48("3475") ? "" : (stryCov_9fa48("3475"), '600px'),
        data: stryMutAct_9fa48("3476") ? {} : (stryCov_9fa48("3476"), {
          mode: stryMutAct_9fa48("3477") ? "" : (stryCov_9fa48("3477"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("3478")) {
          {}
        } else {
          stryCov_9fa48("3478");
          if (stryMutAct_9fa48("3480") ? false : stryMutAct_9fa48("3479") ? true : (stryCov_9fa48("3479", "3480"), result)) this.resource.reload();
        }
      });
    }
  }
  openEditDialog(item: PendingItem): void {
    if (stryMutAct_9fa48("3481")) {
      {}
    } else {
      stryCov_9fa48("3481");
      const dialogRef = this.dialog.open(PendingItemFormComponent, stryMutAct_9fa48("3482") ? {} : (stryCov_9fa48("3482"), {
        width: stryMutAct_9fa48("3483") ? "" : (stryCov_9fa48("3483"), '600px'),
        data: stryMutAct_9fa48("3484") ? {} : (stryCov_9fa48("3484"), {
          mode: stryMutAct_9fa48("3485") ? "" : (stryCov_9fa48("3485"), 'edit'),
          item
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("3486")) {
          {}
        } else {
          stryCov_9fa48("3486");
          if (stryMutAct_9fa48("3488") ? false : stryMutAct_9fa48("3487") ? true : (stryCov_9fa48("3487", "3488"), result)) this.resource.reload();
        }
      });
    }
  }
  getPendingItemFields(item: PendingItem): MobileCardField[] {
    if (stryMutAct_9fa48("3489")) {
      {}
    } else {
      stryCov_9fa48("3489");
      return stryMutAct_9fa48("3490") ? [] : (stryCov_9fa48("3490"), [stryMutAct_9fa48("3491") ? {} : (stryCov_9fa48("3491"), {
        label: this.translationService.instant(stryMutAct_9fa48("3492") ? "" : (stryCov_9fa48("3492"), 'pendingItems.type')),
        value: this.getTypeLabel(item.type)
      }), stryMutAct_9fa48("3493") ? {} : (stryCov_9fa48("3493"), {
        label: this.translationService.instant(stryMutAct_9fa48("3494") ? "" : (stryCov_9fa48("3494"), 'pendingItems.priority')),
        value: this.getPriorityLabel(item.priority)
      }), stryMutAct_9fa48("3495") ? {} : (stryCov_9fa48("3495"), {
        label: this.translationService.instant(stryMutAct_9fa48("3496") ? "" : (stryCov_9fa48("3496"), 'pendingItems.dueDate')),
        value: stryMutAct_9fa48("3499") ? item.dueDate && '-' : stryMutAct_9fa48("3498") ? false : stryMutAct_9fa48("3497") ? true : (stryCov_9fa48("3497", "3498", "3499"), item.dueDate || (stryMutAct_9fa48("3500") ? "" : (stryCov_9fa48("3500"), '-'))),
        type: stryMutAct_9fa48("3501") ? "" : (stryCov_9fa48("3501"), 'date')
      }), stryMutAct_9fa48("3502") ? {} : (stryCov_9fa48("3502"), {
        label: this.translationService.instant(stryMutAct_9fa48("3503") ? "" : (stryCov_9fa48("3503"), 'pendingItems.assignedTo')),
        value: stryMutAct_9fa48("3506") ? item.assignedTo?.name && '-' : stryMutAct_9fa48("3505") ? false : stryMutAct_9fa48("3504") ? true : (stryCov_9fa48("3504", "3505", "3506"), (stryMutAct_9fa48("3507") ? item.assignedTo.name : (stryCov_9fa48("3507"), item.assignedTo?.name)) || (stryMutAct_9fa48("3508") ? "" : (stryCov_9fa48("3508"), '-')))
      }), stryMutAct_9fa48("3509") ? {} : (stryCov_9fa48("3509"), {
        label: this.translationService.instant(stryMutAct_9fa48("3510") ? "" : (stryCov_9fa48("3510"), 'common.created')),
        value: item.createdAt,
        type: stryMutAct_9fa48("3511") ? "" : (stryCov_9fa48("3511"), 'date')
      })]);
    }
  }
  deleteItem(item: PendingItem): void {
    if (stryMutAct_9fa48("3512")) {
      {}
    } else {
      stryCov_9fa48("3512");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("3513") ? {} : (stryCov_9fa48("3513"), {
        width: stryMutAct_9fa48("3514") ? "" : (stryCov_9fa48("3514"), '400px'),
        data: stryMutAct_9fa48("3515") ? {} : (stryCov_9fa48("3515"), {
          title: stryMutAct_9fa48("3516") ? "" : (stryCov_9fa48("3516"), 'Eliminar pendiente'),
          message: stryMutAct_9fa48("3517") ? `` : (stryCov_9fa48("3517"), `¿Estás seguro de eliminar "${item.title}"?`),
          confirmLabel: stryMutAct_9fa48("3518") ? "" : (stryCov_9fa48("3518"), 'Eliminar'),
          color: stryMutAct_9fa48("3519") ? "" : (stryCov_9fa48("3519"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("3520")) {
          {}
        } else {
          stryCov_9fa48("3520");
          if (stryMutAct_9fa48("3522") ? false : stryMutAct_9fa48("3521") ? true : (stryCov_9fa48("3521", "3522"), confirmed)) {
            if (stryMutAct_9fa48("3523")) {
              {}
            } else {
              stryCov_9fa48("3523");
              this.pendingItemsService.delete(item.id).subscribe(stryMutAct_9fa48("3524") ? {} : (stryCov_9fa48("3524"), {
                next: () => {
                  if (stryMutAct_9fa48("3525")) {
                    {}
                  } else {
                    stryCov_9fa48("3525");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("3526") ? "" : (stryCov_9fa48("3526"), 'common.toast.deleted')), stryMutAct_9fa48("3527") ? "" : (stryCov_9fa48("3527"), 'success'));
                    this.resource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("3528")) {
                    {}
                  } else {
                    stryCov_9fa48("3528");
                    const msg = Array.isArray(stryMutAct_9fa48("3529") ? err.error.message : (stryCov_9fa48("3529"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("3530") ? "" : (stryCov_9fa48("3530"), ', ')) : stryMutAct_9fa48("3533") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("3532") ? false : stryMutAct_9fa48("3531") ? true : (stryCov_9fa48("3531", "3532", "3533"), (stryMutAct_9fa48("3534") ? err.error.message : (stryCov_9fa48("3534"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("3535") ? "" : (stryCov_9fa48("3535"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("3536") ? "" : (stryCov_9fa48("3536"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  onEditSwipe(item: PendingItem): (event: Event) => void {
    if (stryMutAct_9fa48("3537")) {
      {}
    } else {
      stryCov_9fa48("3537");
      return stryMutAct_9fa48("3538") ? () => undefined : (stryCov_9fa48("3538"), (_event: Event) => this.openEditDialog(item));
    }
  }
  onDeleteSwipe(item: PendingItem): (event: Event) => void {
    if (stryMutAct_9fa48("3539")) {
      {}
    } else {
      stryCov_9fa48("3539");
      return stryMutAct_9fa48("3540") ? () => undefined : (stryCov_9fa48("3540"), (_event: Event) => this.deleteItem(item));
    }
  }
}