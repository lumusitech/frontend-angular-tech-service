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
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
type LabelType = 'workOrderStatus' | 'workOrderPriority' | 'paymentStatus' | 'paymentMethod' | 'expenseCategory' | 'noteType' | 'activeInactive' | 'invoiceStatus' | 'invoiceType';
const VALUE_TO_KEY: Record<string, string> = stryMutAct_9fa48("6426") ? {} : (stryCov_9fa48("6426"), {
  pending: stryMutAct_9fa48("6427") ? "" : (stryCov_9fa48("6427"), 'statusLabels.pending'),
  assigned: stryMutAct_9fa48("6428") ? "" : (stryCov_9fa48("6428"), 'statusLabels.assigned'),
  in_progress: stryMutAct_9fa48("6429") ? "" : (stryCov_9fa48("6429"), 'statusLabels.in_progress'),
  postponed: stryMutAct_9fa48("6430") ? "" : (stryCov_9fa48("6430"), 'statusLabels.postponed'),
  completed: stryMutAct_9fa48("6431") ? "" : (stryCov_9fa48("6431"), 'statusLabels.completed'),
  delivered: stryMutAct_9fa48("6432") ? "" : (stryCov_9fa48("6432"), 'statusLabels.delivered'),
  cancelled: stryMutAct_9fa48("6433") ? "" : (stryCov_9fa48("6433"), 'statusLabels.cancelled'),
  low: stryMutAct_9fa48("6434") ? "" : (stryCov_9fa48("6434"), 'statusLabels.low'),
  medium: stryMutAct_9fa48("6435") ? "" : (stryCov_9fa48("6435"), 'statusLabels.medium'),
  high: stryMutAct_9fa48("6436") ? "" : (stryCov_9fa48("6436"), 'statusLabels.high'),
  urgent: stryMutAct_9fa48("6437") ? "" : (stryCov_9fa48("6437"), 'statusLabels.urgent'),
  approved: stryMutAct_9fa48("6438") ? "" : (stryCov_9fa48("6438"), 'statusLabels.approved'),
  rejected: stryMutAct_9fa48("6439") ? "" : (stryCov_9fa48("6439"), 'statusLabels.rejected'),
  refunded: stryMutAct_9fa48("6440") ? "" : (stryCov_9fa48("6440"), 'statusLabels.refunded'),
  cash: stryMutAct_9fa48("6441") ? "" : (stryCov_9fa48("6441"), 'statusLabels.cash'),
  transfer: stryMutAct_9fa48("6442") ? "" : (stryCov_9fa48("6442"), 'statusLabels.transfer'),
  credit_card: stryMutAct_9fa48("6443") ? "" : (stryCov_9fa48("6443"), 'statusLabels.credit_card'),
  debit_card: stryMutAct_9fa48("6444") ? "" : (stryCov_9fa48("6444"), 'statusLabels.debit_card'),
  rent: stryMutAct_9fa48("6445") ? "" : (stryCov_9fa48("6445"), 'statusLabels.rent'),
  utilities: stryMutAct_9fa48("6446") ? "" : (stryCov_9fa48("6446"), 'statusLabels.utilities'),
  salaries: stryMutAct_9fa48("6447") ? "" : (stryCov_9fa48("6447"), 'statusLabels.salaries'),
  tools: stryMutAct_9fa48("6448") ? "" : (stryCov_9fa48("6448"), 'statusLabels.tools'),
  transport: stryMutAct_9fa48("6449") ? "" : (stryCov_9fa48("6449"), 'statusLabels.transport'),
  advertising: stryMutAct_9fa48("6450") ? "" : (stryCov_9fa48("6450"), 'statusLabels.advertising'),
  supplies: stryMutAct_9fa48("6451") ? "" : (stryCov_9fa48("6451"), 'statusLabels.supplies'),
  maintenance: stryMutAct_9fa48("6452") ? "" : (stryCov_9fa48("6452"), 'statusLabels.maintenance'),
  hosting: stryMutAct_9fa48("6453") ? "" : (stryCov_9fa48("6453"), 'statusLabels.hosting'),
  other: stryMutAct_9fa48("6454") ? "" : (stryCov_9fa48("6454"), 'statusLabels.other'),
  diagnosis: stryMutAct_9fa48("6455") ? "" : (stryCov_9fa48("6455"), 'statusLabels.diagnosis'),
  issue: stryMutAct_9fa48("6456") ? "" : (stryCov_9fa48("6456"), 'statusLabels.issue'),
  observation: stryMutAct_9fa48("6457") ? "" : (stryCov_9fa48("6457"), 'statusLabels.observation'),
  internal: stryMutAct_9fa48("6458") ? "" : (stryCov_9fa48("6458"), 'statusLabels.internal'),
  workshop: stryMutAct_9fa48("6459") ? "" : (stryCov_9fa48("6459"), 'statusLabels.workshop'),
  on_site: stryMutAct_9fa48("6460") ? "" : (stryCov_9fa48("6460"), 'statusLabels.on_site'),
  draft: stryMutAct_9fa48("6461") ? "" : (stryCov_9fa48("6461"), 'statusLabels.draft'),
  issued: stryMutAct_9fa48("6462") ? "" : (stryCov_9fa48("6462"), 'statusLabels.issued'),
  A: stryMutAct_9fa48("6463") ? "" : (stryCov_9fa48("6463"), 'statusLabels.invoiceTypeA'),
  B: stryMutAct_9fa48("6464") ? "" : (stryCov_9fa48("6464"), 'statusLabels.invoiceTypeB'),
  C: stryMutAct_9fa48("6465") ? "" : (stryCov_9fa48("6465"), 'statusLabels.invoiceTypeC')
});
@Pipe({
  name: 'statusLabel',
  pure: false
})
export class StatusLabelPipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);
  transform(value: string | boolean, _type: LabelType): string {
    if (stryMutAct_9fa48("6466")) {
      {}
    } else {
      stryCov_9fa48("6466");
      if (stryMutAct_9fa48("6469") ? typeof value !== 'boolean' : stryMutAct_9fa48("6468") ? false : stryMutAct_9fa48("6467") ? true : (stryCov_9fa48("6467", "6468", "6469"), typeof value === (stryMutAct_9fa48("6470") ? "" : (stryCov_9fa48("6470"), 'boolean')))) {
        if (stryMutAct_9fa48("6471")) {
          {}
        } else {
          stryCov_9fa48("6471");
          return value ? this.translationService.instant(stryMutAct_9fa48("6472") ? "" : (stryCov_9fa48("6472"), 'common.active')) : this.translationService.instant(stryMutAct_9fa48("6473") ? "" : (stryCov_9fa48("6473"), 'common.inactive'));
        }
      }
      const key = VALUE_TO_KEY[value];
      if (stryMutAct_9fa48("6475") ? false : stryMutAct_9fa48("6474") ? true : (stryCov_9fa48("6474", "6475"), key)) {
        if (stryMutAct_9fa48("6476")) {
          {}
        } else {
          stryCov_9fa48("6476");
          return this.translationService.instant(key);
        }
      }
      return value;
    }
  }
}