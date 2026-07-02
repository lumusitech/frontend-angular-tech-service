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
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { UsersService } from '../../core/services/users.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { User } from '../../core/models/user.interfaces';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatAccordion } from '@angular/material/expansion';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { UserFormComponent } from './user-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
@Component({
  selector: 'app-users-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatChipsModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'users.title' | translate"
        [subtitle]="'users.subtitle' | translate"
        [actionLabel]="'users.newUser' | translate"
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
            <mat-label>{{ 'users.role' | translate }}</mat-label>
            <mat-select [value]="roleFilter()" (selectionChange)="roleFilter.set($event.value)">
              <mat-option value="">{{ 'common.all' | translate }}</mat-option>
              <mat-option value="admin">{{ 'users.roles.admin' | translate }}</mat-option>
              <mat-option value="technician">{{ 'users.roles.technician' | translate }}</mat-option>
              <mat-option value="seller">{{ 'users.roles.seller' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          @if (hasActiveFilters()) {
            <button mat-stroked-button (click)="clearFilters()" class="!text-gray-500 dark:!text-gray-400">
              <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
              {{ 'common.clearFilters' | translate }}
            </button>
          }
        </div>
      </div>

      @if (usersResource.status() === 'loading' && !usersResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (usersResource.error()) {
        <app-error-state (retry)="usersResource.reload()" />
      } @else if (usersResource.hasValue() && usersResource.value().data.length === 0) {
        <app-empty-state
          [title]="'users.noUsers' | translate"
          [message]="'users.noUsersMessage' | translate"
          [actionLabel]="'users.createUser' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (usersResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (user of usersResource.value().data; track user.id) {
            <app-mobile-card
              [title]="user.name"
              [status]="user.isActive ? translationService.instant('common.active') : translationService.instant('common.inactive')"
              [statusType]="$any('activeInactive')"
              [fields]="getUserFields(user)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(user)"
              [onDelete]="onDeleteSwipe(user)"
            >
              <button mat-icon-button (click)="openEditDialog(user); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteUser(user); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
                <mat-icon class="!w-4 !h-4">delete</mat-icon>
              </button>
            </app-mobile-card>
          }
        </mat-accordion>

        <!-- Desktop: Table -->
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table mat-table matSort matSortDisableClear [dataSource]="usersResource.value().data" (matSortChange)="onSortChange($event)" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'users.name' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {{ user.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'users.email' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'users.phone' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {{ user.phone || '—' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'users.role' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3">
                <span [class]="getRoleChipClass(user.role)">
                  {{ ('users.roles.' + user.role) | translate }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="isActive">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'common.status' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3">
                <app-status-badge [value]="user.isActive" type="activeInactive" />
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'common.created' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {{ user.createdAt | relativeDate }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'common.actions' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3 text-right">
                @if (user.role === 'technician') {
                  <button mat-icon-button (click)="viewTechnicianReport(user.id); $event.stopPropagation()" [title]="'users.viewTechnicianReport' | translate">
                    <mat-icon>assessment</mat-icon>
                  </button>
                }
                <button mat-icon-button (click)="openEditDialog(user); $event.stopPropagation()" [title]="'common.edit' | translate">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteUser(user); $event.stopPropagation()" [title]="'common.delete' | translate" color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="openEditDialog(row)" class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"></tr>
          </table>

          <mat-paginator
            [length]="usersResource.value().total"
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
export class UsersListComponent {
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal(stryMutAct_9fa48("5194") ? "" : (stryCov_9fa48("5194"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("5195") ? "" : (stryCov_9fa48("5195"), 'desc'));
  readonly searchFilter = signal(stryMutAct_9fa48("5196") ? "Stryker was here!" : (stryCov_9fa48("5196"), ''));
  readonly roleFilter = signal(stryMutAct_9fa48("5197") ? "Stryker was here!" : (stryCov_9fa48("5197"), ''));
  readonly usersResource = httpResource<PaginatedResponse<User>>(stryMutAct_9fa48("5198") ? () => undefined : (stryCov_9fa48("5198"), () => stryMutAct_9fa48("5199") ? {} : (stryCov_9fa48("5199"), {
    url: stryMutAct_9fa48("5200") ? "" : (stryCov_9fa48("5200"), '/api/users'),
    params: stryMutAct_9fa48("5201") ? {} : (stryCov_9fa48("5201"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("5202") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("5202"), this.sortOrder().toUpperCase()),
      ...(this.roleFilter() ? stryMutAct_9fa48("5203") ? {} : (stryCov_9fa48("5203"), {
        role: this.roleFilter()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("5204") ? [] : (stryCov_9fa48("5204"), [stryMutAct_9fa48("5205") ? "" : (stryCov_9fa48("5205"), 'name'), stryMutAct_9fa48("5206") ? "" : (stryCov_9fa48("5206"), 'email'), stryMutAct_9fa48("5207") ? "" : (stryCov_9fa48("5207"), 'phone'), stryMutAct_9fa48("5208") ? "" : (stryCov_9fa48("5208"), 'role'), stryMutAct_9fa48("5209") ? "" : (stryCov_9fa48("5209"), 'isActive'), stryMutAct_9fa48("5210") ? "" : (stryCov_9fa48("5210"), 'createdAt'), stryMutAct_9fa48("5211") ? "" : (stryCov_9fa48("5211"), 'actions')]);
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("5212")) {
      {}
    } else {
      stryCov_9fa48("5212");
      return stryMutAct_9fa48("5215") ? this.searchFilter() !== '' && this.roleFilter() !== '' : stryMutAct_9fa48("5214") ? false : stryMutAct_9fa48("5213") ? true : (stryCov_9fa48("5213", "5214", "5215"), (stryMutAct_9fa48("5217") ? this.searchFilter() === '' : stryMutAct_9fa48("5216") ? false : (stryCov_9fa48("5216", "5217"), this.searchFilter() !== (stryMutAct_9fa48("5218") ? "Stryker was here!" : (stryCov_9fa48("5218"), '')))) || (stryMutAct_9fa48("5220") ? this.roleFilter() === '' : stryMutAct_9fa48("5219") ? false : (stryCov_9fa48("5219", "5220"), this.roleFilter() !== (stryMutAct_9fa48("5221") ? "Stryker was here!" : (stryCov_9fa48("5221"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("5222")) {
      {}
    } else {
      stryCov_9fa48("5222");
      this.searchFilter.set(stryMutAct_9fa48("5223") ? "Stryker was here!" : (stryCov_9fa48("5223"), ''));
      this.roleFilter.set(stryMutAct_9fa48("5224") ? "Stryker was here!" : (stryCov_9fa48("5224"), ''));
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("5225")) {
      {}
    } else {
      stryCov_9fa48("5225");
      return (event.target as HTMLInputElement).value;
    }
  }
  getRoleChipClass(role: string): string {
    if (stryMutAct_9fa48("5226")) {
      {}
    } else {
      stryCov_9fa48("5226");
      const base = stryMutAct_9fa48("5227") ? "" : (stryCov_9fa48("5227"), 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ');
      switch (role) {
        case stryMutAct_9fa48("5229") ? "" : (stryCov_9fa48("5229"), 'admin'):
          if (stryMutAct_9fa48("5228")) {} else {
            stryCov_9fa48("5228");
            return base + (stryMutAct_9fa48("5230") ? "" : (stryCov_9fa48("5230"), 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'));
          }
        case stryMutAct_9fa48("5232") ? "" : (stryCov_9fa48("5232"), 'technician'):
          if (stryMutAct_9fa48("5231")) {} else {
            stryCov_9fa48("5231");
            return base + (stryMutAct_9fa48("5233") ? "" : (stryCov_9fa48("5233"), 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'));
          }
        case stryMutAct_9fa48("5235") ? "" : (stryCov_9fa48("5235"), 'seller'):
          if (stryMutAct_9fa48("5234")) {} else {
            stryCov_9fa48("5234");
            return base + (stryMutAct_9fa48("5236") ? "" : (stryCov_9fa48("5236"), 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'));
          }
        default:
          if (stryMutAct_9fa48("5237")) {} else {
            stryCov_9fa48("5237");
            return base + (stryMutAct_9fa48("5238") ? "" : (stryCov_9fa48("5238"), 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'));
          }
      }
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("5239")) {
      {}
    } else {
      stryCov_9fa48("5239");
      this.currentPage.set(stryMutAct_9fa48("5240") ? event.pageIndex - 1 : (stryCov_9fa48("5240"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("5241")) {
      {}
    } else {
      stryCov_9fa48("5241");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("5242")) {
      {}
    } else {
      stryCov_9fa48("5242");
      const dialogRef = this.dialog.open(UserFormComponent, stryMutAct_9fa48("5243") ? {} : (stryCov_9fa48("5243"), {
        width: stryMutAct_9fa48("5244") ? "" : (stryCov_9fa48("5244"), '600px'),
        data: stryMutAct_9fa48("5245") ? {} : (stryCov_9fa48("5245"), {
          mode: stryMutAct_9fa48("5246") ? "" : (stryCov_9fa48("5246"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("5247")) {
          {}
        } else {
          stryCov_9fa48("5247");
          if (stryMutAct_9fa48("5249") ? false : stryMutAct_9fa48("5248") ? true : (stryCov_9fa48("5248", "5249"), result)) this.usersResource.reload();
        }
      });
    }
  }
  openEditDialog(user: User): void {
    if (stryMutAct_9fa48("5250")) {
      {}
    } else {
      stryCov_9fa48("5250");
      const dialogRef = this.dialog.open(UserFormComponent, stryMutAct_9fa48("5251") ? {} : (stryCov_9fa48("5251"), {
        width: stryMutAct_9fa48("5252") ? "" : (stryCov_9fa48("5252"), '600px'),
        data: stryMutAct_9fa48("5253") ? {} : (stryCov_9fa48("5253"), {
          mode: stryMutAct_9fa48("5254") ? "" : (stryCov_9fa48("5254"), 'edit'),
          user
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("5255")) {
          {}
        } else {
          stryCov_9fa48("5255");
          if (stryMutAct_9fa48("5257") ? false : stryMutAct_9fa48("5256") ? true : (stryCov_9fa48("5256", "5257"), result)) this.usersResource.reload();
        }
      });
    }
  }
  getUserFields(user: User): MobileCardField[] {
    if (stryMutAct_9fa48("5258")) {
      {}
    } else {
      stryCov_9fa48("5258");
      return stryMutAct_9fa48("5259") ? [] : (stryCov_9fa48("5259"), [stryMutAct_9fa48("5260") ? {} : (stryCov_9fa48("5260"), {
        label: this.translationService.instant(stryMutAct_9fa48("5261") ? "" : (stryCov_9fa48("5261"), 'users.email')),
        value: user.email,
        type: stryMutAct_9fa48("5262") ? "" : (stryCov_9fa48("5262"), 'email')
      }), stryMutAct_9fa48("5263") ? {} : (stryCov_9fa48("5263"), {
        label: this.translationService.instant(stryMutAct_9fa48("5264") ? "" : (stryCov_9fa48("5264"), 'users.phone')),
        value: stryMutAct_9fa48("5267") ? user.phone && '-' : stryMutAct_9fa48("5266") ? false : stryMutAct_9fa48("5265") ? true : (stryCov_9fa48("5265", "5266", "5267"), user.phone || (stryMutAct_9fa48("5268") ? "" : (stryCov_9fa48("5268"), '-'))),
        type: stryMutAct_9fa48("5269") ? "" : (stryCov_9fa48("5269"), 'phone')
      }), stryMutAct_9fa48("5270") ? {} : (stryCov_9fa48("5270"), {
        label: this.translationService.instant(stryMutAct_9fa48("5271") ? "" : (stryCov_9fa48("5271"), 'users.role')),
        value: user.role
      }), stryMutAct_9fa48("5272") ? {} : (stryCov_9fa48("5272"), {
        label: this.translationService.instant(stryMutAct_9fa48("5273") ? "" : (stryCov_9fa48("5273"), 'common.created')),
        value: user.createdAt,
        type: stryMutAct_9fa48("5274") ? "" : (stryCov_9fa48("5274"), 'date')
      })]);
    }
  }
  deleteUser(user: User): void {
    if (stryMutAct_9fa48("5275")) {
      {}
    } else {
      stryCov_9fa48("5275");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("5276") ? {} : (stryCov_9fa48("5276"), {
        width: stryMutAct_9fa48("5277") ? "" : (stryCov_9fa48("5277"), '400px'),
        data: stryMutAct_9fa48("5278") ? {} : (stryCov_9fa48("5278"), {
          title: stryMutAct_9fa48("5279") ? "" : (stryCov_9fa48("5279"), 'Eliminar usuario'),
          message: stryMutAct_9fa48("5280") ? `` : (stryCov_9fa48("5280"), `¿Estás seguro de eliminar a ${user.name}?`),
          confirmLabel: stryMutAct_9fa48("5281") ? "" : (stryCov_9fa48("5281"), 'Eliminar'),
          color: stryMutAct_9fa48("5282") ? "" : (stryCov_9fa48("5282"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("5283")) {
          {}
        } else {
          stryCov_9fa48("5283");
          if (stryMutAct_9fa48("5285") ? false : stryMutAct_9fa48("5284") ? true : (stryCov_9fa48("5284", "5285"), confirmed)) {
            if (stryMutAct_9fa48("5286")) {
              {}
            } else {
              stryCov_9fa48("5286");
              this.usersService.delete(user.id).subscribe(stryMutAct_9fa48("5287") ? {} : (stryCov_9fa48("5287"), {
                next: () => {
                  if (stryMutAct_9fa48("5288")) {
                    {}
                  } else {
                    stryCov_9fa48("5288");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("5289") ? "" : (stryCov_9fa48("5289"), 'common.toast.deleted')), stryMutAct_9fa48("5290") ? "" : (stryCov_9fa48("5290"), 'success'));
                    this.usersResource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("5291")) {
                    {}
                  } else {
                    stryCov_9fa48("5291");
                    const msg = Array.isArray(stryMutAct_9fa48("5292") ? err.error.message : (stryCov_9fa48("5292"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("5293") ? "" : (stryCov_9fa48("5293"), ', ')) : stryMutAct_9fa48("5296") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("5295") ? false : stryMutAct_9fa48("5294") ? true : (stryCov_9fa48("5294", "5295", "5296"), (stryMutAct_9fa48("5297") ? err.error.message : (stryCov_9fa48("5297"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("5298") ? "" : (stryCov_9fa48("5298"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("5299") ? "" : (stryCov_9fa48("5299"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  viewTechnicianReport(userId: string): void {
    if (stryMutAct_9fa48("5300")) {
      {}
    } else {
      stryCov_9fa48("5300");
      this.router.navigate(stryMutAct_9fa48("5301") ? [] : (stryCov_9fa48("5301"), [stryMutAct_9fa48("5302") ? "" : (stryCov_9fa48("5302"), '/admin/reports/technicians'), userId]));
    }
  }
  onEditSwipe(user: User): (event: Event) => void {
    if (stryMutAct_9fa48("5303")) {
      {}
    } else {
      stryCov_9fa48("5303");
      return stryMutAct_9fa48("5304") ? () => undefined : (stryCov_9fa48("5304"), (_event: Event) => this.openEditDialog(user));
    }
  }
  onDeleteSwipe(user: User): (event: Event) => void {
    if (stryMutAct_9fa48("5305")) {
      {}
    } else {
      stryCov_9fa48("5305");
      return stryMutAct_9fa48("5306") ? () => undefined : (stryCov_9fa48("5306"), (_event: Event) => this.deleteUser(user));
    }
  }
}