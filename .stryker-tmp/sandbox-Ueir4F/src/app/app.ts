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
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { BusinessSettingsService } from './core/services/business-settings.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent, InstallPromptComponent, NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly businessSettingsService = inject(BusinessSettingsService);
  constructor() {
    if (stryMutAct_9fa48("209")) {
      {}
    } else {
      stryCov_9fa48("209");
      effect(() => {
        if (stryMutAct_9fa48("210")) {
          {}
        } else {
          stryCov_9fa48("210");
          const settings = this.businessSettingsService.settings();
          if (stryMutAct_9fa48("213") ? settings || typeof document !== 'undefined' : stryMutAct_9fa48("212") ? false : stryMutAct_9fa48("211") ? true : (stryCov_9fa48("211", "212", "213"), settings && (stryMutAct_9fa48("215") ? typeof document === 'undefined' : stryMutAct_9fa48("214") ? true : (stryCov_9fa48("214", "215"), typeof document !== (stryMutAct_9fa48("216") ? "" : (stryCov_9fa48("216"), 'undefined')))))) {
            if (stryMutAct_9fa48("217")) {
              {}
            } else {
              stryCov_9fa48("217");
              if (stryMutAct_9fa48("219") ? false : stryMutAct_9fa48("218") ? true : (stryCov_9fa48("218", "219"), settings.primaryColor)) {
                if (stryMutAct_9fa48("220")) {
                  {}
                } else {
                  stryCov_9fa48("220");
                  document.documentElement.style.setProperty(stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), '--color-primary'), settings.primaryColor);
                  document.documentElement.style.setProperty(stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), '--mat-sys-primary'), settings.primaryColor);
                  document.documentElement.style.setProperty(stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), '--mat-sys-on-primary'), stryMutAct_9fa48("224") ? "" : (stryCov_9fa48("224"), '#ffffff'));
                }
              }
              if (stryMutAct_9fa48("226") ? false : stryMutAct_9fa48("225") ? true : (stryCov_9fa48("225", "226"), settings.secondaryColor)) {
                if (stryMutAct_9fa48("227")) {
                  {}
                } else {
                  stryCov_9fa48("227");
                  document.documentElement.style.setProperty(stryMutAct_9fa48("228") ? "" : (stryCov_9fa48("228"), '--color-secondary'), settings.secondaryColor);
                }
              }
            }
          }
        }
      });
    }
  }
}