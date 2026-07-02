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
import { httpResource } from '@angular/common/http';
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
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
@Component({
  selector: 'app-skills-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatDialogModule, MatProgressSpinnerModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, MobileCardComponent, TranslatePipe, RelativeDatePipe],
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

          @if (hasActiveFilters()) {
            <button mat-stroked-button (click)="clearFilters()" class="!text-gray-500 dark:!text-gray-400">
              <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
              {{ 'common.clearFilters' | translate }}
            </button>
          }
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
            <tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="openEditDialog(row)" class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"></tr>
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
  `
})
export class SkillsListComponent {
  private readonly skillsService = inject(SkillsService);
  private readonly dialog = inject(MatDialog);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly sortBy = signal(stryMutAct_9fa48("4535") ? "Stryker was here!" : (stryCov_9fa48("4535"), ''));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("4536") ? "" : (stryCov_9fa48("4536"), 'asc'));
  readonly searchFilter = signal(stryMutAct_9fa48("4537") ? "Stryker was here!" : (stryCov_9fa48("4537"), ''));
  readonly categoryFilter = signal(stryMutAct_9fa48("4538") ? "Stryker was here!" : (stryCov_9fa48("4538"), ''));
  readonly skillsResource = httpResource<PaginatedResponse<Skill>>(stryMutAct_9fa48("4539") ? () => undefined : (stryCov_9fa48("4539"), () => stryMutAct_9fa48("4540") ? {} : (stryCov_9fa48("4540"), {
    url: stryMutAct_9fa48("4541") ? "" : (stryCov_9fa48("4541"), '/api/skills'),
    params: stryMutAct_9fa48("4542") ? {} : (stryCov_9fa48("4542"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.sortBy() ? stryMutAct_9fa48("4543") ? {} : (stryCov_9fa48("4543"), {
        sortBy: this.sortBy(),
        order: stryMutAct_9fa48("4544") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("4544"), this.sortOrder().toUpperCase())
      }) : {}),
      ...(this.searchFilter() ? stryMutAct_9fa48("4545") ? {} : (stryCov_9fa48("4545"), {
        search: this.searchFilter()
      }) : {}),
      ...(this.categoryFilter() ? stryMutAct_9fa48("4546") ? {} : (stryCov_9fa48("4546"), {
        category: this.categoryFilter()
      }) : {})
    })
  })));
  readonly categories = computed(() => {
    if (stryMutAct_9fa48("4547")) {
      {}
    } else {
      stryCov_9fa48("4547");
      const skills = stryMutAct_9fa48("4550") ? this.skillsResource.value()?.data && [] : stryMutAct_9fa48("4549") ? false : stryMutAct_9fa48("4548") ? true : (stryCov_9fa48("4548", "4549", "4550"), (stryMutAct_9fa48("4551") ? this.skillsResource.value().data : (stryCov_9fa48("4551"), this.skillsResource.value()?.data)) || (stryMutAct_9fa48("4552") ? ["Stryker was here"] : (stryCov_9fa48("4552"), [])));
      return stryMutAct_9fa48("4553") ? [] : (stryCov_9fa48("4553"), [...new Set(stryMutAct_9fa48("4554") ? skills.map(s => s.category) : (stryCov_9fa48("4554"), skills.map(stryMutAct_9fa48("4555") ? () => undefined : (stryCov_9fa48("4555"), s => s.category)).filter(stryMutAct_9fa48("4556") ? () => undefined : (stryCov_9fa48("4556"), (c): c is string => stryMutAct_9fa48("4557") ? !c : (stryCov_9fa48("4557"), !(stryMutAct_9fa48("4558") ? c : (stryCov_9fa48("4558"), !c)))))))]);
    }
  });
  private translate(key: string, params?: Record<string, string>): string {
    if (stryMutAct_9fa48("4559")) {
      {}
    } else {
      stryCov_9fa48("4559");
      return this.translationService.instant(key, params);
    }
  }
  displayedColumns = stryMutAct_9fa48("4560") ? [] : (stryCov_9fa48("4560"), [stryMutAct_9fa48("4561") ? "" : (stryCov_9fa48("4561"), 'name'), stryMutAct_9fa48("4562") ? "" : (stryCov_9fa48("4562"), 'category'), stryMutAct_9fa48("4563") ? "" : (stryCov_9fa48("4563"), 'description'), stryMutAct_9fa48("4564") ? "" : (stryCov_9fa48("4564"), 'createdAt'), stryMutAct_9fa48("4565") ? "" : (stryCov_9fa48("4565"), 'actions')]);
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("4566")) {
      {}
    } else {
      stryCov_9fa48("4566");
      return stryMutAct_9fa48("4569") ? this.searchFilter() !== '' && this.categoryFilter() !== '' : stryMutAct_9fa48("4568") ? false : stryMutAct_9fa48("4567") ? true : (stryCov_9fa48("4567", "4568", "4569"), (stryMutAct_9fa48("4571") ? this.searchFilter() === '' : stryMutAct_9fa48("4570") ? false : (stryCov_9fa48("4570", "4571"), this.searchFilter() !== (stryMutAct_9fa48("4572") ? "Stryker was here!" : (stryCov_9fa48("4572"), '')))) || (stryMutAct_9fa48("4574") ? this.categoryFilter() === '' : stryMutAct_9fa48("4573") ? false : (stryCov_9fa48("4573", "4574"), this.categoryFilter() !== (stryMutAct_9fa48("4575") ? "Stryker was here!" : (stryCov_9fa48("4575"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("4576")) {
      {}
    } else {
      stryCov_9fa48("4576");
      this.searchFilter.set(stryMutAct_9fa48("4577") ? "Stryker was here!" : (stryCov_9fa48("4577"), ''));
      this.categoryFilter.set(stryMutAct_9fa48("4578") ? "Stryker was here!" : (stryCov_9fa48("4578"), ''));
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("4579")) {
      {}
    } else {
      stryCov_9fa48("4579");
      return (event.target as HTMLInputElement).value;
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("4580")) {
      {}
    } else {
      stryCov_9fa48("4580");
      this.currentPage.set(stryMutAct_9fa48("4581") ? event.pageIndex - 1 : (stryCov_9fa48("4581"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("4582")) {
      {}
    } else {
      stryCov_9fa48("4582");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("4583")) {
      {}
    } else {
      stryCov_9fa48("4583");
      const dialogRef = this.dialog.open(SkillFormComponent, stryMutAct_9fa48("4584") ? {} : (stryCov_9fa48("4584"), {
        width: stryMutAct_9fa48("4585") ? "" : (stryCov_9fa48("4585"), '500px'),
        data: stryMutAct_9fa48("4586") ? {} : (stryCov_9fa48("4586"), {
          mode: stryMutAct_9fa48("4587") ? "" : (stryCov_9fa48("4587"), 'create')
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("4588")) {
          {}
        } else {
          stryCov_9fa48("4588");
          if (stryMutAct_9fa48("4590") ? false : stryMutAct_9fa48("4589") ? true : (stryCov_9fa48("4589", "4590"), result)) this.skillsResource.reload();
        }
      });
    }
  }
  openEditDialog(skill: Skill): void {
    if (stryMutAct_9fa48("4591")) {
      {}
    } else {
      stryCov_9fa48("4591");
      const dialogRef = this.dialog.open(SkillFormComponent, stryMutAct_9fa48("4592") ? {} : (stryCov_9fa48("4592"), {
        width: stryMutAct_9fa48("4593") ? "" : (stryCov_9fa48("4593"), '500px'),
        data: stryMutAct_9fa48("4594") ? {} : (stryCov_9fa48("4594"), {
          mode: stryMutAct_9fa48("4595") ? "" : (stryCov_9fa48("4595"), 'edit'),
          skill
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("4596")) {
          {}
        } else {
          stryCov_9fa48("4596");
          if (stryMutAct_9fa48("4598") ? false : stryMutAct_9fa48("4597") ? true : (stryCov_9fa48("4597", "4598"), result)) this.skillsResource.reload();
        }
      });
    }
  }
  getSkillFields(skill: Skill): MobileCardField[] {
    if (stryMutAct_9fa48("4599")) {
      {}
    } else {
      stryCov_9fa48("4599");
      return stryMutAct_9fa48("4600") ? [] : (stryCov_9fa48("4600"), [stryMutAct_9fa48("4601") ? {} : (stryCov_9fa48("4601"), {
        label: this.translationService.instant(stryMutAct_9fa48("4602") ? "" : (stryCov_9fa48("4602"), 'skills.category')),
        value: stryMutAct_9fa48("4605") ? skill.category && '-' : stryMutAct_9fa48("4604") ? false : stryMutAct_9fa48("4603") ? true : (stryCov_9fa48("4603", "4604", "4605"), skill.category || (stryMutAct_9fa48("4606") ? "" : (stryCov_9fa48("4606"), '-')))
      }), stryMutAct_9fa48("4607") ? {} : (stryCov_9fa48("4607"), {
        label: this.translationService.instant(stryMutAct_9fa48("4608") ? "" : (stryCov_9fa48("4608"), 'skills.description')),
        value: stryMutAct_9fa48("4611") ? skill.description && '-' : stryMutAct_9fa48("4610") ? false : stryMutAct_9fa48("4609") ? true : (stryCov_9fa48("4609", "4610", "4611"), skill.description || (stryMutAct_9fa48("4612") ? "" : (stryCov_9fa48("4612"), '-')))
      }), stryMutAct_9fa48("4613") ? {} : (stryCov_9fa48("4613"), {
        label: this.translationService.instant(stryMutAct_9fa48("4614") ? "" : (stryCov_9fa48("4614"), 'common.created')),
        value: skill.createdAt,
        type: stryMutAct_9fa48("4615") ? "" : (stryCov_9fa48("4615"), 'date')
      })]);
    }
  }
  deleteSkill(skill: Skill): void {
    if (stryMutAct_9fa48("4616")) {
      {}
    } else {
      stryCov_9fa48("4616");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("4617") ? {} : (stryCov_9fa48("4617"), {
        width: stryMutAct_9fa48("4618") ? "" : (stryCov_9fa48("4618"), '400px'),
        data: stryMutAct_9fa48("4619") ? {} : (stryCov_9fa48("4619"), {
          title: this.translate(stryMutAct_9fa48("4620") ? "" : (stryCov_9fa48("4620"), 'skills.deleteTitle')),
          message: this.translate(stryMutAct_9fa48("4621") ? "" : (stryCov_9fa48("4621"), 'skills.deleteMessage'), stryMutAct_9fa48("4622") ? {} : (stryCov_9fa48("4622"), {
            name: skill.name
          })),
          confirmLabel: this.translate(stryMutAct_9fa48("4623") ? "" : (stryCov_9fa48("4623"), 'common.delete')),
          color: stryMutAct_9fa48("4624") ? "" : (stryCov_9fa48("4624"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("4625")) {
          {}
        } else {
          stryCov_9fa48("4625");
          if (stryMutAct_9fa48("4627") ? false : stryMutAct_9fa48("4626") ? true : (stryCov_9fa48("4626", "4627"), confirmed)) {
            if (stryMutAct_9fa48("4628")) {
              {}
            } else {
              stryCov_9fa48("4628");
              this.skillsService.delete(skill.id).subscribe(stryMutAct_9fa48("4629") ? {} : (stryCov_9fa48("4629"), {
                next: () => {
                  if (stryMutAct_9fa48("4630")) {
                    {}
                  } else {
                    stryCov_9fa48("4630");
                    this.toastService.show(this.translationService.instant(stryMutAct_9fa48("4631") ? "" : (stryCov_9fa48("4631"), 'common.toast.deleted')), stryMutAct_9fa48("4632") ? "" : (stryCov_9fa48("4632"), 'success'));
                    this.skillsResource.reload();
                  }
                },
                error: err => {
                  if (stryMutAct_9fa48("4633")) {
                    {}
                  } else {
                    stryCov_9fa48("4633");
                    const msg = Array.isArray(stryMutAct_9fa48("4634") ? err.error.message : (stryCov_9fa48("4634"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("4635") ? "" : (stryCov_9fa48("4635"), ', ')) : stryMutAct_9fa48("4638") ? err.error?.message && this.translationService.instant('common.toast.errorDeleted') : stryMutAct_9fa48("4637") ? false : stryMutAct_9fa48("4636") ? true : (stryCov_9fa48("4636", "4637", "4638"), (stryMutAct_9fa48("4639") ? err.error.message : (stryCov_9fa48("4639"), err.error?.message)) || this.translationService.instant(stryMutAct_9fa48("4640") ? "" : (stryCov_9fa48("4640"), 'common.toast.errorDeleted')));
                    this.toastService.show(msg, stryMutAct_9fa48("4641") ? "" : (stryCov_9fa48("4641"), 'error'));
                  }
                }
              }));
            }
          }
        }
      });
    }
  }
  onEditSwipe(skill: Skill): (event: Event) => void {
    if (stryMutAct_9fa48("4642")) {
      {}
    } else {
      stryCov_9fa48("4642");
      return stryMutAct_9fa48("4643") ? () => undefined : (stryCov_9fa48("4643"), (_event: Event) => this.openEditDialog(skill));
    }
  }
  onDeleteSwipe(skill: Skill): (event: Event) => void {
    if (stryMutAct_9fa48("4644")) {
      {}
    } else {
      stryCov_9fa48("4644");
      return stryMutAct_9fa48("4645") ? () => undefined : (stryCov_9fa48("4645"), (_event: Event) => this.deleteSkill(skill));
    }
  }
}