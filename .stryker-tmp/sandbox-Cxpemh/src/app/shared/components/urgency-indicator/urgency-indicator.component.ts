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
import { Component, input, computed } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
@Component({
  selector: 'app-urgency-indicator',
  imports: [TranslatePipe],
  template: `
    <div class="flex items-center gap-1.5">
      <span
        class="inline-block w-2.5 h-2.5 rounded-full"
        [class]="dotColor()"
      ></span>
      <span class="text-xs font-medium" [class]="textColor()">
        {{ label() | translate }}
      </span>
    </div>
  `
})
export class UrgencyIndicatorComponent {
  scheduledDate = input<string | null>(null);
  private readonly daysRemaining = computed(() => {
    if (stryMutAct_9fa48("6154")) {
      {}
    } else {
      stryCov_9fa48("6154");
      const date = this.scheduledDate();
      if (stryMutAct_9fa48("6157") ? false : stryMutAct_9fa48("6156") ? true : stryMutAct_9fa48("6155") ? date : (stryCov_9fa48("6155", "6156", "6157"), !date)) return null;
      const today = new Date();
      stryMutAct_9fa48("6158") ? today.setMinutes(0, 0, 0, 0) : (stryCov_9fa48("6158"), today.setHours(0, 0, 0, 0));
      const scheduled = new Date(date);
      stryMutAct_9fa48("6159") ? scheduled.setMinutes(0, 0, 0, 0) : (stryCov_9fa48("6159"), scheduled.setHours(0, 0, 0, 0));
      return Math.ceil(stryMutAct_9fa48("6160") ? (scheduled.getTime() - today.getTime()) * (1000 * 60 * 60 * 24) : (stryCov_9fa48("6160"), (stryMutAct_9fa48("6161") ? scheduled.getTime() + today.getTime() : (stryCov_9fa48("6161"), scheduled.getTime() - today.getTime())) / (stryMutAct_9fa48("6162") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("6162"), (stryMutAct_9fa48("6163") ? 1000 * 60 / 60 : (stryCov_9fa48("6163"), (stryMutAct_9fa48("6164") ? 1000 / 60 : (stryCov_9fa48("6164"), 1000 * 60)) * 60)) * 24))));
    }
  });
  readonly dotColor = computed(() => {
    if (stryMutAct_9fa48("6165")) {
      {}
    } else {
      stryCov_9fa48("6165");
      const days = this.daysRemaining();
      if (stryMutAct_9fa48("6168") ? days !== null : stryMutAct_9fa48("6167") ? false : stryMutAct_9fa48("6166") ? true : (stryCov_9fa48("6166", "6167", "6168"), days === null)) return stryMutAct_9fa48("6169") ? "" : (stryCov_9fa48("6169"), 'bg-gray-400');
      if (stryMutAct_9fa48("6173") ? days > 0 : stryMutAct_9fa48("6172") ? days < 0 : stryMutAct_9fa48("6171") ? false : stryMutAct_9fa48("6170") ? true : (stryCov_9fa48("6170", "6171", "6172", "6173"), days <= 0)) return stryMutAct_9fa48("6174") ? "" : (stryCov_9fa48("6174"), 'bg-red-500');
      if (stryMutAct_9fa48("6178") ? days > 3 : stryMutAct_9fa48("6177") ? days < 3 : stryMutAct_9fa48("6176") ? false : stryMutAct_9fa48("6175") ? true : (stryCov_9fa48("6175", "6176", "6177", "6178"), days <= 3)) return stryMutAct_9fa48("6179") ? "" : (stryCov_9fa48("6179"), 'bg-yellow-500');
      return stryMutAct_9fa48("6180") ? "" : (stryCov_9fa48("6180"), 'bg-green-500');
    }
  });
  readonly textColor = computed(() => {
    if (stryMutAct_9fa48("6181")) {
      {}
    } else {
      stryCov_9fa48("6181");
      const days = this.daysRemaining();
      if (stryMutAct_9fa48("6184") ? days !== null : stryMutAct_9fa48("6183") ? false : stryMutAct_9fa48("6182") ? true : (stryCov_9fa48("6182", "6183", "6184"), days === null)) return stryMutAct_9fa48("6185") ? "" : (stryCov_9fa48("6185"), 'text-gray-500 dark:text-gray-400');
      if (stryMutAct_9fa48("6189") ? days > 0 : stryMutAct_9fa48("6188") ? days < 0 : stryMutAct_9fa48("6187") ? false : stryMutAct_9fa48("6186") ? true : (stryCov_9fa48("6186", "6187", "6188", "6189"), days <= 0)) return stryMutAct_9fa48("6190") ? "" : (stryCov_9fa48("6190"), 'text-red-600 dark:text-red-400');
      if (stryMutAct_9fa48("6194") ? days > 3 : stryMutAct_9fa48("6193") ? days < 3 : stryMutAct_9fa48("6192") ? false : stryMutAct_9fa48("6191") ? true : (stryCov_9fa48("6191", "6192", "6193", "6194"), days <= 3)) return stryMutAct_9fa48("6195") ? "" : (stryCov_9fa48("6195"), 'text-yellow-600 dark:text-yellow-400');
      return stryMutAct_9fa48("6196") ? "" : (stryCov_9fa48("6196"), 'text-green-600 dark:text-green-400');
    }
  });
  readonly label = computed(() => {
    if (stryMutAct_9fa48("6197")) {
      {}
    } else {
      stryCov_9fa48("6197");
      const days = this.daysRemaining();
      if (stryMutAct_9fa48("6200") ? days !== null : stryMutAct_9fa48("6199") ? false : stryMutAct_9fa48("6198") ? true : (stryCov_9fa48("6198", "6199", "6200"), days === null)) return stryMutAct_9fa48("6201") ? "" : (stryCov_9fa48("6201"), 'technician.noDate');
      if (stryMutAct_9fa48("6205") ? days >= 0 : stryMutAct_9fa48("6204") ? days <= 0 : stryMutAct_9fa48("6203") ? false : stryMutAct_9fa48("6202") ? true : (stryCov_9fa48("6202", "6203", "6204", "6205"), days < 0)) return stryMutAct_9fa48("6206") ? `` : (stryCov_9fa48("6206"), `technician.overdue`);
      if (stryMutAct_9fa48("6209") ? days !== 0 : stryMutAct_9fa48("6208") ? false : stryMutAct_9fa48("6207") ? true : (stryCov_9fa48("6207", "6208", "6209"), days === 0)) return stryMutAct_9fa48("6210") ? "" : (stryCov_9fa48("6210"), 'technician.dueToday');
      return stryMutAct_9fa48("6211") ? `` : (stryCov_9fa48("6211"), `${days} ${stryMutAct_9fa48("6212") ? "" : (stryCov_9fa48("6212"), 'technician.daysRemaining')}`);
    }
  });
}