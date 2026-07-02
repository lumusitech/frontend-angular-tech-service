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
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = () => {
  if (stryMutAct_9fa48("229")) {
    {}
  } else {
    stryCov_9fa48("229");
    const authService = inject(AuthService);
    const router = inject(Router);
    if (stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231"), authService.isAuthenticated())) {
      if (stryMutAct_9fa48("232")) {
        {}
      } else {
        stryCov_9fa48("232");
        return stryMutAct_9fa48("233") ? false : (stryCov_9fa48("233"), true);
      }
    }
    return router.createUrlTree(stryMutAct_9fa48("234") ? [] : (stryCov_9fa48("234"), [stryMutAct_9fa48("235") ? "" : (stryCov_9fa48("235"), '/login')]));
  }
};
export const adminGuard: CanActivateFn = () => {
  if (stryMutAct_9fa48("236")) {
    {}
  } else {
    stryCov_9fa48("236");
    const authService = inject(AuthService);
    const router = inject(Router);
    if (stryMutAct_9fa48("239") ? false : stryMutAct_9fa48("238") ? true : stryMutAct_9fa48("237") ? authService.isAuthenticated() : (stryCov_9fa48("237", "238", "239"), !authService.isAuthenticated())) {
      if (stryMutAct_9fa48("240")) {
        {}
      } else {
        stryCov_9fa48("240");
        return router.createUrlTree(stryMutAct_9fa48("241") ? [] : (stryCov_9fa48("241"), [stryMutAct_9fa48("242") ? "" : (stryCov_9fa48("242"), '/login')]));
      }
    }
    if (stryMutAct_9fa48("244") ? false : stryMutAct_9fa48("243") ? true : (stryCov_9fa48("243", "244"), authService.isAdmin())) {
      if (stryMutAct_9fa48("245")) {
        {}
      } else {
        stryCov_9fa48("245");
        return stryMutAct_9fa48("246") ? false : (stryCov_9fa48("246"), true);
      }
    }
    return router.createUrlTree(getHomeRoute(authService));
  }
};
export const technicianGuard: CanActivateFn = () => {
  if (stryMutAct_9fa48("247")) {
    {}
  } else {
    stryCov_9fa48("247");
    const authService = inject(AuthService);
    const router = inject(Router);
    if (stryMutAct_9fa48("250") ? false : stryMutAct_9fa48("249") ? true : stryMutAct_9fa48("248") ? authService.isAuthenticated() : (stryCov_9fa48("248", "249", "250"), !authService.isAuthenticated())) {
      if (stryMutAct_9fa48("251")) {
        {}
      } else {
        stryCov_9fa48("251");
        return router.createUrlTree(stryMutAct_9fa48("252") ? [] : (stryCov_9fa48("252"), [stryMutAct_9fa48("253") ? "" : (stryCov_9fa48("253"), '/login')]));
      }
    }
    if (stryMutAct_9fa48("255") ? false : stryMutAct_9fa48("254") ? true : (stryCov_9fa48("254", "255"), authService.isTechnician())) {
      if (stryMutAct_9fa48("256")) {
        {}
      } else {
        stryCov_9fa48("256");
        return stryMutAct_9fa48("257") ? false : (stryCov_9fa48("257"), true);
      }
    }
    return router.createUrlTree(getHomeRoute(authService));
  }
};
export const sellerGuard: CanActivateFn = () => {
  if (stryMutAct_9fa48("258")) {
    {}
  } else {
    stryCov_9fa48("258");
    const authService = inject(AuthService);
    const router = inject(Router);
    if (stryMutAct_9fa48("261") ? false : stryMutAct_9fa48("260") ? true : stryMutAct_9fa48("259") ? authService.isAuthenticated() : (stryCov_9fa48("259", "260", "261"), !authService.isAuthenticated())) {
      if (stryMutAct_9fa48("262")) {
        {}
      } else {
        stryCov_9fa48("262");
        return router.createUrlTree(stryMutAct_9fa48("263") ? [] : (stryCov_9fa48("263"), [stryMutAct_9fa48("264") ? "" : (stryCov_9fa48("264"), '/login')]));
      }
    }
    if (stryMutAct_9fa48("266") ? false : stryMutAct_9fa48("265") ? true : (stryCov_9fa48("265", "266"), authService.isSeller())) {
      if (stryMutAct_9fa48("267")) {
        {}
      } else {
        stryCov_9fa48("267");
        return stryMutAct_9fa48("268") ? false : (stryCov_9fa48("268"), true);
      }
    }
    return router.createUrlTree(getHomeRoute(authService));
  }
};
function getHomeRoute(authService: AuthService): string[] {
  if (stryMutAct_9fa48("269")) {
    {}
  } else {
    stryCov_9fa48("269");
    if (stryMutAct_9fa48("271") ? false : stryMutAct_9fa48("270") ? true : (stryCov_9fa48("270", "271"), authService.isTechnician())) return stryMutAct_9fa48("272") ? [] : (stryCov_9fa48("272"), [stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), '/tech')]);
    if (stryMutAct_9fa48("275") ? false : stryMutAct_9fa48("274") ? true : (stryCov_9fa48("274", "275"), authService.isSeller())) return stryMutAct_9fa48("276") ? [] : (stryCov_9fa48("276"), [stryMutAct_9fa48("277") ? "" : (stryCov_9fa48("277"), '/seller')]);
    return stryMutAct_9fa48("278") ? [] : (stryCov_9fa48("278"), [stryMutAct_9fa48("279") ? "" : (stryCov_9fa48("279"), '/admin/dashboard')]);
  }
}