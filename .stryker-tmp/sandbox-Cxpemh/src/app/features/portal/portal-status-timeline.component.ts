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
import { Component, input, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface TimelineStep {
  key: string;
  labelKey: string;
}
const TIMELINE_STEPS: TimelineStep[] = stryMutAct_9fa48("3581") ? [] : (stryCov_9fa48("3581"), [stryMutAct_9fa48("3582") ? {} : (stryCov_9fa48("3582"), {
  key: stryMutAct_9fa48("3583") ? "" : (stryCov_9fa48("3583"), 'pending'),
  labelKey: stryMutAct_9fa48("3584") ? "" : (stryCov_9fa48("3584"), 'portal.timeline.pending')
}), stryMutAct_9fa48("3585") ? {} : (stryCov_9fa48("3585"), {
  key: stryMutAct_9fa48("3586") ? "" : (stryCov_9fa48("3586"), 'assigned'),
  labelKey: stryMutAct_9fa48("3587") ? "" : (stryCov_9fa48("3587"), 'portal.timeline.assigned')
}), stryMutAct_9fa48("3588") ? {} : (stryCov_9fa48("3588"), {
  key: stryMutAct_9fa48("3589") ? "" : (stryCov_9fa48("3589"), 'in_progress'),
  labelKey: stryMutAct_9fa48("3590") ? "" : (stryCov_9fa48("3590"), 'portal.timeline.inProgress')
}), stryMutAct_9fa48("3591") ? {} : (stryCov_9fa48("3591"), {
  key: stryMutAct_9fa48("3592") ? "" : (stryCov_9fa48("3592"), 'completed'),
  labelKey: stryMutAct_9fa48("3593") ? "" : (stryCov_9fa48("3593"), 'portal.timeline.completed')
}), stryMutAct_9fa48("3594") ? {} : (stryCov_9fa48("3594"), {
  key: stryMutAct_9fa48("3595") ? "" : (stryCov_9fa48("3595"), 'delivered'),
  labelKey: stryMutAct_9fa48("3596") ? "" : (stryCov_9fa48("3596"), 'portal.timeline.delivered')
})]);
const STATUS_INDEX: Record<string, number> = stryMutAct_9fa48("3597") ? {} : (stryCov_9fa48("3597"), {
  pending: 0,
  assigned: 1,
  in_progress: 2,
  completed: 3,
  delivered: 4,
  postponed: 2,
  cancelled: stryMutAct_9fa48("3598") ? +1 : (stryCov_9fa48("3598"), -1)
});
@Component({
  selector: 'app-portal-status-timeline',
  imports: [MatIconModule, MatCardModule, TranslatePipe],
  template: `
    @if (isCancelled()) {
      <div class="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 px-4 py-3 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
          <mat-icon class="!w-4 !h-4 text-red-600 dark:text-red-400">close</mat-icon>
        </div>
        <span class="text-sm font-medium text-red-700 dark:text-red-300">
          {{ 'portal.timeline.cancelled' | translate }}
        </span>
      </div>
    } @else if (isPostponed()) {
      <div class="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 px-4 py-3 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
          <mat-icon class="!w-4 !h-4 text-amber-600 dark:text-amber-400">pause</mat-icon>
        </div>
        <span class="text-sm font-medium text-amber-700 dark:text-amber-300">
          {{ 'portal.timeline.postponed' | translate }}
        </span>
      </div>
    } @else {
      <mat-card>
        <mat-card-content class="!p-5">
          <div class="flex justify-between relative">
            <div class="absolute top-[18px] left-[18px] right-[18px] h-[2px] bg-gray-200 dark:bg-gray-700 z-0 rounded-full"></div>
            @for (step of steps(); track step.key; let i = $index) {
              <div class="flex flex-col items-center gap-2.5 relative z-10 w-[36px]">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                  [class]="getStepClasses(i)"
                >
                  @if (isCompleted(i)) {
                    <mat-icon class="!w-[18px] !h-[18px] !text-[18px]">check</mat-icon>
                  } @else if (isCurrent(i)) {
                    <span class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                  } @else {
                    <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ i + 1 }}</span>
                  }
                </div>
                <span
                  class="text-[10px] font-medium whitespace-nowrap text-center leading-tight"
                  [class]="getLabelClasses(i)"
                >
                  {{ step.labelKey | translate }}
                </span>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    }
  `
})
export class PortalStatusTimelineComponent {
  readonly status = input.required<string>();
  readonly steps = computed(stryMutAct_9fa48("3599") ? () => undefined : (stryCov_9fa48("3599"), () => TIMELINE_STEPS));
  readonly currentIndex = computed(stryMutAct_9fa48("3600") ? () => undefined : (stryCov_9fa48("3600"), () => stryMutAct_9fa48("3601") ? STATUS_INDEX[this.status()] && 0 : (stryCov_9fa48("3601"), STATUS_INDEX[this.status()] ?? 0)));
  readonly isCancelled = computed(stryMutAct_9fa48("3602") ? () => undefined : (stryCov_9fa48("3602"), () => stryMutAct_9fa48("3605") ? this.status() !== 'cancelled' : stryMutAct_9fa48("3604") ? false : stryMutAct_9fa48("3603") ? true : (stryCov_9fa48("3603", "3604", "3605"), this.status() === (stryMutAct_9fa48("3606") ? "" : (stryCov_9fa48("3606"), 'cancelled')))));
  readonly isPostponed = computed(stryMutAct_9fa48("3607") ? () => undefined : (stryCov_9fa48("3607"), () => stryMutAct_9fa48("3610") ? this.status() !== 'postponed' : stryMutAct_9fa48("3609") ? false : stryMutAct_9fa48("3608") ? true : (stryCov_9fa48("3608", "3609", "3610"), this.status() === (stryMutAct_9fa48("3611") ? "" : (stryCov_9fa48("3611"), 'postponed')))));
  isCompleted(index: number): boolean {
    if (stryMutAct_9fa48("3612")) {
      {}
    } else {
      stryCov_9fa48("3612");
      return stryMutAct_9fa48("3616") ? index >= this.currentIndex() : stryMutAct_9fa48("3615") ? index <= this.currentIndex() : stryMutAct_9fa48("3614") ? false : stryMutAct_9fa48("3613") ? true : (stryCov_9fa48("3613", "3614", "3615", "3616"), index < this.currentIndex());
    }
  }
  isCurrent(index: number): boolean {
    if (stryMutAct_9fa48("3617")) {
      {}
    } else {
      stryCov_9fa48("3617");
      return stryMutAct_9fa48("3620") ? index !== this.currentIndex() : stryMutAct_9fa48("3619") ? false : stryMutAct_9fa48("3618") ? true : (stryCov_9fa48("3618", "3619", "3620"), index === this.currentIndex());
    }
  }
  getStepClasses(index: number): string {
    if (stryMutAct_9fa48("3621")) {
      {}
    } else {
      stryCov_9fa48("3621");
      if (stryMutAct_9fa48("3623") ? false : stryMutAct_9fa48("3622") ? true : (stryCov_9fa48("3622", "3623"), this.isCompleted(index))) {
        if (stryMutAct_9fa48("3624")) {
          {}
        } else {
          stryCov_9fa48("3624");
          return stryMutAct_9fa48("3625") ? "" : (stryCov_9fa48("3625"), 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20');
        }
      }
      if (stryMutAct_9fa48("3627") ? false : stryMutAct_9fa48("3626") ? true : (stryCov_9fa48("3626", "3627"), this.isCurrent(index))) {
        if (stryMutAct_9fa48("3628")) {
          {}
        } else {
          stryCov_9fa48("3628");
          return stryMutAct_9fa48("3629") ? "" : (stryCov_9fa48("3629"), 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100 dark:ring-blue-900/50 animate-pulse');
        }
      }
      return stryMutAct_9fa48("3630") ? "" : (stryCov_9fa48("3630"), 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500');
    }
  }
  getLabelClasses(index: number): string {
    if (stryMutAct_9fa48("3631")) {
      {}
    } else {
      stryCov_9fa48("3631");
      if (stryMutAct_9fa48("3633") ? false : stryMutAct_9fa48("3632") ? true : (stryCov_9fa48("3632", "3633"), this.isCompleted(index))) {
        if (stryMutAct_9fa48("3634")) {
          {}
        } else {
          stryCov_9fa48("3634");
          return stryMutAct_9fa48("3635") ? "" : (stryCov_9fa48("3635"), 'text-emerald-600 dark:text-emerald-400');
        }
      }
      if (stryMutAct_9fa48("3637") ? false : stryMutAct_9fa48("3636") ? true : (stryCov_9fa48("3636", "3637"), this.isCurrent(index))) {
        if (stryMutAct_9fa48("3638")) {
          {}
        } else {
          stryCov_9fa48("3638");
          return stryMutAct_9fa48("3639") ? "" : (stryCov_9fa48("3639"), 'text-blue-600 dark:text-blue-400');
        }
      }
      return stryMutAct_9fa48("3640") ? "" : (stryCov_9fa48("3640"), 'text-gray-500 dark:text-gray-400');
    }
  }
}