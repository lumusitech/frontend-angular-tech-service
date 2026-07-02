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
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-portal-search',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, TranslatePipe],
  template: `
    <div class="flex-1 flex flex-col items-center justify-center gap-6">
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center">
          <mat-icon class="!w-7 !h-7 text-blue-600 dark:text-blue-400">manage_search</mat-icon>
        </div>
        <div class="text-center space-y-1.5">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {{ 'portal.search.title' | translate }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            {{ 'portal.search.subtitle' | translate }}
          </p>
        </div>
      </div>

      <div class="w-full max-w-sm">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'portal.search.placeholder' | translate }}</mat-label>
          <mat-icon matPrefix class="!mr-2 !text-gray-400 dark:!text-gray-500">search</mat-icon>
          <input
            matInput
            [(ngModel)]="trackingCode"
            (keyup.enter)="onTrack()"
            placeholder="TS-A1B2C3"
          />
        </mat-form-field>
        <p class="text-xs text-center text-gray-400 dark:text-gray-500 -mt-3">
          {{ 'portal.search.example' | translate }}
        </p>
      </div>
    </div>
  `
})
export class PortalSearchComponent {
  readonly track = output<string>();
  trackingCode = stryMutAct_9fa48("3575") ? "Stryker was here!" : (stryCov_9fa48("3575"), '');
  onTrack(): void {
    if (stryMutAct_9fa48("3576")) {
      {}
    } else {
      stryCov_9fa48("3576");
      const code = stryMutAct_9fa48("3577") ? this.trackingCode : (stryCov_9fa48("3577"), this.trackingCode.trim());
      if (stryMutAct_9fa48("3579") ? false : stryMutAct_9fa48("3578") ? true : (stryCov_9fa48("3578", "3579"), code)) {
        if (stryMutAct_9fa48("3580")) {
          {}
        } else {
          stryCov_9fa48("3580");
          this.track.emit(code);
        }
      }
    }
  }
}