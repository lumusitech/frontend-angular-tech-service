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
import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
  }>;
};
@Service()
export class PwaService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly installPromptEvent = signal<BeforeInstallPromptEvent | null>(null);
  readonly installAvailable = signal(stryMutAct_9fa48("881") ? true : (stryCov_9fa48("881"), false));
  readonly installed = signal(stryMutAct_9fa48("882") ? true : (stryCov_9fa48("882"), false));
  constructor() {
    if (stryMutAct_9fa48("883")) {
      {}
    } else {
      stryCov_9fa48("883");
      if (stryMutAct_9fa48("885") ? false : stryMutAct_9fa48("884") ? true : (stryCov_9fa48("884", "885"), isPlatformBrowser(this.platformId))) {
        if (stryMutAct_9fa48("886")) {
          {}
        } else {
          stryCov_9fa48("886");
          this.listenForInstallPrompt();
        }
      }
    }
  }
  private listenForInstallPrompt(): void {
    if (stryMutAct_9fa48("887")) {
      {}
    } else {
      stryCov_9fa48("887");
      window.addEventListener(stryMutAct_9fa48("888") ? "" : (stryCov_9fa48("888"), 'beforeinstallprompt'), event => {
        if (stryMutAct_9fa48("889")) {
          {}
        } else {
          stryCov_9fa48("889");
          event.preventDefault();
          this.installPromptEvent.set(event as BeforeInstallPromptEvent);
          this.installAvailable.set(stryMutAct_9fa48("890") ? false : (stryCov_9fa48("890"), true));
        }
      });
      window.addEventListener(stryMutAct_9fa48("891") ? "" : (stryCov_9fa48("891"), 'appinstalled'), () => {
        if (stryMutAct_9fa48("892")) {
          {}
        } else {
          stryCov_9fa48("892");
          this.installPromptEvent.set(null);
          this.installAvailable.set(stryMutAct_9fa48("893") ? true : (stryCov_9fa48("893"), false));
          this.installed.set(stryMutAct_9fa48("894") ? false : (stryCov_9fa48("894"), true));
        }
      });
    }
  }
  async install(): Promise<void> {
    if (stryMutAct_9fa48("895")) {
      {}
    } else {
      stryCov_9fa48("895");
      const promptEvent = this.installPromptEvent();
      if (stryMutAct_9fa48("898") ? false : stryMutAct_9fa48("897") ? true : stryMutAct_9fa48("896") ? promptEvent : (stryCov_9fa48("896", "897", "898"), !promptEvent)) {
        if (stryMutAct_9fa48("899")) {
          {}
        } else {
          stryCov_9fa48("899");
          return;
        }
      }
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (stryMutAct_9fa48("902") ? choice.outcome !== 'accepted' : stryMutAct_9fa48("901") ? false : stryMutAct_9fa48("900") ? true : (stryCov_9fa48("900", "901", "902"), choice.outcome === (stryMutAct_9fa48("903") ? "" : (stryCov_9fa48("903"), 'accepted')))) {
        if (stryMutAct_9fa48("904")) {
          {}
        } else {
          stryCov_9fa48("904");
          this.installPromptEvent.set(null);
          this.installAvailable.set(stryMutAct_9fa48("905") ? true : (stryCov_9fa48("905"), false));
        }
      }
    }
  }
  dismiss(): void {
    if (stryMutAct_9fa48("906")) {
      {}
    } else {
      stryCov_9fa48("906");
      this.installPromptEvent.set(null);
      this.installAvailable.set(stryMutAct_9fa48("907") ? true : (stryCov_9fa48("907"), false));
    }
  }
}