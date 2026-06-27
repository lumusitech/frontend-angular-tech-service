import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { UsersService } from '../../core/services/users.service';
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
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from './user-form.component';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-users-list',
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
    MatChipsModule,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    DatePipe,
    TranslatePipe,
  ],
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
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                {{ user.createdAt | date: 'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'common.actions' | translate }}
              </th>
              <td mat-cell *matCellDef="let user" class="px-4 py-3 text-right">
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
  `,
})
export class UsersListComponent {
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly searchFilter = signal('');
  readonly roleFilter = signal('');

  readonly usersResource = httpResource<PaginatedResponse<User>>(() => ({
    url: '/api/users',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.roleFilter() ? { role: this.roleFilter() } : {}),
    },
  }));

  displayedColumns = ['name', 'email', 'phone', 'role', 'isActive', 'createdAt', 'actions'];

  readonly hasActiveFilters = computed(() => {
    return this.searchFilter() !== '' || this.roleFilter() !== '';
  });

  clearFilters(): void {
    this.searchFilter.set('');
    this.roleFilter.set('');
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getRoleChipClass(role: string): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';
    switch (role) {
      case 'admin':
        return base + 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'technician':
        return base + 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'seller':
        return base + 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return base + 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.usersResource.reload();
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { mode: 'edit', user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.usersResource.reload();
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar usuario',
        message: `¿Estás seguro de eliminar a ${user.name}?`,
        confirmLabel: 'Eliminar',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.usersService.delete(user.id).subscribe({
          next: () => {
            this.usersResource.reload();
          },
        });
      }
    });
  }
}
