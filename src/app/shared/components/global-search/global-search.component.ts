import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  viewChild,
  ElementRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GlobalSearchService, SearchResult } from '../../../core/services/global-search.service';

const ENTITY_ORDER: Record<string, number> = {
  client: 0,
  'work-order': 1,
  supplier: 2,
  'service-type': 3,
  skill: 4,
  user: 5,
  inquiry: 6,
  expense: 7,
  'pending-item': 8,
  notification: 9,
};

const LIST_RESULT_TYPES: SearchResult['type'][] = [
  'supplier',
  'service-type',
  'skill',
  'user',
  'expense',
  'pending-item',
];

@Component({
  selector: 'app-global-search',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <!-- Mobile: search icon trigger -->
    <button
      type="button"
      class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      (click)="toggleMobileSearch()"
      aria-label="Buscar"
    >
      <svg
        class="w-5 h-5 text-gray-600 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>

    <!-- Mobile: search overlay -->
    @if (mobileSearchOpen()) {
      <div
        class="fixed inset-0 bg-black/20 z-30 md:hidden"
        role="button"
        tabindex="-1"
        (click)="closeMobileSearch()"
        (keydown.escape)="closeMobileSearch()"
      ></div>
      <div class="fixed left-0 right-0 top-0 z-40 bg-white dark:bg-gray-800 shadow-lg md:hidden">
        <div
          class="flex items-center gap-2 h-14 px-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div
            class="flex items-center gap-2 flex-1 h-9 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
          >
            <mat-icon class="!text-gray-400 !text-[20px] shrink-0">search</mat-icon>
            <input
              #mobileInput
              class="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
              [value]="query()"
              (input)="onInput($any($event.target).value)"
              (focus)="isOpen.set(true)"
              [placeholder]="'common.globalSearch' | translate"
            />
            @if (query()) {
              <button
                (click)="clearMobileSearchInput()"
                class="flex items-center justify-center shrink-0 cursor-pointer"
                type="button"
              >
                <mat-icon class="!text-gray-400 !text-[18px]">close</mat-icon>
              </button>
            }
          </div>
          <button
            type="button"
            (click)="closeMobileSearch()"
            class="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 cursor-pointer"
          >
            {{ 'common.cancel' | translate }}
          </button>
        </div>

        @if (isOpen() && query().length >= 2) {
          <div class="max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
            <div
              [class.hidden]="searchService.results().length > 0"
              class="p-4 text-center text-gray-500 dark:text-gray-400 text-sm"
            >
              {{ 'common.noResults' | translate }}
            </div>
            <div [class.hidden]="searchService.results().length === 0">
              @for (group of groupedResults(); track group.type) {
                <div
                  class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50"
                >
                  {{ 'common.entityType.' + group.type | translate }}
                </div>
                @for (result of group.results; track result.id) {
                  <button
                    class="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors border-b border-gray-50 dark:border-gray-700/30 last:border-b-0"
                    (click)="navigateTo(result)"
                  >
                    <div
                      class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"
                    >
                      <mat-icon class="!text-blue-600 dark:!text-blue-400 !text-base">{{
                        result.icon
                      }}</mat-icon>
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
    }

    <!-- Desktop: always visible -->
    <div class="relative w-96 ml-2 hidden md:block">
      <div
        class="flex items-center gap-2 h-9 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
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
          <button
            (click)="clear()"
            class="flex items-center justify-center shrink-0 cursor-pointer"
            type="button"
          >
            <mat-icon class="!text-gray-400 !text-[18px]">close</mat-icon>
          </button>
        }
      </div>

      @if (isOpen() && query().length >= 2) {
        <div
          class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 w-96 max-w-[calc(100vw-2rem)] will-change-transform"
        >
          <div
            [class.hidden]="searchService.results().length > 0"
            class="p-4 text-center text-gray-500 dark:text-gray-400 text-sm"
          >
            {{ 'common.noResults' | translate }}
          </div>
          <div [class.hidden]="searchService.results().length === 0">
            @for (group of groupedResults(); track group.type) {
              <div
                class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50"
              >
                {{ 'common.entityType.' + group.type | translate }}
              </div>
              @for (result of group.results; track result.id) {
                <button
                  class="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors border-b border-gray-50 dark:border-gray-700/30 last:border-b-0"
                  (click)="navigateTo(result)"
                >
                  <div
                    class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"
                  >
                    <mat-icon class="!text-blue-600 dark:!text-blue-400 !text-base">{{
                      result.icon
                    }}</mat-icon>
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
  readonly mobileSearchOpen = signal(false);

  readonly mobileInputRef = viewChild<ElementRef<HTMLInputElement>>('mobileInput');

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
      this.mobileSearchOpen.set(false);
    }
  }

  toggleMobileSearch(): void {
    this.mobileSearchOpen.set(true);
    setTimeout(() => {
      this.mobileInputRef()?.nativeElement.focus();
    });
  }

  closeMobileSearch(): void {
    this.mobileSearchOpen.set(false);
    this.clear();
  }

  clearMobileSearchInput(): void {
    this.query.set('');
    this.searchService.clear();
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
    this.mobileSearchOpen.set(false);
    this.clear();

    if (LIST_RESULT_TYPES.includes(result.type)) {
      this.router.navigate([result.route], {
        queryParams: { highlight: result.id, search: result.title },
      });
    } else {
      this.router.navigate([result.route]);
    }
  }
}
