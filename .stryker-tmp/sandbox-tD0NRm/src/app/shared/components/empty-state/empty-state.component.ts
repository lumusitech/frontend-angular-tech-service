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
import { TranslatePipe } from '../../pipes/translate.pipe';
@Component({
  selector: 'app-empty-state',
  imports: [TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div
        class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        [style.background-color]="'color-mix(in srgb, var(--color-secondary) 12%, transparent)'"
      >
        <svg
          class="w-8 h-8"
          [style.color]="'var(--color-secondary)'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {{ title() || ('common.noResults' | translate) }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {{ message() || ('common.noResultsMessage' | translate) }}
      </p>
      @if (actionLabel()) {
        <button
          (click)="onAction()"
          class="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
          [style.background-color]="'var(--color-secondary)'"
        >
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  title = input<string>(stryMutAct_9fa48("5877") ? "Stryker was here!" : (stryCov_9fa48("5877"), ''));
  message = input<string>(stryMutAct_9fa48("5878") ? "Stryker was here!" : (stryCov_9fa48("5878"), ''));
  actionLabel = input<string>(stryMutAct_9fa48("5879") ? "Stryker was here!" : (stryCov_9fa48("5879"), ''));
  action = input<() => void>();
  onAction(): void {
    if (stryMutAct_9fa48("5880")) {
      {}
    } else {
      stryCov_9fa48("5880");
      const actionFn = this.action();
      if (stryMutAct_9fa48("5882") ? false : stryMutAct_9fa48("5881") ? true : (stryCov_9fa48("5881", "5882"), actionFn)) {
        if (stryMutAct_9fa48("5883")) {
          {}
        } else {
          stryCov_9fa48("5883");
          actionFn();
        }
      }
    }
  }
}