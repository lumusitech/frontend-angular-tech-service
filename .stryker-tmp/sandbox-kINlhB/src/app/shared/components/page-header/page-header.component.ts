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
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-page-header',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <ng-content></ng-content>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ title() }}</h1>
          @if (subtitle()) {
            <p class="text-[var(--color-secondary)] dark:text-[var(--color-secondary)] opacity-80 mt-1">{{ subtitle() }}</p>
          }
        </div>
      </div>
      @if (actionLabel()) {
        <button mat-flat-button color="primary" (click)="onAction()">
          @if (actionIcon()) {
            <mat-icon>{{ actionIcon() }}</mat-icon>
          }
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>(stryMutAct_9fa48("6056") ? "Stryker was here!" : (stryCov_9fa48("6056"), ''));
  actionLabel = input<string>(stryMutAct_9fa48("6057") ? "Stryker was here!" : (stryCov_9fa48("6057"), ''));
  actionIcon = input<string>(stryMutAct_9fa48("6058") ? "Stryker was here!" : (stryCov_9fa48("6058"), ''));
  action = input<() => void>();
  onAction(): void {
    if (stryMutAct_9fa48("6059")) {
      {}
    } else {
      stryCov_9fa48("6059");
      const fn = this.action();
      if (stryMutAct_9fa48("6061") ? false : stryMutAct_9fa48("6060") ? true : (stryCov_9fa48("6060", "6061"), fn)) fn();
    }
  }
}