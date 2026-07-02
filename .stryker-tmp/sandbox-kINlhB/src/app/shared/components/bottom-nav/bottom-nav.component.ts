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
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { NotificationsService } from '../../../core/services/notifications.service';
import { filter } from 'rxjs';
interface TechNavTab {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
@Component({
  selector: 'app-bottom-nav',
  imports: [MatIconModule, MatBadgeModule, TranslatePipe],
  template: `
    <nav
      class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 pb-2"
      aria-label="Navegación del técnico"
    >
      <div class="flex items-center justify-around h-16 max-w-md mx-auto">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="navigate(tab.path)"
            class="flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg transition-colors"
            [class]="isActive(tab.id) ? 'text-[var(--color-secondary)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            [attr.aria-current]="isActive(tab.id) ? 'page' : null"
          >
            <div class="relative">
              <mat-icon class="!w-6 !h-6 text-[1.5rem]">{{ tab.icon }}</mat-icon>
              @if (tab.id === 'notifications' && notificationsService.unreadCount() > 0) {
                <span
                  class="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
                >
                  {{ notificationsService.unreadCount() }}
                </span>
              }
            </div>
            <span class="text-[10px] font-medium">{{ tab.labelKey | translate }}</span>
          </button>
        }
      </div>
    </nav>
  `
})
export class BottomNavComponent {
  private readonly router = inject(Router);
  readonly notificationsService = inject(NotificationsService);
  readonly tabs: TechNavTab[] = stryMutAct_9fa48("5767") ? [] : (stryCov_9fa48("5767"), [stryMutAct_9fa48("5768") ? {} : (stryCov_9fa48("5768"), {
    id: stryMutAct_9fa48("5769") ? "" : (stryCov_9fa48("5769"), 'orders'),
    path: stryMutAct_9fa48("5770") ? "" : (stryCov_9fa48("5770"), '/tech'),
    icon: stryMutAct_9fa48("5771") ? "" : (stryCov_9fa48("5771"), 'assignment'),
    labelKey: stryMutAct_9fa48("5772") ? "" : (stryCov_9fa48("5772"), 'technician.nav.orders')
  }), stryMutAct_9fa48("5773") ? {} : (stryCov_9fa48("5773"), {
    id: stryMutAct_9fa48("5774") ? "" : (stryCov_9fa48("5774"), 'notifications'),
    path: stryMutAct_9fa48("5775") ? "" : (stryCov_9fa48("5775"), '/tech/notifications'),
    icon: stryMutAct_9fa48("5776") ? "" : (stryCov_9fa48("5776"), 'notifications'),
    labelKey: stryMutAct_9fa48("5777") ? "" : (stryCov_9fa48("5777"), 'technician.nav.notifications')
  }), stryMutAct_9fa48("5778") ? {} : (stryCov_9fa48("5778"), {
    id: stryMutAct_9fa48("5779") ? "" : (stryCov_9fa48("5779"), 'profile'),
    path: stryMutAct_9fa48("5780") ? "" : (stryCov_9fa48("5780"), '/tech/profile'),
    icon: stryMutAct_9fa48("5781") ? "" : (stryCov_9fa48("5781"), 'person'),
    labelKey: stryMutAct_9fa48("5782") ? "" : (stryCov_9fa48("5782"), 'technician.nav.profile')
  })]);
  readonly currentUrl = signal(this.router.url);
  constructor() {
    if (stryMutAct_9fa48("5783")) {
      {}
    } else {
      stryCov_9fa48("5783");
      this.router.events.pipe(filter(stryMutAct_9fa48("5784") ? () => undefined : (stryCov_9fa48("5784"), event => event instanceof NavigationEnd))).subscribe(event => {
        if (stryMutAct_9fa48("5785")) {
          {}
        } else {
          stryCov_9fa48("5785");
          this.currentUrl.set(stryMutAct_9fa48("5788") ? (event as NavigationEnd).urlAfterRedirects && (event as NavigationEnd).url : stryMutAct_9fa48("5787") ? false : stryMutAct_9fa48("5786") ? true : (stryCov_9fa48("5786", "5787", "5788"), (event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url));
        }
      });
    }
  }
  isActive(tabId: string): boolean {
    if (stryMutAct_9fa48("5789")) {
      {}
    } else {
      stryCov_9fa48("5789");
      const url = this.currentUrl();
      if (stryMutAct_9fa48("5792") ? tabId !== 'notifications' : stryMutAct_9fa48("5791") ? false : stryMutAct_9fa48("5790") ? true : (stryCov_9fa48("5790", "5791", "5792"), tabId === (stryMutAct_9fa48("5793") ? "" : (stryCov_9fa48("5793"), 'notifications')))) return stryMutAct_9fa48("5794") ? url.endsWith('/tech/notifications') : (stryCov_9fa48("5794"), url.startsWith(stryMutAct_9fa48("5795") ? "" : (stryCov_9fa48("5795"), '/tech/notifications')));
      if (stryMutAct_9fa48("5798") ? tabId !== 'profile' : stryMutAct_9fa48("5797") ? false : stryMutAct_9fa48("5796") ? true : (stryCov_9fa48("5796", "5797", "5798"), tabId === (stryMutAct_9fa48("5799") ? "" : (stryCov_9fa48("5799"), 'profile')))) return stryMutAct_9fa48("5800") ? url.endsWith('/tech/profile') : (stryCov_9fa48("5800"), url.startsWith(stryMutAct_9fa48("5801") ? "" : (stryCov_9fa48("5801"), '/tech/profile')));
      return stryMutAct_9fa48("5804") ? url === '/tech' && url === '/tech/' : stryMutAct_9fa48("5803") ? false : stryMutAct_9fa48("5802") ? true : (stryCov_9fa48("5802", "5803", "5804"), (stryMutAct_9fa48("5806") ? url !== '/tech' : stryMutAct_9fa48("5805") ? false : (stryCov_9fa48("5805", "5806"), url === (stryMutAct_9fa48("5807") ? "" : (stryCov_9fa48("5807"), '/tech')))) || (stryMutAct_9fa48("5809") ? url !== '/tech/' : stryMutAct_9fa48("5808") ? false : (stryCov_9fa48("5808", "5809"), url === (stryMutAct_9fa48("5810") ? "" : (stryCov_9fa48("5810"), '/tech/')))));
    }
  }
  navigate(path: string): void {
    if (stryMutAct_9fa48("5811")) {
      {}
    } else {
      stryCov_9fa48("5811");
      this.router.navigate(stryMutAct_9fa48("5812") ? [] : (stryCov_9fa48("5812"), [path]));
    }
  }
}