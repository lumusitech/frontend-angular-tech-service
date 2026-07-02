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
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-landing-features',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <section id="features" class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">{{ 'landing.features.title' | translate }}</h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{{ 'landing.features.subtitle' | translate }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (feature of features; track feature.key) {
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                <mat-icon class="!w-5 !h-5 text-blue-600 dark:text-blue-400">{{ feature.icon }}</mat-icon>
              </div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">{{ 'landing.features.items.' + feature.key + '.title' | translate }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ 'landing.features.items.' + feature.key + '.description' | translate }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class LandingFeaturesComponent {
  readonly features = stryMutAct_9fa48("2802") ? [] : (stryCov_9fa48("2802"), [stryMutAct_9fa48("2803") ? {} : (stryCov_9fa48("2803"), {
    key: stryMutAct_9fa48("2804") ? "" : (stryCov_9fa48("2804"), 'workOrders'),
    icon: stryMutAct_9fa48("2805") ? "" : (stryCov_9fa48("2805"), 'assignment')
  }), stryMutAct_9fa48("2806") ? {} : (stryCov_9fa48("2806"), {
    key: stryMutAct_9fa48("2807") ? "" : (stryCov_9fa48("2807"), 'tracking'),
    icon: stryMutAct_9fa48("2808") ? "" : (stryCov_9fa48("2808"), 'pin_drop')
  }), stryMutAct_9fa48("2809") ? {} : (stryCov_9fa48("2809"), {
    key: stryMutAct_9fa48("2810") ? "" : (stryCov_9fa48("2810"), 'payments'),
    icon: stryMutAct_9fa48("2811") ? "" : (stryCov_9fa48("2811"), 'receipt_long')
  }), stryMutAct_9fa48("2812") ? {} : (stryCov_9fa48("2812"), {
    key: stryMutAct_9fa48("2813") ? "" : (stryCov_9fa48("2813"), 'dashboard'),
    icon: stryMutAct_9fa48("2814") ? "" : (stryCov_9fa48("2814"), 'bar_chart')
  }), stryMutAct_9fa48("2815") ? {} : (stryCov_9fa48("2815"), {
    key: stryMutAct_9fa48("2816") ? "" : (stryCov_9fa48("2816"), 'multiTenant'),
    icon: stryMutAct_9fa48("2817") ? "" : (stryCov_9fa48("2817"), 'business')
  }), stryMutAct_9fa48("2818") ? {} : (stryCov_9fa48("2818"), {
    key: stryMutAct_9fa48("2819") ? "" : (stryCov_9fa48("2819"), 'notifications'),
    icon: stryMutAct_9fa48("2820") ? "" : (stryCov_9fa48("2820"), 'notifications_active')
  })]);
}