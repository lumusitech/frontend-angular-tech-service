import { Component, inject, signal, HostListener } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GlobalSearchService, SearchResult } from '../../../core/services/global-search.service';

@Component({
  selector: 'app-global-search',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  template: `
    <div class="relative">
      <mat-form-field appearance="outline" class="w-64" subscriptSizing="dynamic">
        <mat-icon matPrefix class="!mr-2 !text-gray-400">search</mat-icon>
        <input
          matInput
          [value]="query()"
          (input)="onInput($any($event.target).value)"
          (focus)="isOpen.set(true)"
          [placeholder]="'common.globalSearch' | translate"
        />
        @if (query()) {
          <button matSuffix mat-icon-button (click)="clear()" type="button">
            <mat-icon class="!text-gray-400">close</mat-icon>
          </button>
        }
      </mat-form-field>

      @if (isOpen() && (searchService.results().length > 0 || searchService.loading() || query().length >= 2)) {
        <div class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          @if (searchService.loading()) {
            <div class="flex items-center justify-center p-4">
              <mat-spinner diameter="24" />
            </div>
          } @else if (searchService.results().length === 0 && query().length >= 2) {
            <div class="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              {{ 'common.noResults' | translate }}
            </div>
          } @else {
            @for (result of searchService.results(); track result.id) {
              <button
                class="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                (click)="navigateTo(result)"
              >
                <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <mat-icon class="!text-blue-600 dark:!text-blue-400 !text-lg">{{ result.icon }}</mat-icon>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ result.title }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ result.subtitle }}
                  </p>
                </div>
                <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {{ ('common.entityType.' + result.type) | translate }}
                </span>
              </button>
            }
          }
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
    this.router.navigate([result.route]);
  }
}
