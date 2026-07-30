import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GlobalSearchService, SearchResult } from '../../../core/services/global-search.service';

const ENTITY_ORDER: Record<string, number> = {
  client: 0,
  'work-order': 1,
  supplier: 2,
  'service-type': 3,
  skill: 4,
  inquiry: 5,
  expense: 6,
  'pending-item': 7,
  notification: 8,
};

const LIST_RESULT_TYPES: SearchResult['type'][] = [
  'supplier',
  'service-type',
  'skill',
  'expense',
  'pending-item',
];

@Component({
  selector: 'app-global-search',
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  template: `
    <div class="relative w-96">
      <div
        class="flex items-center gap-2 h-9 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
      >
        <mat-icon class="!text-gray-400 !text-[20px] shrink-0 self-center !mt-0.5">search</mat-icon>
        <input
          class="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
          [value]="query()"
          (input)="onInput($any($event.target).value)"
          (focus)="isOpen.set(true)"
          [placeholder]="'common.globalSearch' | translate"
        />
        @if (query()) {
          <button (click)="clear()" class="flex items-center justify-center shrink-0 cursor-pointer" type="button">
            <mat-icon class="!text-gray-400 !text-[18px]">close</mat-icon>
          </button>
        }
      </div>

      @if (isOpen() && query().length >= 2) {
        <div
          class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 w-96 max-w-[calc(100vw-2rem)]"
        >
          <div
            [class.hidden]="!(searchService.loading() && searchService.results().length === 0)"
            class="flex items-center justify-center p-4"
          >
            <mat-spinner diameter="24" />
          </div>
          <div
            [class.hidden]="searchService.results().length > 0 || searchService.loading()"
            class="p-4 text-center text-gray-500 dark:text-gray-400 text-sm"
          >
            {{ 'common.noResults' | translate }}
          </div>
          <div [class.hidden]="searchService.results().length === 0">
            @for (group of groupedResults(); track group.type) {
              <div
                class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50"
              >
                {{ ('common.entityType.' + group.type) | translate }}
              </div>
              @for (result of group.results; track result.id) {
                <button
                  class="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors border-b border-gray-50 dark:border-gray-700/30 last:border-b-0"
                  (click)="navigateTo(result)"
                >
                  <div
                    class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"
                  >
                    <mat-icon class="!text-blue-600 dark:!text-blue-400 !text-base">{{ result.icon }}</mat-icon>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {{ result.title }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {{ result.subtitle }}
                    </p>
                  </div>
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class GlobalSearchComponent {
  private readonly router = inject(Router);
  readonly searchService = inject(GlobalSearchService);

  readonly query = signal('');
  readonly isOpen = signal(false);

  readonly groupedResults = computed(() => {
    const byType = new Map<string, SearchResult[]>();
    for (const r of this.searchService.results()) {
      const list = byType.get(r.type) || [];
      list.push(r);
      byType.set(r.type, list);
    }
    return Array.from(byType.entries())
      .sort(([a], [b]) => (ENTITY_ORDER[a] ?? 99) - (ENTITY_ORDER[b] ?? 99))
      .map(([type, results]) => ({ type, results }));
  });

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-global-search')) {
      this.isOpen.set(false);
    }
  }

  onInput(value: string): void {
    this.query.set(value);
    this.isOpen.set(true);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchService.search(value);
    }, 300);
  }

  clear(): void {
    this.query.set('');
    this.searchService.clear();
  }

  navigateTo(result: SearchResult): void {
    this.isOpen.set(false);
    this.clear();

    if (LIST_RESULT_TYPES.includes(result.type)) {
      this.router.navigate([result.route], { queryParams: { highlight: result.id } });
    } else {
      this.router.navigate([result.route]);
    }
  }
}
