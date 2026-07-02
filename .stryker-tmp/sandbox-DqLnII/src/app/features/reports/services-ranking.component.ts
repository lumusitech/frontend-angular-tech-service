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
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { ServicesReport } from '../../core/models/report.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-services-ranking',
  imports: [CurrencyArsPipe, TranslatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6" [style.border-left-color]="'var(--color-primary)'">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {{ 'reports.topServices' | translate }}
      </h3>
      <div class="space-y-3">
        @for (service of data().services; track service.name; let i = $index) {
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold w-6 text-center"
                  [style.color]="i === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'">
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ service.name }}
                </p>
                <p class="text-sm text-gray-900 dark:text-gray-100 ml-2">
                  {{ service.revenue | currencyArs: '1.2-2' }}
                </p>
              </div>
              <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  [style.background-color]="i === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'"
                  [style.width.%]="getBarWidth(service.revenue)"
                ></div>
              </div>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {{ service.count }} {{ 'reports.completedOrders' | translate }}
              </p>
            </div>
          </div>
        }
        @if (data().services.length === 0) {
          <p class="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            {{ 'common.noResults' | translate }}
          </p>
        }
      </div>
    </div>
  `
})
export class ServicesRankingComponent {
  data = input.required<ServicesReport>();
  getBarWidth(revenue: number): number {
    if (stryMutAct_9fa48("4053")) {
      {}
    } else {
      stryCov_9fa48("4053");
      const maxRevenue = stryMutAct_9fa48("4054") ? Math.min(...this.data().services.map(s => s.revenue), 1) : (stryCov_9fa48("4054"), Math.max(...this.data().services.map(stryMutAct_9fa48("4055") ? () => undefined : (stryCov_9fa48("4055"), s => s.revenue)), 1));
      return stryMutAct_9fa48("4056") ? revenue / maxRevenue / 100 : (stryCov_9fa48("4056"), (stryMutAct_9fa48("4057") ? revenue * maxRevenue : (stryCov_9fa48("4057"), revenue / maxRevenue)) * 100);
    }
  }
}