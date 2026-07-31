import { Component, computed, DestroyRef, effect, inject, signal, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SkillsService } from '../../core/services/skills.service';
import { Skill } from '../../core/models/skill.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { SkillFormComponent } from './skill-form.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { MobileFilterBarComponent } from '../../shared/components/mobile-filter-bar/mobile-filter-bar.component';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-skills-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatAccordion,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    MobileCardComponent,
    MobileFilterBarComponent,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'skills.title' | translate"
        [subtitle]="'skills.subtitle' | translate"
        [actionLabel]="'skills.newSkill' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <app-mobile-filter-bar [hasActiveFilters]="hasActiveFilters()" (clearFilters)="clearFilters()">
          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.search' | translate }}</mat-label>
            <input matInput [value]="searchFilter()" (input)="searchFilter.set(getInputValue($event))" [placeholder]="'common.search' | translate" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'skills.category' | translate }}</mat-label>
            <mat-select [value]="categoryFilter()" (selectionChange)="categoryFilter.set($event.value)">
              <mat-option value="">{{ 'common.all' | translate }}</mat-option>
              @for (cat of categories(); track cat) {
                <mat-option [value]="cat">{{ cat }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          </app-mobile-filter-bar>
        </div>
      </div>

      @if (skillsResource.status() === 'loading' && !skillsResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (skillsResource.error()) {
        <app-error-state (retry)="skillsResource.reload()" />
      } @else if (skillsResource.hasValue() && skillsResource.value().data.length === 0) {
        <app-empty-state
          [title]="'skills.noSkills' | translate"
          [message]="'skills.noSkillsMessage' | translate"
          [actionLabel]="'skills.createSkill' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (skillsResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (skill of skillsResource.value().data; track skill.id) {
            <app-mobile-card
              [title]="skill.name"
              [fields]="getSkillFields(skill)"
              [canSwipe]="true"
              [onEdit]="onEditSwipe(skill)"
              [onDelete]="onDeleteSwipe(skill)"
            >
              <button mat-icon-button (click)="openEditDialog(skill); $event.stopPropagation()" class="!w-8 !h-8">
                <mat-icon class="!w-4 !h-4">edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteSkill(skill); $event.stopPropagation()" class="!w-8 !h-8" color="warn">
                <mat-icon class="!w-4 !h-4">delete</mat-icon>
              </button>
            </app-mobile-card>
          }
        </mat-accordion>

        <!-- Desktop: Table -->
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table mat-table matSort matSortDisableClear [dataSource]="skillsResource.value().data" (matSortChange)="onSortChange($event)" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'skills.name' | translate }}
              </th>
              <td mat-cell *matCellDef="let skill" class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {{ skill.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'skills.category' | translate }}
              </th>
              <td mat-cell *matCellDef="let skill" class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {{ skill.category ? (('skills.categories.' + skill.category) | translate) : '—' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'skills.description' | translate }}
              </th>
              <td mat-cell *matCellDef="let skill" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                {{ skill.description || '—' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'common.created' | translate }}
              </th>
              <td mat-cell *matCellDef="let skill" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {{ skill.createdAt | relativeDate }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {{ 'common.actions' | translate }}
              </th>
              <td mat-cell *matCellDef="let skill" class="px-4 py-3 text-right">
                <button mat-icon-button (click)="openEditDialog(skill); $event.stopPropagation()" [title]="'common.edit' | translate">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteSkill(skill); $event.stopPropagation()" [title]="'common.delete' | translate" color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="openEditDialog(row)" [class.highlight-pulse]="highlightedId() === row.id" class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"></tr>
          </table>

          <mat-paginator
            [length]="skillsResource.value().total"
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
export class SkillsListComponent implements OnInit {
  private readonly skillsService = inject(SkillsService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: false });

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');
  readonly searchFilter = signal('');
  readonly categoryFilter = signal('');
  readonly highlightedId = signal<string | null>(null);

  readonly skillsResource = httpResource<PaginatedResponse<Skill>>(() => ({
    url: '/api/skills',
    params: {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.sortBy() ? { sortBy: this.sortBy(), order: this.sortOrder().toUpperCase() } : {}),
      ...(this.searchFilter() ? { search: this.searchFilter() } : {}),
      ...(this.categoryFilter() ? { category: this.categoryFilter() } : {}),
    },
  }));

  readonly categories = computed(() => {
    const skills = this.skillsResource.value()?.data || [];
    return [...new Set(skills.map((s) => s.category).filter((c): c is string => !!c))];
  });

  private translate(key: string, params?: Record<string, string>): string {
    return this.translationService.instant(key, params);
  }

  displayedColumns = ['name', 'category', 'description', 'createdAt', 'actions'];

  readonly hasActiveFilters = computed(() => {
    return this.searchFilter() !== '' || this.categoryFilter() !== '';
  });


  clearFilters(): void {
    this.searchFilter.set('');
    this.categoryFilter.set('');
    this.highlightedId.set(null);
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

  ngOnInit(): void {}

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
    const dialogRef = this.dialog.open(SkillFormComponent, {
      width: '500px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.skillsResource.reload();
    });
  }

  openEditDialog(skill: Skill): void {
    const dialogRef = this.dialog.open(SkillFormComponent, {
      width: '500px',
      data: { mode: 'edit', skill },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.skillsResource.reload();
    });
  }

  getSkillFields(skill: Skill): MobileCardField[] {
    return [
      { label: this.translationService.instant('skills.category'), value: skill.category || '-' },
      { label: this.translationService.instant('skills.description'), value: skill.description || '-' },
      { label: this.translationService.instant('common.created'), value: skill.createdAt, type: 'date' },
    ];
  }

  deleteSkill(skill: Skill): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate('skills.deleteTitle'),
        message: this.translate('skills.deleteMessage', { name: skill.name }),
        confirmLabel: this.translate('common.delete'),
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.skillsService.delete(skill.id).subscribe({
          next: () => {
            this.toastService.show(this.translationService.instant('common.toast.deleted'), 'success');
            this.skillsResource.reload();
          },
          error: (err) => {
            const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || this.translationService.instant('common.toast.errorDeleted');
            this.toastService.show(msg, 'error');
          },
        });
      }
    });
  }

  onEditSwipe(skill: Skill): (event: Event) => void {
    return (_event: Event) => this.openEditDialog(skill);
  }

  onDeleteSwipe(skill: Skill): (event: Event) => void {
    return (_event: Event) => this.deleteSkill(skill);
  }
}
