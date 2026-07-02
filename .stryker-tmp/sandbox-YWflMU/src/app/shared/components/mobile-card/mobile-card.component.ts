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
import { Component, computed, input, output, signal, ElementRef, inject, viewChild } from '@angular/core';
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
  imports: [MatExpansionModule, MatIconModule, MatButtonModule, StatusBadgeComponent, CopyFieldComponent],
  styles: `
    :host { display: block; }

    .swipe-root {
      position: relative;
      border-radius: 0.75rem;
      overflow: hidden;
    }

    .swipe-actions {
      position: absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      display: flex;
      z-index: 0;
      pointer-events: none;
    }

    .action-edit {
      width: 80px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 2px;
      background: var(--color-primary, #1E40AF); color: white;
      font-size: 0.7rem; font-weight: 600;
    }

    .action-delete {
      margin-left: auto; width: 80px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 2px;
      background: var(--color-danger, #DC2626); color: white;
      font-size: 0.7rem; font-weight: 600;
    }

    .swipe-card {
      position: relative;
      z-index: 1;
      background: #ffffff;
      border-radius: 0.75rem;
      will-change: transform;
      transition: transform 0.2s ease-out;
      overflow: visible !important;
    }
    :host(.dark) .swipe-card { background: #1f2937; }
    .swipe-card.dragging { transition: none; }
  `,
  template: `
    <div class="swipe-root"
         (touchstart)="onTouchStart($event)"
         (touchmove)="onTouchMove($event)"
         (touchend)="onTouchEnd()">

      <div class="swipe-actions">
        <div class="action-edit">
          <mat-icon class="!w-5 !h-5">edit</mat-icon>
          <span>Editar</span>
        </div>
        <div class="action-delete">
          <mat-icon class="!w-5 !h-5">delete</mat-icon>
          <span>Borrar</span>
        </div>
      </div>

      <mat-expansion-panel #panel class="swipe-card !shadow-sm !border !border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-gray-800"
        (opened)="panelExpanded.set(true)"
        (closed)="panelExpanded.set(false)">
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
            <app-copy-field [label]="field.label" [value]="field.value" [type]="field.type || 'text'" />
          }

          @if (onEdit() || onDelete()) {
            <div class="flex items-center justify-end gap-2 pt-3">
              @if (onEdit()) {
                <button mat-icon-button (click)="onEdit()!($event); $event.stopPropagation()" class="!w-9 !h-9">
                  <mat-icon class="!text-[18px]">edit</mat-icon>
                </button>
              }
              @if (onDelete()) {
                <button mat-icon-button color="warn" (click)="onDelete()!($event); $event.stopPropagation()" class="!w-9 !h-9">
                  <mat-icon class="!text-[18px]">delete</mat-icon>
                </button>
              }
            </div>
          }
        </div>
      </mat-expansion-panel>
    </div>
  `
})
export class MobileCardComponent {
  private readonly el = inject(ElementRef);
  readonly panel = viewChild.required(MatExpansionPanel);
  readonly title = input.required<string>();
  readonly status = input<string | null>(null);
  readonly statusType = input<string>(stryMutAct_9fa48("5942") ? "" : (stryCov_9fa48("5942"), 'workOrderStatus'));
  readonly fields = input.required<MobileCardField[]>();
  readonly canSwipe = input(stryMutAct_9fa48("5943") ? true : (stryCov_9fa48("5943"), false));
  readonly onEdit = input<((event: Event) => void) | null>(null);
  readonly onDelete = input<((event: Event) => void) | null>(null);
  readonly statusTypeCast = computed(stryMutAct_9fa48("5944") ? () => undefined : (stryCov_9fa48("5944"), () => this.statusType() as any));
  readonly panelExpanded = signal(stryMutAct_9fa48("5945") ? true : (stryCov_9fa48("5945"), false));
  private startX = 0;
  private currentX = 0;
  private startTime = 0;
  private swiping = stryMutAct_9fa48("5946") ? true : (stryCov_9fa48("5946"), false);
  private moved = stryMutAct_9fa48("5947") ? true : (stryCov_9fa48("5947"), false);
  private static readonly SWIPE_THRESHOLD = 10;
  private static readonly TAP_MAX_MS = 200;
  private getCard(): HTMLElement {
    if (stryMutAct_9fa48("5948")) {
      {}
    } else {
      stryCov_9fa48("5948");
      return this.el.nativeElement.querySelector('.swipe-card') as HTMLElement;
    }
  }
  onTouchStart(event: TouchEvent): void {
    if (stryMutAct_9fa48("5949")) {
      {}
    } else {
      stryCov_9fa48("5949");
      if (stryMutAct_9fa48("5952") ? false : stryMutAct_9fa48("5951") ? true : stryMutAct_9fa48("5950") ? this.canSwipe() : (stryCov_9fa48("5950", "5951", "5952"), !this.canSwipe())) return;
      if (stryMutAct_9fa48("5954") ? false : stryMutAct_9fa48("5953") ? true : (stryCov_9fa48("5953", "5954"), this.panelExpanded())) return;
      this.startX = event.touches[0].clientX;
      this.currentX = this.startX;
      this.startTime = Date.now();
      this.swiping = stryMutAct_9fa48("5955") ? false : (stryCov_9fa48("5955"), true);
      this.moved = stryMutAct_9fa48("5956") ? true : (stryCov_9fa48("5956"), false);
    }
  }
  onTouchMove(event: TouchEvent): void {
    if (stryMutAct_9fa48("5957")) {
      {}
    } else {
      stryCov_9fa48("5957");
      if (stryMutAct_9fa48("5960") ? false : stryMutAct_9fa48("5959") ? true : stryMutAct_9fa48("5958") ? this.swiping : (stryCov_9fa48("5958", "5959", "5960"), !this.swiping)) return;
      this.currentX = event.touches[0].clientX;
      const diff = stryMutAct_9fa48("5961") ? this.currentX + this.startX : (stryCov_9fa48("5961"), this.currentX - this.startX);
      const elapsed = stryMutAct_9fa48("5962") ? Date.now() + this.startTime : (stryCov_9fa48("5962"), Date.now() - this.startTime);

      // Tap rápido (< 200ms) o movimiento mínimo → no es swipe
      if (stryMutAct_9fa48("5965") ? elapsed < MobileCardComponent.TAP_MAX_MS || Math.abs(diff) < MobileCardComponent.SWIPE_THRESHOLD : stryMutAct_9fa48("5964") ? false : stryMutAct_9fa48("5963") ? true : (stryCov_9fa48("5963", "5964", "5965"), (stryMutAct_9fa48("5968") ? elapsed >= MobileCardComponent.TAP_MAX_MS : stryMutAct_9fa48("5967") ? elapsed <= MobileCardComponent.TAP_MAX_MS : stryMutAct_9fa48("5966") ? true : (stryCov_9fa48("5966", "5967", "5968"), elapsed < MobileCardComponent.TAP_MAX_MS)) && (stryMutAct_9fa48("5971") ? Math.abs(diff) >= MobileCardComponent.SWIPE_THRESHOLD : stryMutAct_9fa48("5970") ? Math.abs(diff) <= MobileCardComponent.SWIPE_THRESHOLD : stryMutAct_9fa48("5969") ? true : (stryCov_9fa48("5969", "5970", "5971"), Math.abs(diff) < MobileCardComponent.SWIPE_THRESHOLD)))) return;
      if (stryMutAct_9fa48("5974") ? !this.moved || Math.abs(diff) < MobileCardComponent.SWIPE_THRESHOLD : stryMutAct_9fa48("5973") ? false : stryMutAct_9fa48("5972") ? true : (stryCov_9fa48("5972", "5973", "5974"), (stryMutAct_9fa48("5975") ? this.moved : (stryCov_9fa48("5975"), !this.moved)) && (stryMutAct_9fa48("5978") ? Math.abs(diff) >= MobileCardComponent.SWIPE_THRESHOLD : stryMutAct_9fa48("5977") ? Math.abs(diff) <= MobileCardComponent.SWIPE_THRESHOLD : stryMutAct_9fa48("5976") ? true : (stryCov_9fa48("5976", "5977", "5978"), Math.abs(diff) < MobileCardComponent.SWIPE_THRESHOLD)))) return;
      this.moved = stryMutAct_9fa48("5979") ? false : (stryCov_9fa48("5979"), true);
      const clamped = stryMutAct_9fa48("5980") ? Math.min(-80, Math.min(80, diff)) : (stryCov_9fa48("5980"), Math.max(stryMutAct_9fa48("5981") ? +80 : (stryCov_9fa48("5981"), -80), stryMutAct_9fa48("5982") ? Math.max(80, diff) : (stryCov_9fa48("5982"), Math.min(80, diff))));
      const card = this.getCard();
      if (stryMutAct_9fa48("5984") ? false : stryMutAct_9fa48("5983") ? true : (stryCov_9fa48("5983", "5984"), card)) {
        if (stryMutAct_9fa48("5985")) {
          {}
        } else {
          stryCov_9fa48("5985");
          card.style.transform = stryMutAct_9fa48("5986") ? `` : (stryCov_9fa48("5986"), `translateX(${clamped}px)`);
          card.classList.add(stryMutAct_9fa48("5987") ? "" : (stryCov_9fa48("5987"), 'dragging'));
        }
      }
    }
  }
  onTouchEnd(): void {
    if (stryMutAct_9fa48("5988")) {
      {}
    } else {
      stryCov_9fa48("5988");
      if (stryMutAct_9fa48("5991") ? false : stryMutAct_9fa48("5990") ? true : stryMutAct_9fa48("5989") ? this.swiping : (stryCov_9fa48("5989", "5990", "5991"), !this.swiping)) return;
      this.swiping = stryMutAct_9fa48("5992") ? true : (stryCov_9fa48("5992"), false);
      if (stryMutAct_9fa48("5995") ? false : stryMutAct_9fa48("5994") ? true : stryMutAct_9fa48("5993") ? this.moved : (stryCov_9fa48("5993", "5994", "5995"), !this.moved)) return;
      const card = this.getCard();
      if (stryMutAct_9fa48("5998") ? false : stryMutAct_9fa48("5997") ? true : stryMutAct_9fa48("5996") ? card : (stryCov_9fa48("5996", "5997", "5998"), !card)) return;
      const diff = stryMutAct_9fa48("5999") ? this.currentX + this.startX : (stryCov_9fa48("5999"), this.currentX - this.startX);
      card.classList.remove(stryMutAct_9fa48("6000") ? "" : (stryCov_9fa48("6000"), 'dragging'));
      if (stryMutAct_9fa48("6004") ? diff > -80 : stryMutAct_9fa48("6003") ? diff < -80 : stryMutAct_9fa48("6002") ? false : stryMutAct_9fa48("6001") ? true : (stryCov_9fa48("6001", "6002", "6003", "6004"), diff <= (stryMutAct_9fa48("6005") ? +80 : (stryCov_9fa48("6005"), -80)))) {
        if (stryMutAct_9fa48("6006")) {
          {}
        } else {
          stryCov_9fa48("6006");
          card.style.transform = stryMutAct_9fa48("6007") ? "" : (stryCov_9fa48("6007"), 'translateX(-80px)');
          setTimeout(() => {
            if (stryMutAct_9fa48("6008")) {
              {}
            } else {
              stryCov_9fa48("6008");
              card.style.transform = stryMutAct_9fa48("6009") ? "" : (stryCov_9fa48("6009"), 'translateX(0)');
              stryMutAct_9fa48("6010") ? this.onDelete()(new Event('swipe')) : (stryCov_9fa48("6010"), this.onDelete()?.(new Event(stryMutAct_9fa48("6011") ? "" : (stryCov_9fa48("6011"), 'swipe'))));
            }
          }, 300);
        }
      } else if (stryMutAct_9fa48("6015") ? diff < 80 : stryMutAct_9fa48("6014") ? diff > 80 : stryMutAct_9fa48("6013") ? false : stryMutAct_9fa48("6012") ? true : (stryCov_9fa48("6012", "6013", "6014", "6015"), diff >= 80)) {
        if (stryMutAct_9fa48("6016")) {
          {}
        } else {
          stryCov_9fa48("6016");
          card.style.transform = stryMutAct_9fa48("6017") ? "" : (stryCov_9fa48("6017"), 'translateX(80px)');
          setTimeout(() => {
            if (stryMutAct_9fa48("6018")) {
              {}
            } else {
              stryCov_9fa48("6018");
              card.style.transform = stryMutAct_9fa48("6019") ? "" : (stryCov_9fa48("6019"), 'translateX(0)');
              stryMutAct_9fa48("6020") ? this.onEdit()(new Event('swipe')) : (stryCov_9fa48("6020"), this.onEdit()?.(new Event(stryMutAct_9fa48("6021") ? "" : (stryCov_9fa48("6021"), 'swipe'))));
            }
          }, 300);
        }
      } else {
        if (stryMutAct_9fa48("6022")) {
          {}
        } else {
          stryCov_9fa48("6022");
          card.style.transform = stryMutAct_9fa48("6023") ? "" : (stryCov_9fa48("6023"), 'translateX(0)');
        }
      }
      this.startX = 0;
      this.currentX = 0;
    }
  }
}