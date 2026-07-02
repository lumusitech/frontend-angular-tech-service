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
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
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
  `
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
  readonly sortBy = signal(stryMutAct_9fa48("4213") ? "" : (stryCov_9fa48("4213"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("4214") ? "" : (stryCov_9fa48("4214"), 'desc'));
  readonly searchFilter = signal(stryMutAct_9fa48("4215") ? "Stryker was here!" : (stryCov_9fa48("4215"), ''));
  readonly isActiveFilter = signal<'true' | 'false' | ''>(stryMutAct_9fa48("4216") ? "Stryker was here!" : (stryCov_9fa48("4216"), ''));
  readonly dateFrom = signal(stryMutAct_9fa48("4217") ? "Stryker was here!" : (stryCov_9fa48("4217"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("4218") ? "Stryker was here!" : (stryCov_9fa48("4218"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("4219") ? () => undefined : (stryCov_9fa48("4219"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("4220") ? () => undefined : (stryCov_9fa48("4220"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly serviceTypesResource = httpResource<PaginatedResponse<ServiceType>>(stryMutAct_9fa48("4221") ? () => undefined : (stryCov_9fa48("4221"), () => stryMutAct_9fa48("4222") ? {} : (stryCov_9fa48("4222"), {
    url: stryMutAct_9fa48("4223") ? "" : (stryCov_9fa48("4223"), '/api/service-types'),
    params: stryMutAct_9fa48("4224") ? {} : (stryCov_9fa48("4224"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("4225") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("4225"), this.sortOrder().toUpperCase()),
      ...(this.searchFilter() ? stryMutAct_9fa48("4226") ? {} : (stryCov_9fa48("4226"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.isActiveFilter() ? stryMutAct_9fa48("4227") ? {} : (stryCov_9fa48("4227"), {
        isActive: stryMutAct_9fa48("4230") ? this.isActiveFilter() !== 'true' : stryMutAct_9fa48("4229") ? false : stryMutAct_9fa48("4228") ? true : (stryCov_9fa48("4228", "4229", "4230"), this.isActiveFilter() === (stryMutAct_9fa48("4231") ? "" : (stryCov_9fa48("4231"), 'true')))
      }) : {}),
      ...(this.dateFrom() ? stryMutAct_9fa48("4232") ? {} : (stryCov_9fa48("4232"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("4233") ? {} : (stryCov_9fa48("4233"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("4234") ? [] : (stryCov_9fa48("4234"), [stryMutAct_9fa48("4235") ? "" : (stryCov_9fa48("4235"), 'name'), stryMutAct_9fa48("4236") ? "" : (stryCov_9fa48("4236"), 'description'), stryMutAct_9fa48("4237") ? "" : (stryCov_9fa48("4237"), 'estimatedDuration'), stryMutAct_9fa48("4238") ? "" : (stryCov_9fa48("4238"), 'isActive'), stryMutAct_9fa48("4239") ? "" : (stryCov_9fa48("4239"), 'createdAt'), stryMutAct_9fa48("4240") ? "" : (stryCov_9fa48("4240"), 'actions')]);
  ngOnInit(): void {
    if (stryMutAct_9fa48("4241")) {
      {}
    } else {
      stryCov_9fa48("4241");
      const highlightId = this.route.snapshot.queryParamMap.get(stryMutAct_9fa48("4242") ? "" : (stryCov_9fa48("4242"), 'highlight'));
      if (stryMutAct_9fa48("4244") ? false : stryMutAct_9fa48("4243") ? true : (stryCov_9fa48("4243", "4244"), highlightId)) {
        if (stryMutAct_9fa48("4245")) {
          {}
        } else {
          stryCov_9fa48("4245");
          this.highlightedId.set(highlightId);
          setTimeout(stryMutAct_9fa48("4246") ? () => undefined : (stryCov_9fa48("4246"), () => this.highlightedId.set(null)), 3000);
        }
      }
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("4247")) {
      {}
    } else {
      stryCov_9fa48("4247");
      this.currentPage.set(stryMutAct_9fa48("4248") ? event.pageIndex - 1 : (stryCov_9fa48("4248"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("4249")) {
      {}
    } else {
      stryCov_9fa48("4249");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("4250")) {
      {}
    } else {
      stryCov_9fa48("4250");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("4251")) {
      {}
    } else {
      stryCov_9fa48("4251");
      const date = event.value;
      this.dateFrom.set(date ? toLocalDateString(date) : stryMutAct_9fa48("4252") ? "Stryker was here!" : (stryCov_9fa48("4252"), ''));
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("4253")) {
      {}
    } else {
      stryCov_9fa48("4253");
      const date = event.value;
      this.dateTo.set(date ? toLocalDateString(date) : stryMutAct_9fa48("4254") ? "Stryker was here!" : (stryCov_9fa48("4254"), ''));
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("4255")) {
      {}
    } else {
      stryCov_9fa48("4255");
      const dialogRef = this.dialog.open(ServiceTypeFormComponent, stryMutAct_9fa48("4256") ? {} : (stryCov_9fa48("4256"), {
        width: stryMutAct_9fa48("4257") ? "" : (stryCov_9fa48("4257"), '600px'),
        data: stryMutAct_9fa48("4258") ? {} : (stryCov_9fa48("4258"), {
          mode: stryMutAct_9fa48("4259") ? "" : (stryCov_9fa48("4259"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("4260")) {
          {}
        } else {
          stryCov_9fa48("4260");
          if (stryMutAct_9fa48("4262") ? false : stryMutAct_9fa48("4261") ? true : (stryCov_9fa48("4261", "4262"), result)) this.serviceTypesResource.reload();
        }
      });
    }
  }
  openEditDialog(serviceType: ServiceType): void {
    if (stryMutAct_9fa48("4263")) {
      {}
    } else {
      stryCov_9fa48("4263");
      const dialogRef = this.dialog.open(ServiceTypeFormComponent, stryMutAct_9fa48("4264") ? {} : (stryCov_9fa48("4264"), {
        width: stryMutAct_9fa48("4265") ? "" : (stryCov_9fa48("4265"), '600px'),
        data: stryMutAct_9fa48("4266") ? {} : (stryCov_9fa48("4266"), {
          mode: stryMutAct_9fa48("4267") ? "" : (stryCov_9fa48("4267"), 'edit'),
          serviceType
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("4268")) {
          {}
        } else {
          stryCov_9fa48("4268");
          if (stryMutAct_9fa48("4270") ? false : stryMutAct_9fa48("4269") ? true : (stryCov_9fa48("4269", "4270"), result)) this.serviceTypesResource.reload();
        }
      });
    }
  }
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("4271")) {
      {}
    } else {
      stryCov_9fa48("4271");
      return stryMutAct_9fa48("4274") ? (this.searchFilter() !== '' || this.isActiveFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("4273") ? false : stryMutAct_9fa48("4272") ? true : (stryCov_9fa48("4272", "4273", "4274"), (stryMutAct_9fa48("4276") ? (this.searchFilter() !== '' || this.isActiveFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("4275") ? false : (stryCov_9fa48("4275", "4276"), (stryMutAct_9fa48("4278") ? this.searchFilter() !== '' && this.isActiveFilter() !== '' : stryMutAct_9fa48("4277") ? false : (stryCov_9fa48("4277", "4278"), (stryMutAct_9fa48("4280") ? this.searchFilter() === '' : stryMutAct_9fa48("4279") ? false : (stryCov_9fa48("4279", "4280"), this.searchFilter() !== (stryMutAct_9fa48("4281") ? "Stryker was here!" : (stryCov_9fa48("4281"), '')))) || (stryMutAct_9fa48("4283") ? this.isActiveFilter() === '' : stryMutAct_9fa48("4282") ? false : (stryCov_9fa48("4282", "4283"), this.isActiveFilter() !== (stryMutAct_9fa48("4284") ? "Stryker was here!" : (stryCov_9fa48("4284"), '')))))) || (stryMutAct_9fa48("4286") ? this.dateFrom() === '' : stryMutAct_9fa48("4285") ? false : (stryCov_9fa48("4285", "4286"), this.dateFrom() !== (stryMutAct_9fa48("4287") ? "Stryker was here!" : (stryCov_9fa48("4287"), '')))))) || (stryMutAct_9fa48("4289") ? this.dateTo() === '' : stryMutAct_9fa48("4288") ? false : (stryCov_9fa48("4288", "4289"), this.dateTo() !== (stryMutAct_9fa48("4290") ? "Stryker was here!" : (stryCov_9fa48("4290"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("4291")) {
      {}
    } else {
      stryCov_9fa48("4291");
      this.searchFilter.set(stryMutAct_9fa48("4292") ? "Stryker was here!" : (stryCov_9fa48("4292"), ''));
      this.isActiveFilter.set(stryMutAct_9fa48("4293") ? "Stryker was here!" : (stryCov_9fa48("4293"), ''));
      this.dateFrom.set(stryMutAct_9fa48("4294") ? "Stryker was here!" : (stryCov_9fa48("4294"), ''));
      this.dateTo.set(stryMutAct_9fa48("4295") ? "Stryker was here!" : (stryCov_9fa48("4295"), ''));
    }
  }
  getServiceTypeFields(serviceType: ServiceType): MobileCardField[] {
    if (stryMutAct_9fa48("4296")) {
      {}
    } else {
      stryCov_9fa48("4296");
      return stryMutAct_9fa48("4297") ? [] : (stryCov_9fa48("4297"), [stryMutAct_9fa48("4298") ? {} : (stryCov_9fa48("4298"), {
        label: this.translationService.instant(stryMutAct_9fa48("4299") ? "" : (stryCov_9fa48("4299"), 'serviceTypes.description')),
        value: stryMutAct_9fa48("4302") ? serviceType.description && '-' : stryMutAct_9fa48("4301") ? false : stryMutAct_9fa48("4300") ? true : (stryCov_9fa48("4300", "4301", "4302"), serviceType.description || (stryMutAct_9fa48("4303") ? "" : (stryCov_9fa48("4303"), '-')))
      }), stryMutAct_9fa48("4304") ? {} : (stryCov_9fa48("4304"), {
        label: this.translationService.instant(stryMutAct_9fa48("4305") ? "" : (stryCov_9fa48("4305"), 'serviceTypes.estimatedDuration')),
        value: serviceType.estimatedDuration ? stryMutAct_9fa48("4306") ? `` : (stryCov_9fa48("4306"), `${serviceType.estimatedDuration} min`) : stryMutAct_9fa48("4307") ? "" : (stryCov_9fa48("4307"), '-')
      }), stryMutAct_9fa48("4308") ? {} : (stryCov_9fa48("4308"), {
        label: this.translationService.instant(stryMutAct_9fa48("4309") ? "" : (stryCov_9fa48("4309"), 'common.created')),
        value: serviceType.createdAt,
        type: stryMutAct_9fa48("4310") ? "" : (stryCov_9fa48("4310"), 'date')
      })]);
    }
  }
  deleteServiceType(serviceType: ServiceType): void {
    if (stryMutAct_9fa48("4311")) {
      {}
    } else {
      stryCov_9fa48("4311");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("4312") ? {} : (stryCov_9fa48("4312"), {
        width: stryMutAct_9fa48("4313") ? "" : (stryCov_9fa48("4313"), '400px'),
        data: stryMutAct_9fa48("4314") ? {} : (stryCov_9fa48("4314"), {
          title: stryMutAct_9fa48("4315") ? "" : (stryCov_9fa48("4315"), 'Eliminar tipo de servicio'),
          message: stryMutAct_9fa48("4316") ? `` : (stryCov_9fa48("4316"), `¿Estás seguro de eliminar "${serviceType.name}"?`),
          confirmLabel: stryMutAct_9fa48("4317") ? "" : (stryCov_9fa48("4317"), 'Eliminar'),
          color: stryMutAct_9fa48("4318") ? "" : (stryCov_9fa48("4318"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("4319")) {
          {}
        } else {
          stryCov_9fa48("4319");
          if (stryMutAct_9fa48("4321") ? false : stryMutAct_9fa48("4320") ? true : (stryCov_9fa48("4320", "4321"), confirmed)) {
            if (stryMutAct_9fa48("4322")) {
              {}
            } else {
              stryCov_9fa48("4322");
              this.serviceTypesService.delete(serviceType.id).subscribe(stryMutAct_9fa48("4323") ? {} : (stryCov_9fa48("4323"), {
                next: () => {
                  if (stryMutAct_9fa48("4324")) {
                    {}
                  } else {
                    stryCov_9fa48("4324");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("4325") ? "" : (stryCov_9fa48("4325"), 'common.toast.deleted')), stryMutAct_9fa48("4326") ? "" : (stryCov_9fa48("4326"), 'success'));
                    this.serviceTypesResource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("4327")) {
                    {}
                  } else {
                    stryCov_9fa48("4327");
                    const msg = Array.isArray(stryMutAct_9fa48("4328") ? err.error.message : (stryCov_9fa48("4328"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("4329") ? "" : (stryCov_9fa48("4329"), ', ')) : stryMutAct_9fa48("4332") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("4331") ? false : stryMutAct_9fa48("4330") ? true : (stryCov_9fa48("4330", "4331", "4332"), (stryMutAct_9fa48("4333") ? err.error.message : (stryCov_9fa48("4333"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("4334") ? "" : (stryCov_9fa48("4334"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("4335") ? "" : (stryCov_9fa48("4335"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  onEditSwipe(serviceType: ServiceType): (event: Event) => void {
    if (stryMutAct_9fa48("4336")) {
      {}
    } else {
      stryCov_9fa48("4336");
      return stryMutAct_9fa48("4337") ? () => undefined : (stryCov_9fa48("4337"), (_event: Event) => this.openEditDialog(serviceType));
    }
  }
  onDeleteSwipe(serviceType: ServiceType): (event: Event) => void {
    if (stryMutAct_9fa48("4338")) {
      {}
    } else {
      stryCov_9fa48("4338");
      return stryMutAct_9fa48("4339") ? () => undefined : (stryCov_9fa48("4339"), (_event: Event) => this.deleteServiceType(serviceType));
    }
  }
}