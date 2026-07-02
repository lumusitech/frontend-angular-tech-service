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
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (stryMutAct_9fa48("301")) {
    {}
  } else {
    stryCov_9fa48("301");
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);
    const token = authService.getToken();
    let authReq = req;
    if (stryMutAct_9fa48("303") ? false : stryMutAct_9fa48("302") ? true : (stryCov_9fa48("302", "303"), token)) {
      if (stryMutAct_9fa48("304")) {
        {}
      } else {
        stryCov_9fa48("304");
        authReq = req.clone(stryMutAct_9fa48("305") ? {} : (stryCov_9fa48("305"), {
          setHeaders: stryMutAct_9fa48("306") ? {} : (stryCov_9fa48("306"), {
            Authorization: stryMutAct_9fa48("307") ? `` : (stryCov_9fa48("307"), `Bearer ${token}`)
          })
        }));
      }
    }
    return next(authReq).pipe(catchError((error: HttpErrorResponse) => {
      if (stryMutAct_9fa48("308")) {
        {}
      } else {
        stryCov_9fa48("308");
        if (stryMutAct_9fa48("311") ? error.status !== 401 : stryMutAct_9fa48("310") ? false : stryMutAct_9fa48("309") ? true : (stryCov_9fa48("309", "310", "311"), error.status === 401)) {
          if (stryMutAct_9fa48("312")) {
            {}
          } else {
            stryCov_9fa48("312");
            toastService.show(stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'Sesión expirada o cuenta desactivada. Iniciá sesión nuevamente.'), stryMutAct_9fa48("314") ? "" : (stryCov_9fa48("314"), 'error'));
            authService.logout();
          }
        }
        return throwError(stryMutAct_9fa48("315") ? () => undefined : (stryCov_9fa48("315"), () => error));
      }
    }));
  }
};