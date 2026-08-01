import {
  Component,
  computed,
  input,
  output,
  signal,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { CopyFieldComponent } from '../copy-field/copy-field.component';

export interface MobileCardField {
  label: string;
  value: string;
  type?: 'phone' | 'email' | 'address' | 'text' | 'date';
}

@Component({
  selector: 'app-mobile-card',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    StatusBadgeComponent,
    CopyFieldComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    .swipe-root {
      position: relative;
      border-radius: 0.75rem;
      overflow: hidden;
    }

    .swipe-actions {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      z-index: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-out;
    }

    .action-edit {
      width: 80px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 2px;
      background: var(--color-primary, #1e40af);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .action-delete {
      margin-left: auto;
      width: 80px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 2px;
      background: var(--color-danger, #dc2626);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .swipe-card {
      position: relative;
      z-index: 1;
      background: #ffffff;
      border-radius: 0.75rem;
      will-change: transform;
      transition: transform 0.2s ease-out;
      overflow: hidden;
    }
    :host(.dark) .swipe-card {
      background: #1f2937;
    }
    .swipe-card.dragging {
      transition: none;
    }
  `,
  template: `
    <div
      class="swipe-root"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
    >
      <div class="swipe-actions" [style.opacity]="swiping() ? 1 : 0">
        <div class="action-edit">
          <mat-icon class="!w-5 !h-5">{{ editIcon() }}</mat-icon>
          <span>{{ editLabel() }}</span>
        </div>
        <div class="action-delete">
          <mat-icon class="!w-5 !h-5">delete</mat-icon>
          <span>Borrar</span>
        </div>
      </div>

      <mat-expansion-panel
        #panel
        class="swipe-card !shadow-sm !border !border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-gray-800 !mb-0"
        (opened)="panelExpanded.set(true)"
        (closed)="panelExpanded.set(false)"
      >
        <mat-expansion-panel-header class="!py-3">
          <mat-panel-title class="!flex !items-center !gap-3">
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">
              {{ title() }}
            </span>
            @if (status()) {
              <app-status-badge [value]="status()!" [type]="statusTypeCast()" />
            }
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="px-4 pb-4 space-y-0 divide-y divide-gray-100 dark:divide-gray-700">
          @for (field of fields(); track field.label) {
            <app-copy-field
              [label]="field.label"
              [value]="field.value"
              [type]="field.type || 'text'"
            />
          }

          @if (onEdit() || onDelete()) {
            <div class="flex items-center justify-end gap-2 pt-3">
              @if (onEdit()) {
                <button
                  mat-button
                  color="primary"
                  (click)="onEdit()!($event); $event.stopPropagation()"
                  class="!rounded-xl"
                >
                  <mat-icon class="!w-4 !h-4 !text-base mr-1">{{ editIcon() }}</mat-icon>
                  <span>{{ editLabel() }}</span>
                </button>
              }
              @if (onDelete()) {
                <button
                  mat-button
                  color="warn"
                  (click)="onDelete()!($event); $event.stopPropagation()"
                  class="!rounded-xl"
                >
                  <mat-icon class="!w-4 !h-4 !text-base mr-1">delete</mat-icon>
                  <span>Borrar</span>
                </button>
              }
            </div>
          }
        </div>
      </mat-expansion-panel>
    </div>
  `,
})
export class MobileCardComponent {
  private readonly el = inject(ElementRef);
  readonly panel = viewChild.required(MatExpansionPanel);

  readonly title = input.required<string>();
  readonly status = input<string | null>(null);
  readonly statusType = input<string>('workOrderStatus');
  readonly fields = input.required<MobileCardField[]>();
  readonly canSwipe = input(false);
  readonly editIcon = input<string>('edit');
  readonly editLabel = input<string>('Editar');
  readonly onEdit = input<((event: Event) => void) | null>(null);
  readonly onDelete = input<((event: Event) => void) | null>(null);

  readonly statusTypeCast = computed(() => this.statusType() as any);
  readonly panelExpanded = signal(false);

  private startX = 0;
  private currentX = 0;
  private startTime = 0;
  readonly swiping = signal(false);
  private moved = false;
  private static readonly SWIPE_THRESHOLD = 10;
  private static readonly TAP_MAX_MS = 200;

  private getCard(): HTMLElement {
    return this.el.nativeElement.querySelector('.swipe-card') as HTMLElement;
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.canSwipe()) return;
    if (this.panelExpanded()) return;
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
    this.startTime = Date.now();
    this.swiping.set(true);
    this.moved = false;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.swiping()) return;
    this.currentX = event.touches[0].clientX;
    const diff = this.currentX - this.startX;
    const elapsed = Date.now() - this.startTime;

    // Tap rápido (< 200ms) o movimiento mínimo → no es swipe
    if (
      elapsed < MobileCardComponent.TAP_MAX_MS &&
      Math.abs(diff) < MobileCardComponent.SWIPE_THRESHOLD
    )
      return;
    if (!this.moved && Math.abs(diff) < MobileCardComponent.SWIPE_THRESHOLD) return;
    this.moved = true;

    const clamped = Math.max(-80, Math.min(80, diff));
    const card = this.getCard();
    if (card) {
      card.style.transform = `translateX(${clamped}px)`;
      card.classList.add('dragging');
    }
  }

  onTouchEnd(): void {
    if (!this.swiping()) return;

    if (!this.moved) {
      this.swiping.set(false);
      return;
    }

    const card = this.getCard();
    if (!card) {
      this.swiping.set(false);
      return;
    }

    const diff = this.currentX - this.startX;
    card.classList.remove('dragging');

    if (diff <= -80) {
      card.style.transform = 'translateX(-80px)';
      setTimeout(() => {
        card.style.transform = 'translateX(0)';
        this.swiping.set(false);
        this.onDelete()?.(new Event('swipe'));
      }, 300);
    } else if (diff >= 80) {
      card.style.transform = 'translateX(80px)';
      setTimeout(() => {
        card.style.transform = 'translateX(0)';
        this.swiping.set(false);
        this.onEdit()?.(new Event('swipe'));
      }, 300);
    } else {
      card.style.transform = 'translateX(0)';
      this.swiping.set(false);
    }

    this.startX = 0;
    this.currentX = 0;
  }
}
