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
type ClassType = 'workOrderStatus' | 'workOrderPriority' | 'paymentStatus' | 'paymentMethod' | 'expenseCategory' | 'noteType' | 'activeInactive' | 'invoiceStatus' | 'invoiceType';
const CLASSES: Record<ClassType, Record<string, string>> = stryMutAct_9fa48("6369") ? {} : (stryCov_9fa48("6369"), {
  workOrderStatus: stryMutAct_9fa48("6370") ? {} : (stryCov_9fa48("6370"), {
    pending: stryMutAct_9fa48("6371") ? "" : (stryCov_9fa48("6371"), 'bg-yellow-500/15 text-yellow-400'),
    assigned: stryMutAct_9fa48("6372") ? "" : (stryCov_9fa48("6372"), 'bg-blue-500/15 text-blue-400'),
    in_progress: stryMutAct_9fa48("6373") ? "" : (stryCov_9fa48("6373"), 'bg-indigo-500/15 text-indigo-400'),
    postponed: stryMutAct_9fa48("6374") ? "" : (stryCov_9fa48("6374"), 'bg-gray-500/15 text-gray-400'),
    completed: stryMutAct_9fa48("6375") ? "" : (stryCov_9fa48("6375"), 'bg-green-500/15 text-green-400'),
    delivered: stryMutAct_9fa48("6376") ? "" : (stryCov_9fa48("6376"), 'bg-emerald-500/15 text-emerald-400'),
    cancelled: stryMutAct_9fa48("6377") ? "" : (stryCov_9fa48("6377"), 'bg-red-500/15 text-red-400')
  }),
  workOrderPriority: stryMutAct_9fa48("6378") ? {} : (stryCov_9fa48("6378"), {
    low: stryMutAct_9fa48("6379") ? "" : (stryCov_9fa48("6379"), 'bg-gray-500/15 text-gray-400'),
    medium: stryMutAct_9fa48("6380") ? "" : (stryCov_9fa48("6380"), 'bg-blue-500/15 text-blue-400'),
    high: stryMutAct_9fa48("6381") ? "" : (stryCov_9fa48("6381"), 'bg-orange-500/15 text-orange-400'),
    urgent: stryMutAct_9fa48("6382") ? "" : (stryCov_9fa48("6382"), 'bg-red-500/15 text-red-400')
  }),
  paymentStatus: stryMutAct_9fa48("6383") ? {} : (stryCov_9fa48("6383"), {
    pending: stryMutAct_9fa48("6384") ? "" : (stryCov_9fa48("6384"), 'bg-yellow-500/15 text-yellow-400'),
    approved: stryMutAct_9fa48("6385") ? "" : (stryCov_9fa48("6385"), 'bg-green-500/15 text-green-400'),
    rejected: stryMutAct_9fa48("6386") ? "" : (stryCov_9fa48("6386"), 'bg-red-500/15 text-red-400'),
    refunded: stryMutAct_9fa48("6387") ? "" : (stryCov_9fa48("6387"), 'bg-blue-500/15 text-blue-400'),
    cancelled: stryMutAct_9fa48("6388") ? "" : (stryCov_9fa48("6388"), 'bg-gray-500/15 text-gray-400')
  }),
  paymentMethod: stryMutAct_9fa48("6389") ? {} : (stryCov_9fa48("6389"), {
    cash: stryMutAct_9fa48("6390") ? "" : (stryCov_9fa48("6390"), 'bg-green-500/15 text-green-400'),
    transfer: stryMutAct_9fa48("6391") ? "" : (stryCov_9fa48("6391"), 'bg-blue-500/15 text-blue-400'),
    credit_card: stryMutAct_9fa48("6392") ? "" : (stryCov_9fa48("6392"), 'bg-purple-500/15 text-purple-400'),
    debit_card: stryMutAct_9fa48("6393") ? "" : (stryCov_9fa48("6393"), 'bg-orange-500/15 text-orange-400')
  }),
  expenseCategory: stryMutAct_9fa48("6394") ? {} : (stryCov_9fa48("6394"), {
    rent: stryMutAct_9fa48("6395") ? "" : (stryCov_9fa48("6395"), 'bg-purple-500/15 text-purple-400'),
    utilities: stryMutAct_9fa48("6396") ? "" : (stryCov_9fa48("6396"), 'bg-blue-500/15 text-blue-400'),
    salaries: stryMutAct_9fa48("6397") ? "" : (stryCov_9fa48("6397"), 'bg-green-500/15 text-green-400'),
    tools: stryMutAct_9fa48("6398") ? "" : (stryCov_9fa48("6398"), 'bg-orange-500/15 text-orange-400'),
    transport: stryMutAct_9fa48("6399") ? "" : (stryCov_9fa48("6399"), 'bg-yellow-500/15 text-yellow-400'),
    advertising: stryMutAct_9fa48("6400") ? "" : (stryCov_9fa48("6400"), 'bg-pink-500/15 text-pink-400'),
    supplies: stryMutAct_9fa48("6401") ? "" : (stryCov_9fa48("6401"), 'bg-indigo-500/15 text-indigo-400'),
    maintenance: stryMutAct_9fa48("6402") ? "" : (stryCov_9fa48("6402"), 'bg-red-500/15 text-red-400'),
    hosting: stryMutAct_9fa48("6403") ? "" : (stryCov_9fa48("6403"), 'bg-cyan-500/15 text-cyan-400'),
    other: stryMutAct_9fa48("6404") ? "" : (stryCov_9fa48("6404"), 'bg-gray-500/15 text-gray-400')
  }),
  noteType: stryMutAct_9fa48("6405") ? {} : (stryCov_9fa48("6405"), {
    diagnosis: stryMutAct_9fa48("6406") ? "" : (stryCov_9fa48("6406"), 'bg-blue-500/15 text-blue-400'),
    issue: stryMutAct_9fa48("6407") ? "" : (stryCov_9fa48("6407"), 'bg-red-500/15 text-red-400'),
    observation: stryMutAct_9fa48("6408") ? "" : (stryCov_9fa48("6408"), 'bg-gray-500/15 text-gray-400'),
    internal: stryMutAct_9fa48("6409") ? "" : (stryCov_9fa48("6409"), 'bg-yellow-500/15 text-yellow-400')
  }),
  activeInactive: stryMutAct_9fa48("6410") ? {} : (stryCov_9fa48("6410"), {
    true: stryMutAct_9fa48("6411") ? "" : (stryCov_9fa48("6411"), 'bg-green-500/15 text-green-400'),
    false: stryMutAct_9fa48("6412") ? "" : (stryCov_9fa48("6412"), 'bg-gray-500/15 text-gray-400')
  }),
  invoiceStatus: stryMutAct_9fa48("6413") ? {} : (stryCov_9fa48("6413"), {
    draft: stryMutAct_9fa48("6414") ? "" : (stryCov_9fa48("6414"), 'bg-yellow-500/15 text-yellow-400'),
    issued: stryMutAct_9fa48("6415") ? "" : (stryCov_9fa48("6415"), 'bg-green-500/15 text-green-400'),
    cancelled: stryMutAct_9fa48("6416") ? "" : (stryCov_9fa48("6416"), 'bg-red-500/15 text-red-400'),
    rejected: stryMutAct_9fa48("6417") ? "" : (stryCov_9fa48("6417"), 'bg-gray-500/15 text-gray-400')
  }),
  invoiceType: stryMutAct_9fa48("6418") ? {} : (stryCov_9fa48("6418"), {
    A: stryMutAct_9fa48("6419") ? "" : (stryCov_9fa48("6419"), 'bg-blue-500/15 text-blue-400'),
    B: stryMutAct_9fa48("6420") ? "" : (stryCov_9fa48("6420"), 'bg-green-500/15 text-green-400'),
    C: stryMutAct_9fa48("6421") ? "" : (stryCov_9fa48("6421"), 'bg-orange-500/15 text-orange-400')
  })
});
@Pipe({
  name: 'statusClass'
})
export class StatusClassPipe implements PipeTransform {
  transform(value: string | boolean, type: ClassType): string {
    if (stryMutAct_9fa48("6422")) {
      {}
    } else {
      stryCov_9fa48("6422");
      const key = String(value);
      return stryMutAct_9fa48("6423") ? CLASSES[type]?.[key] && 'bg-gray-500/15 text-gray-400' : (stryCov_9fa48("6423"), (stryMutAct_9fa48("6424") ? CLASSES[type][key] : (stryCov_9fa48("6424"), CLASSES[type]?.[key])) ?? (stryMutAct_9fa48("6425") ? "" : (stryCov_9fa48("6425"), 'bg-gray-500/15 text-gray-400')));
    }
  }
}