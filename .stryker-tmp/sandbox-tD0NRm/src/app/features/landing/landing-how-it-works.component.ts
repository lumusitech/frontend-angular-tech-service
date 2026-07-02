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
  selector: 'app-landing-how-it-works',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <section id="how-it-works" class="py-16 md:py-24">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {{ 'landing.howItWorks.title' | translate }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {{ 'landing.howItWorks.subtitle' | translate }}
          </p>
        </div>
        <div class="relative isolate">
          <div
            class="hidden md:block absolute top-10 left-[calc(12.5%+40px)] w-[calc(25%-80px)] h-0.5 bg-gray-200 dark:bg-gray-700 z-0"
          ></div>
          <div
            class="hidden md:block absolute top-10 left-[calc(37.5%+40px)] w-[calc(25%-80px)] h-0.5 bg-gray-200 dark:bg-gray-700 z-0"
          ></div>
          <div
            class="hidden md:block absolute top-10 left-[calc(62.5%+40px)] w-[calc(25%-80px)] h-0.5 bg-gray-200 dark:bg-gray-700 z-0"
          ></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            @for (step of steps; track step.number) {
              <div class="flex flex-col items-center text-center relative">
                <div
                  class="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 border-4 border-white dark:border-gray-950 flex items-center justify-center mb-4"
                >
                  <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{
                    step.number
                  }}</span>
                </div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {{ 'landing.howItWorks.steps.' + step.number + '.title' | translate }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 max-w-50">
                  {{ 'landing.howItWorks.steps.' + step.number + '.description' | translate }}
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingHowItWorksComponent {
  readonly steps = stryMutAct_9fa48("2821") ? [] : (stryCov_9fa48("2821"), [stryMutAct_9fa48("2822") ? {} : (stryCov_9fa48("2822"), {
    number: 1,
    icon: stryMutAct_9fa48("2823") ? "" : (stryCov_9fa48("2823"), 'edit_note')
  }), stryMutAct_9fa48("2824") ? {} : (stryCov_9fa48("2824"), {
    number: 2,
    icon: stryMutAct_9fa48("2825") ? "" : (stryCov_9fa48("2825"), 'person_add')
  }), stryMutAct_9fa48("2826") ? {} : (stryCov_9fa48("2826"), {
    number: 3,
    icon: stryMutAct_9fa48("2827") ? "" : (stryCov_9fa48("2827"), 'qr_code_scanner')
  }), stryMutAct_9fa48("2828") ? {} : (stryCov_9fa48("2828"), {
    number: 4,
    icon: stryMutAct_9fa48("2829") ? "" : (stryCov_9fa48("2829"), 'payments')
  })]);
}