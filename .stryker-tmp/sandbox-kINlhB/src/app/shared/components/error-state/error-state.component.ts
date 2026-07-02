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
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';
@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div
        class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4"
      >
        <mat-icon class="text-red-500 dark:text-red-400 text-3xl">error_outline</mat-icon>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {{ title() || ('common.errorLoading' | translate) }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {{ message() || ('common.errorMessage' | translate) }}
      </p>
      <button mat-stroked-button color="primary" (click)="retry.emit()">
        <mat-icon>refresh</mat-icon>
        {{ 'common.retry' | translate }}
      </button>
    </div>
  `
})
export class ErrorStateComponent {
  title = input<string>(stryMutAct_9fa48("5884") ? "Stryker was here!" : (stryCov_9fa48("5884"), ''));
  message = input<string>(stryMutAct_9fa48("5885") ? "Stryker was here!" : (stryCov_9fa48("5885"), ''));
  retry = output<void>();
}