import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
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
import { MatMenuModule } from '@angular/material/menu';
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
import { MobileFilterBarComponent } from '../../shared/components/mobile-filter-bar/mobile-filter-bar.component';

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
    MatMenuModule,
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
        [title]="'users.title' | translate"
        [subtitle]="'users.subtitle' | translate"
        [actionLabel]="'users.newUser' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <app-mobile-filter-bar [hasActiveFilters]="hasActiveFilters()" (clearFilters)="clearFilters()">
            <mat-form-field appearance="outline" class="w-44">
              <mat-label>{{ 'common.search' | translate }}</mat-label>
              <input matInput [value]="searchFilter()" (input)="searchFilter.set(getInputValue($event))" inputmode="search" enterkeyhint="done" (keydown.enter)="$event.target.blur()" [placeholder]="'common.search' | translate" />
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
          </app-mobile-filter-bar>
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
              [class.highlight-pulse]="user.id === highlightedId() && highlightApplied()"
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
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
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
                <div class="action-btn-group">
                  <button mat-icon-button (click)="$event.stopPropagation()" [matMenuTriggerFor]="userActionsMenu" [title]="'common.actions' | translate">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #userActionsMenu="matMenu">
                    <button mat-menu-item (click)="openEditDialog(user); $event.stopPropagation()">
                      <mat-icon>edit</mat-icon>
                      <span>{{ 'common.edit' | translate }}</span>
                    </button>
                    <button mat-menu-item (click)="deleteUser(user); $event.stopPropagation()">
                      <mat-icon>delete</mat-icon>
                      <span>{{ 'common.delete' | translate }}</span>
                    </button>
                    @if (user.role === 'technician') {
                      <button mat-menu-item (click)="viewTechnicianReport(user.id); $event.stopPropagation()">
                        <mat-icon>assessment</mat-icon>
                        <span>{{ 'users.viewTechnicianReport' | translate }}</span>
                      </button>
                    }
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="openEditDialog(row)" class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" [class.highlight-pulse]="highlightedId() === row.id && highlightApplied()"></tr>
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
  private readonly toastService = inject(ToastService);
  readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('createdAt');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly searchFilter = signal<string>(this.route.snapshot.queryParamMap.get('search') ?? '');
  readonly roleFilter = signal('');
  readonly routeHighlight = signal<string | null>(this.route.snapshot.queryParamMap.get('highlight'));
  readonly highlightApplied = signal(false);
  readonly previousPath = signal('');

  readonly usersResource = httpResource<PaginatedResponse<User>>(() => ({
    url: '/api/users',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      sortBy: this.sortBy(),
      order: this.sortOrder().toUpperCase(),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      ...(this.roleFilter() ? { role: this.roleFilter() } : {}),
    },
  }));

  readonly highlightedId = computed(() => {
    const target = this.routeHighlight();
    if (!target) return null;
    const data = this.usersResource.value();
    if (!data || this.usersResource.isLoading()) return null;
    return data.data.find((row) => row.id === target)?.id ?? null;
  });

  constructor() {
    if (this.routeHighlight()) {
      this.highlightApplied.set(true);
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.previousPath.set(event.url.split('?')[0]);
          return;
        }
        if (event instanceof NavigationEnd) {
          const newPath = this.router.url.split('?')[0];
          const sameSection = this.previousPath() === newPath;
          const highlightId = this.route.snapshot.queryParamMap.get('highlight');
          this.searchFilter.set(this.route.snapshot.queryParamMap.get('search') ?? '');
          this.routeHighlight.set(highlightId);
          this.highlightApplied.set(!!(highlightId && !sameSection));
        }
      });
  }

  displayedColumns = ['name', 'email', 'phone', 'role', 'isActive', 'createdAt', 'actions'];

  readonly hasActiveFilters = computed(() => {
    return this.searchFilter() !== '' || this.roleFilter() !== '';
  });


  clearFilters(): void {
    this.searchFilter.set('');
    this.roleFilter.set('');
    this.highlightApplied.set(false);
    this.routeHighlight.set(null);
    this.router.navigate(['/admin/users']);
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

  getUserFields(user: User): MobileCardField[] {
    return [
      { label: this.translationService.instant('users.email'), value: user.email, type: 'email' },
      { label: this.translationService.instant('users.phone'), value: user.phone || '-', type: 'phone' },
      { label: this.translationService.instant('users.role'), value: user.role },
      { label: this.translationService.instant('common.created'), value: user.createdAt, type: 'date' },
    ];
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
            this.toastService.show(this.translationService.instant('common.toast.deleted'), 'success');
            this.usersResource.reload();
          },
          error: (err) => {
            const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorDeleted');
            this.toastService.show(msg, 'error');
          },
        });
      }
    });
  }

  viewTechnicianReport(userId: string): void {
    this.router.navigate(['/admin/reports/technicians', userId]);
  }

  onEditSwipe(user: User): (event: Event) => void {
    return (_event: Event) => this.openEditDialog(user);
  }

  onDeleteSwipe(user: User): (event: Event) => void {
    return (_event: Event) => this.deleteUser(user);
  }
}
