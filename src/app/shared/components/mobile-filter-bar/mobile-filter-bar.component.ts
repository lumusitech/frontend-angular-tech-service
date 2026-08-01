import { Component, DestroyRef, ElementRef, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-mobile-filter-bar',
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <div class="hidden md:flex md:items-center md:gap-3 md:flex-wrap flex-1">
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
        <div
          class="fixed inset-0 z-40"
          (click)="expanded.set(false)"
          (touchstart)="expanded.set(false)"
        ></div>
        <div class="relative z-50 flex flex-wrap items-center gap-3">
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
      this.elementRef.nativeElement.addEventListener('focusout', this.onFocusOut);
      this.destroyRef.onDestroy(() =>
        this.elementRef.nativeElement.removeEventListener('focusout', this.onFocusOut),
      );
    }
  }

  private onFocusOut = (event: FocusEvent): void => {
    if (
      event.relatedTarget === null ||
      !this.elementRef.nativeElement.contains(event.relatedTarget as Node)
    ) {
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
