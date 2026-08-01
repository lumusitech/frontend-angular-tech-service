import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-mobile-filter-bar',
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <!-- Filter fields: flex on desktop, hidden/modal on mobile -->
    <div class="filter-fields" [class.expanded]="expanded()">
      <ng-content />
      @if (hasActiveFilters()) {
        <button
          mat-stroked-button
          (click)="onClearFilters()"
          class="clear-btn"
          type="button"
        >
          <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
          {{ 'common.clearFilters' | translate }}
        </button>
      }
    </div>

    <!-- Mobile backdrop -->
    @if (expanded()) {
      <div class="backdrop" (click)="expanded.set(false)"></div>
    }

    <!-- Mobile toggle button -->
    <div class="mobile-toggle">
      <button
        mat-stroked-button
        (click)="expanded.set(true)"
        [class.active-filters]="hasActiveFilters()"
        type="button"
      >
        <mat-icon>{{ hasActiveFilters() ? 'filter_alt' : 'filter_list' }}</mat-icon>
        Filtros
      </button>
      @if (hasActiveFilters()) {
        <button
          mat-icon-button
          (click)="clearFilters.emit()"
          class="clear-icon-btn"
          type="button"
        >
          <mat-icon class="!text-base">close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      flex: 1;
    }

    /* ── Desktop ── */
    .filter-fields {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .mobile-toggle {
      display: none;
    }

    .backdrop {
      display: none;
    }

    .clear-btn {
      color: #6b7280;
    }

    :host-context(.dark) .clear-btn {
      color: #9ca3af;
    }

    /* ── Mobile ── */
    @media (max-width: 767.98px) {
      .filter-fields {
        display: none;
      }

      .filter-fields.expanded {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        position: fixed;
        left: 1rem;
        right: 1rem;
        top: 5rem;
        z-index: 50;
        background: white;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
          0 8px 10px -6px rgb(0 0 0 / 0.1);
        border: 1px solid #e5e7eb;
        max-height: 80vh;
        overflow-y: auto;
      }

      :host-context(.dark) .filter-fields.expanded {
        background: #1f2937;
        border-color: #374151;
      }

      .mobile-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .backdrop {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 40;
        background: rgb(0 0 0 / 0.4);
      }

      .active-filters {
        color: #2563eb;
      }

      .clear-icon-btn {
        color: #6b7280;
        width: 2rem;
        height: 2rem;
        min-width: 0;
      }

      :host-context(.dark) .clear-icon-btn {
        color: #9ca3af;
      }
    }
  `,
})
export class MobileFilterBarComponent {
  readonly hasActiveFilters = input(false);
  readonly clearFilters = output<void>();
  readonly expanded = signal(false);

  onClearFilters(): void {
    this.clearFilters.emit();
    this.expanded.set(false);
  }
}
