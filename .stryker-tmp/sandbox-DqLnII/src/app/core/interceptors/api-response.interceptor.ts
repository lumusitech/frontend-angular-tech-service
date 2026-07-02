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
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
interface ApiResponseWrapper<T> {
  statusCode: number;
  data: T;
  timestamp: string;
}
export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  if (stryMutAct_9fa48("280")) {
    {}
  } else {
    stryCov_9fa48("280");
    return next(req).pipe(map(event => {
      if (stryMutAct_9fa48("281")) {
        {}
      } else {
        stryCov_9fa48("281");
        if (stryMutAct_9fa48("284") ? event instanceof HttpResponse && event.body && typeof event.body === 'object' && 'statusCode' in event.body && 'data' in event.body || 'timestamp' in event.body : stryMutAct_9fa48("283") ? false : stryMutAct_9fa48("282") ? true : (stryCov_9fa48("282", "283", "284"), (stryMutAct_9fa48("286") ? event instanceof HttpResponse && event.body && typeof event.body === 'object' && 'statusCode' in event.body || 'data' in event.body : stryMutAct_9fa48("285") ? true : (stryCov_9fa48("285", "286"), (stryMutAct_9fa48("288") ? event instanceof HttpResponse && event.body && typeof event.body === 'object' || 'statusCode' in event.body : stryMutAct_9fa48("287") ? true : (stryCov_9fa48("287", "288"), (stryMutAct_9fa48("290") ? event instanceof HttpResponse && event.body || typeof event.body === 'object' : stryMutAct_9fa48("289") ? true : (stryCov_9fa48("289", "290"), (stryMutAct_9fa48("292") ? event instanceof HttpResponse || event.body : stryMutAct_9fa48("291") ? true : (stryCov_9fa48("291", "292"), event instanceof HttpResponse && event.body)) && (stryMutAct_9fa48("294") ? typeof event.body !== 'object' : stryMutAct_9fa48("293") ? true : (stryCov_9fa48("293", "294"), typeof event.body === (stryMutAct_9fa48("295") ? "" : (stryCov_9fa48("295"), 'object')))))) && (stryMutAct_9fa48("296") ? "" : (stryCov_9fa48("296"), 'statusCode')) in event.body)) && (stryMutAct_9fa48("297") ? "" : (stryCov_9fa48("297"), 'data')) in event.body)) && (stryMutAct_9fa48("298") ? "" : (stryCov_9fa48("298"), 'timestamp')) in event.body)) {
          if (stryMutAct_9fa48("299")) {
            {}
          } else {
            stryCov_9fa48("299");
            return event.clone(stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
              body: (event.body as ApiResponseWrapper<unknown>).data
            }));
          }
        }
        return event;
      }
    }));
  }
};