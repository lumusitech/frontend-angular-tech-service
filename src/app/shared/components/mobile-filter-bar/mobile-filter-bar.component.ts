import { Component, DestroyRef, ElementRef, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-mobile-filter-bar',
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <div class="hidden md:contents">
      <ng-content />
      @if (hasActiveFilters()) {
        <button
          mat-stroked-button
          (click)="clearFilters.emit()"
          class="!text-gray-500 dark:!text-gray-400"
        >
          <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
          {{ 'common.clearFilters' | translate }}
        </button>
      }
    </div>

    <div class="md:hidden">
      @if (expanded()) {
        <div class="flex flex-wrap items-center gap-3">
          <ng-content />
          <button mat-icon-button (click)="expanded.set(false)" class="!w-8 !h-8 !min-w-0">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      } @else {
        <div class="flex items-center">
          <button
            mat-icon-button
            (click)="onIconClick()"
            [class.!text-blue-600]="hasActiveFilters()"
            class="!w-9 !h-9 !min-w-0"
          >
            <mat-icon>{{ hasActiveFilters() ? 'filter_alt' : 'filter_list' }}</mat-icon>
          </button>
          @if (hasActiveFilters()) {
            <button mat-icon-button (click)="expanded.set(true)" class="!w-6 !h-6 !min-w-0">
              <mat-icon class="!text-base">arrow_drop_down</mat-icon>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class MobileFilterBarComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly hasActiveFilters = input(false);
  readonly clearFilters = output<void>();

  readonly expanded = signal(false);

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', this.onDocumentMouseDown);
      this.destroyRef.onDestroy(() =>
        document.removeEventListener('mousedown', this.onDocumentMouseDown),
      );
    }
  }

  private onDocumentMouseDown = (event: MouseEvent): void => {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.expanded.set(false);
    }
  };

  onIconClick(): void {
    if (this.hasActiveFilters()) {
      this.clearFilters.emit();
    } else {
      this.expanded.set(true);
    }
  }
}
