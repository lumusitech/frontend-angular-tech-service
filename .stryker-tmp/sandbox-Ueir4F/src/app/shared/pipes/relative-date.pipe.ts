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
import { Pipe, PipeTransform } from '@angular/core';
const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const MONTH = 2_592_000_000;
const YEAR = 31_536_000_000;
@Pipe({
  name: 'relativeDate',
  pure: false
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (stryMutAct_9fa48("6265")) {
      {}
    } else {
      stryCov_9fa48("6265");
      if (stryMutAct_9fa48("6268") ? false : stryMutAct_9fa48("6267") ? true : stryMutAct_9fa48("6266") ? value : (stryCov_9fa48("6266", "6267", "6268"), !value)) return stryMutAct_9fa48("6269") ? "Stryker was here!" : (stryCov_9fa48("6269"), '');
      const date = value instanceof Date ? value : new Date(value);
      if (stryMutAct_9fa48("6271") ? false : stryMutAct_9fa48("6270") ? true : (stryCov_9fa48("6270", "6271"), isNaN(date.getTime()))) return stryMutAct_9fa48("6272") ? "Stryker was here!" : (stryCov_9fa48("6272"), '');
      const now = Date.now();
      const diff = stryMutAct_9fa48("6273") ? date.getTime() + now : (stryCov_9fa48("6273"), date.getTime() - now);
      const absDiff = Math.abs(diff);
      const isFuture = stryMutAct_9fa48("6277") ? diff <= 0 : stryMutAct_9fa48("6276") ? diff >= 0 : stryMutAct_9fa48("6275") ? false : stryMutAct_9fa48("6274") ? true : (stryCov_9fa48("6274", "6275", "6276", "6277"), diff > 0);
      if (stryMutAct_9fa48("6281") ? absDiff >= MINUTE : stryMutAct_9fa48("6280") ? absDiff <= MINUTE : stryMutAct_9fa48("6279") ? false : stryMutAct_9fa48("6278") ? true : (stryCov_9fa48("6278", "6279", "6280", "6281"), absDiff < MINUTE)) {
        if (stryMutAct_9fa48("6282")) {
          {}
        } else {
          stryCov_9fa48("6282");
          return isFuture ? stryMutAct_9fa48("6283") ? "" : (stryCov_9fa48("6283"), 'en unos segundos') : stryMutAct_9fa48("6284") ? "" : (stryCov_9fa48("6284"), 'hace unos segundos');
        }
      }
      if (stryMutAct_9fa48("6288") ? absDiff >= HOUR : stryMutAct_9fa48("6287") ? absDiff <= HOUR : stryMutAct_9fa48("6286") ? false : stryMutAct_9fa48("6285") ? true : (stryCov_9fa48("6285", "6286", "6287", "6288"), absDiff < HOUR)) {
        if (stryMutAct_9fa48("6289")) {
          {}
        } else {
          stryCov_9fa48("6289");
          const mins = Math.round(stryMutAct_9fa48("6290") ? absDiff * MINUTE : (stryCov_9fa48("6290"), absDiff / MINUTE));
          return isFuture ? stryMutAct_9fa48("6291") ? `` : (stryCov_9fa48("6291"), `en ${mins} min`) : stryMutAct_9fa48("6292") ? `` : (stryCov_9fa48("6292"), `hace ${mins} min`);
        }
      }
      if (stryMutAct_9fa48("6296") ? absDiff >= DAY : stryMutAct_9fa48("6295") ? absDiff <= DAY : stryMutAct_9fa48("6294") ? false : stryMutAct_9fa48("6293") ? true : (stryCov_9fa48("6293", "6294", "6295", "6296"), absDiff < DAY)) {
        if (stryMutAct_9fa48("6297")) {
          {}
        } else {
          stryCov_9fa48("6297");
          const hours = Math.round(stryMutAct_9fa48("6298") ? absDiff * HOUR : (stryCov_9fa48("6298"), absDiff / HOUR));
          return isFuture ? stryMutAct_9fa48("6299") ? `` : (stryCov_9fa48("6299"), `en ~${hours} hora${(stryMutAct_9fa48("6303") ? hours <= 1 : stryMutAct_9fa48("6302") ? hours >= 1 : stryMutAct_9fa48("6301") ? false : stryMutAct_9fa48("6300") ? true : (stryCov_9fa48("6300", "6301", "6302", "6303"), hours > 1)) ? stryMutAct_9fa48("6304") ? "" : (stryCov_9fa48("6304"), 's') : stryMutAct_9fa48("6305") ? "Stryker was here!" : (stryCov_9fa48("6305"), '')}`) : stryMutAct_9fa48("6306") ? `` : (stryCov_9fa48("6306"), `hace ~${hours} hora${(stryMutAct_9fa48("6310") ? hours <= 1 : stryMutAct_9fa48("6309") ? hours >= 1 : stryMutAct_9fa48("6308") ? false : stryMutAct_9fa48("6307") ? true : (stryCov_9fa48("6307", "6308", "6309", "6310"), hours > 1)) ? stryMutAct_9fa48("6311") ? "" : (stryCov_9fa48("6311"), 's') : stryMutAct_9fa48("6312") ? "Stryker was here!" : (stryCov_9fa48("6312"), '')}`);
        }
      }
      if (stryMutAct_9fa48("6316") ? absDiff >= MONTH : stryMutAct_9fa48("6315") ? absDiff <= MONTH : stryMutAct_9fa48("6314") ? false : stryMutAct_9fa48("6313") ? true : (stryCov_9fa48("6313", "6314", "6315", "6316"), absDiff < MONTH)) {
        if (stryMutAct_9fa48("6317")) {
          {}
        } else {
          stryCov_9fa48("6317");
          const days = Math.round(stryMutAct_9fa48("6318") ? absDiff * DAY : (stryCov_9fa48("6318"), absDiff / DAY));
          return isFuture ? stryMutAct_9fa48("6319") ? `` : (stryCov_9fa48("6319"), `en ${days} día${(stryMutAct_9fa48("6323") ? days <= 1 : stryMutAct_9fa48("6322") ? days >= 1 : stryMutAct_9fa48("6321") ? false : stryMutAct_9fa48("6320") ? true : (stryCov_9fa48("6320", "6321", "6322", "6323"), days > 1)) ? stryMutAct_9fa48("6324") ? "" : (stryCov_9fa48("6324"), 's') : stryMutAct_9fa48("6325") ? "Stryker was here!" : (stryCov_9fa48("6325"), '')}`) : stryMutAct_9fa48("6326") ? `` : (stryCov_9fa48("6326"), `hace ${days} día${(stryMutAct_9fa48("6330") ? days <= 1 : stryMutAct_9fa48("6329") ? days >= 1 : stryMutAct_9fa48("6328") ? false : stryMutAct_9fa48("6327") ? true : (stryCov_9fa48("6327", "6328", "6329", "6330"), days > 1)) ? stryMutAct_9fa48("6331") ? "" : (stryCov_9fa48("6331"), 's') : stryMutAct_9fa48("6332") ? "Stryker was here!" : (stryCov_9fa48("6332"), '')}`);
        }
      }
      if (stryMutAct_9fa48("6336") ? absDiff >= YEAR : stryMutAct_9fa48("6335") ? absDiff <= YEAR : stryMutAct_9fa48("6334") ? false : stryMutAct_9fa48("6333") ? true : (stryCov_9fa48("6333", "6334", "6335", "6336"), absDiff < YEAR)) {
        if (stryMutAct_9fa48("6337")) {
          {}
        } else {
          stryCov_9fa48("6337");
          const months = Math.round(stryMutAct_9fa48("6338") ? absDiff * MONTH : (stryCov_9fa48("6338"), absDiff / MONTH));
          return isFuture ? stryMutAct_9fa48("6339") ? `` : (stryCov_9fa48("6339"), `en ${months} mes${(stryMutAct_9fa48("6343") ? months <= 1 : stryMutAct_9fa48("6342") ? months >= 1 : stryMutAct_9fa48("6341") ? false : stryMutAct_9fa48("6340") ? true : (stryCov_9fa48("6340", "6341", "6342", "6343"), months > 1)) ? stryMutAct_9fa48("6344") ? "" : (stryCov_9fa48("6344"), 'es') : stryMutAct_9fa48("6345") ? "Stryker was here!" : (stryCov_9fa48("6345"), '')}`) : stryMutAct_9fa48("6346") ? `` : (stryCov_9fa48("6346"), `hace ${months} mes${(stryMutAct_9fa48("6350") ? months <= 1 : stryMutAct_9fa48("6349") ? months >= 1 : stryMutAct_9fa48("6348") ? false : stryMutAct_9fa48("6347") ? true : (stryCov_9fa48("6347", "6348", "6349", "6350"), months > 1)) ? stryMutAct_9fa48("6351") ? "" : (stryCov_9fa48("6351"), 'es') : stryMutAct_9fa48("6352") ? "Stryker was here!" : (stryCov_9fa48("6352"), '')}`);
        }
      }
      const years = Math.round(stryMutAct_9fa48("6353") ? absDiff * YEAR : (stryCov_9fa48("6353"), absDiff / YEAR));
      return isFuture ? stryMutAct_9fa48("6354") ? `` : (stryCov_9fa48("6354"), `en ${years} año${(stryMutAct_9fa48("6358") ? years <= 1 : stryMutAct_9fa48("6357") ? years >= 1 : stryMutAct_9fa48("6356") ? false : stryMutAct_9fa48("6355") ? true : (stryCov_9fa48("6355", "6356", "6357", "6358"), years > 1)) ? stryMutAct_9fa48("6359") ? "" : (stryCov_9fa48("6359"), 's') : stryMutAct_9fa48("6360") ? "Stryker was here!" : (stryCov_9fa48("6360"), '')}`) : stryMutAct_9fa48("6361") ? `` : (stryCov_9fa48("6361"), `hace ${years} año${(stryMutAct_9fa48("6365") ? years <= 1 : stryMutAct_9fa48("6364") ? years >= 1 : stryMutAct_9fa48("6363") ? false : stryMutAct_9fa48("6362") ? true : (stryCov_9fa48("6362", "6363", "6364", "6365"), years > 1)) ? stryMutAct_9fa48("6366") ? "" : (stryCov_9fa48("6366"), 's') : stryMutAct_9fa48("6367") ? "Stryker was here!" : (stryCov_9fa48("6367"), '')}`);
    }
  }
}