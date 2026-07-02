/**
 * Formats a Date object to 'YYYY-MM-DD' in local time (not UTC).
 * Avoids the timezone offset issue with toISOString().
 */
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
export function toLocalDateString(date: Date): string {
  if (stryMutAct_9fa48("1306")) {
    {}
  } else {
    stryCov_9fa48("1306");
    const year = date.getFullYear();
    const month = String(stryMutAct_9fa48("1307") ? date.getMonth() - 1 : (stryCov_9fa48("1307"), date.getMonth() + 1)).padStart(2, stryMutAct_9fa48("1308") ? "" : (stryCov_9fa48("1308"), '0'));
    const day = String(date.getDate()).padStart(2, stryMutAct_9fa48("1309") ? "" : (stryCov_9fa48("1309"), '0'));
    return stryMutAct_9fa48("1310") ? `` : (stryCov_9fa48("1310"), `${year}-${month}-${day}`);
  }
}