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
import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = stryMutAct_9fa48("12") ? [] : (stryCov_9fa48("12"), [stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
  path: stryMutAct_9fa48("14") ? "Stryker was here!" : (stryCov_9fa48("14"), ''),
  renderMode: RenderMode.Prerender
}), stryMutAct_9fa48("15") ? {} : (stryCov_9fa48("15"), {
  path: stryMutAct_9fa48("16") ? "" : (stryCov_9fa48("16"), 'login'),
  renderMode: RenderMode.Client
}), stryMutAct_9fa48("17") ? {} : (stryCov_9fa48("17"), {
  path: stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), 'track'),
  renderMode: RenderMode.Server
}), stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
  path: stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), 'track/:code'),
  renderMode: RenderMode.Server
}), stryMutAct_9fa48("21") ? {} : (stryCov_9fa48("21"), {
  path: stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), 'admin/**'),
  renderMode: RenderMode.Client
}), stryMutAct_9fa48("23") ? {} : (stryCov_9fa48("23"), {
  path: stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), 'tech/**'),
  renderMode: RenderMode.Client
}), stryMutAct_9fa48("25") ? {} : (stryCov_9fa48("25"), {
  path: stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), '**'),
  renderMode: RenderMode.Client
})]);