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
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';
interface SellerNavTab {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
@Component({
  selector: 'app-seller-bottom-nav',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <nav
      class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 pb-2"
      aria-label="Navegación del vendedor"
    >
      <div class="flex items-center justify-around h-16 max-w-md mx-auto">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="navigate(tab.path)"
            class="flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg transition-colors"
            [class]="isActive(tab.id) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            [attr.aria-current]="isActive(tab.id) ? 'page' : null"
          >
            <mat-icon class="!w-6 !h-6 text-[1.5rem]">{{ tab.icon }}</mat-icon>
            <span class="text-[10px] font-medium">{{ tab.labelKey | translate }}</span>
          </button>
        }
      </div>
    </nav>
  `
})
export class SellerBottomNavComponent {
  private readonly router = inject(Router);
  readonly tabs: SellerNavTab[] = stryMutAct_9fa48("6062") ? [] : (stryCov_9fa48("6062"), [stryMutAct_9fa48("6063") ? {} : (stryCov_9fa48("6063"), {
    id: stryMutAct_9fa48("6064") ? "" : (stryCov_9fa48("6064"), 'dashboard'),
    path: stryMutAct_9fa48("6065") ? "" : (stryCov_9fa48("6065"), '/seller'),
    icon: stryMutAct_9fa48("6066") ? "" : (stryCov_9fa48("6066"), 'dashboard'),
    labelKey: stryMutAct_9fa48("6067") ? "" : (stryCov_9fa48("6067"), 'seller.nav.dashboard')
  }), stryMutAct_9fa48("6068") ? {} : (stryCov_9fa48("6068"), {
    id: stryMutAct_9fa48("6069") ? "" : (stryCov_9fa48("6069"), 'orders'),
    path: stryMutAct_9fa48("6070") ? "" : (stryCov_9fa48("6070"), '/seller/orders'),
    icon: stryMutAct_9fa48("6071") ? "" : (stryCov_9fa48("6071"), 'assignment'),
    labelKey: stryMutAct_9fa48("6072") ? "" : (stryCov_9fa48("6072"), 'seller.nav.orders')
  }), stryMutAct_9fa48("6073") ? {} : (stryCov_9fa48("6073"), {
    id: stryMutAct_9fa48("6074") ? "" : (stryCov_9fa48("6074"), 'profile'),
    path: stryMutAct_9fa48("6075") ? "" : (stryCov_9fa48("6075"), '/seller/settings'),
    icon: stryMutAct_9fa48("6076") ? "" : (stryCov_9fa48("6076"), 'person'),
    labelKey: stryMutAct_9fa48("6077") ? "" : (stryCov_9fa48("6077"), 'seller.nav.profile')
  })]);
  readonly activeTab = computed(() => {
    if (stryMutAct_9fa48("6078")) {
      {}
    } else {
      stryCov_9fa48("6078");
      const url = this.router.url;
      if (stryMutAct_9fa48("6081") ? url.endsWith('/seller/orders') : stryMutAct_9fa48("6080") ? false : stryMutAct_9fa48("6079") ? true : (stryCov_9fa48("6079", "6080", "6081"), url.startsWith(stryMutAct_9fa48("6082") ? "" : (stryCov_9fa48("6082"), '/seller/orders')))) return stryMutAct_9fa48("6083") ? "" : (stryCov_9fa48("6083"), 'orders');
      if (stryMutAct_9fa48("6086") ? url.endsWith('/seller/settings') : stryMutAct_9fa48("6085") ? false : stryMutAct_9fa48("6084") ? true : (stryCov_9fa48("6084", "6085", "6086"), url.startsWith(stryMutAct_9fa48("6087") ? "" : (stryCov_9fa48("6087"), '/seller/settings')))) return stryMutAct_9fa48("6088") ? "" : (stryCov_9fa48("6088"), 'profile');
      return stryMutAct_9fa48("6089") ? "" : (stryCov_9fa48("6089"), 'dashboard');
    }
  });
  isActive(tabId: string): boolean {
    if (stryMutAct_9fa48("6090")) {
      {}
    } else {
      stryCov_9fa48("6090");
      return stryMutAct_9fa48("6093") ? this.activeTab() !== tabId : stryMutAct_9fa48("6092") ? false : stryMutAct_9fa48("6091") ? true : (stryCov_9fa48("6091", "6092", "6093"), this.activeTab() === tabId);
    }
  }
  navigate(path: string): void {
    if (stryMutAct_9fa48("6094")) {
      {}
    } else {
      stryCov_9fa48("6094");
      this.router.navigate(stryMutAct_9fa48("6095") ? [] : (stryCov_9fa48("6095"), [path]));
    }
  }
}