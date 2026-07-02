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
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardDirective } from '../../directives/copy-to-clipboard.directive';
import { TranslatePipe } from '../../pipes/translate.pipe';
@Component({
  selector: 'app-copy-field',
  imports: [MatIconModule, CopyToClipboardDirective, TranslatePipe],
  template: `
    <div class="flex items-start justify-between py-2 gap-2">
      <div class="flex items-start gap-2 min-w-0 flex-1">
        <span class="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0 pt-0.5">{{ label() }}</span>
        @if (type() === 'phone') {
          <a [href]="'tel:' + value()" class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline">
            {{ value() }}
          </a>
        } @else if (type() === 'email') {
          <a [href]="'mailto:' + value()" class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline">
            {{ value() }}
          </a>
        } @else if (type() === 'address') {
          <a [href]="'https://maps.google.com/?q=' + encodeURIComponent(value())" target="_blank" rel="noopener"
             class="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline">
            {{ value() }}
          </a>
        } @else if (type() === 'date') {
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ formattedDate() }}</span>
        } @else {
          <span class="text-sm text-gray-900 dark:text-gray-100 break-all">{{ value() }}</span>
        }
      </div>
      <button
        mat-icon-button
        [appCopyToClipboard]="copyValue()"
        class="!min-w-0 !p-1 shrink-0"
        [title]="'common.copyToClipboard' | translate"
      >
        <mat-icon class="!text-[18px] !w-[18px] !h-[18px] !text-gray-400">file_copy</mat-icon>
      </button>
    </div>
  `
})
export class CopyFieldComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly type = input<'phone' | 'email' | 'address' | 'date' | 'text'>(stryMutAct_9fa48("5813") ? "" : (stryCov_9fa48("5813"), 'text'));
  readonly formattedDate = computed(() => {
    if (stryMutAct_9fa48("5814")) {
      {}
    } else {
      stryCov_9fa48("5814");
      if (stryMutAct_9fa48("5817") ? this.type() === 'date' : stryMutAct_9fa48("5816") ? false : stryMutAct_9fa48("5815") ? true : (stryCov_9fa48("5815", "5816", "5817"), this.type() !== (stryMutAct_9fa48("5818") ? "" : (stryCov_9fa48("5818"), 'date')))) return this.value();
      const d = new Date(this.value());
      if (stryMutAct_9fa48("5820") ? false : stryMutAct_9fa48("5819") ? true : (stryCov_9fa48("5819", "5820"), isNaN(d.getTime()))) return this.value();
      return this.relativeDate(d);
    }
  });
  readonly copyValue = computed(() => {
    if (stryMutAct_9fa48("5821")) {
      {}
    } else {
      stryCov_9fa48("5821");
      if (stryMutAct_9fa48("5824") ? this.type() === 'date' : stryMutAct_9fa48("5823") ? false : stryMutAct_9fa48("5822") ? true : (stryCov_9fa48("5822", "5823", "5824"), this.type() !== (stryMutAct_9fa48("5825") ? "" : (stryCov_9fa48("5825"), 'date')))) return this.value();
      const d = new Date(this.value());
      if (stryMutAct_9fa48("5827") ? false : stryMutAct_9fa48("5826") ? true : (stryCov_9fa48("5826", "5827"), isNaN(d.getTime()))) return this.value();
      return d.toLocaleDateString(stryMutAct_9fa48("5828") ? "" : (stryCov_9fa48("5828"), 'es-AR'), stryMutAct_9fa48("5829") ? {} : (stryCov_9fa48("5829"), {
        year: stryMutAct_9fa48("5830") ? "" : (stryCov_9fa48("5830"), 'numeric'),
        month: stryMutAct_9fa48("5831") ? "" : (stryCov_9fa48("5831"), 'long'),
        day: stryMutAct_9fa48("5832") ? "" : (stryCov_9fa48("5832"), 'numeric'),
        hour: stryMutAct_9fa48("5833") ? "" : (stryCov_9fa48("5833"), '2-digit'),
        minute: stryMutAct_9fa48("5834") ? "" : (stryCov_9fa48("5834"), '2-digit')
      }));
    }
  });
  encodeURIComponent(value: string): string {
    if (stryMutAct_9fa48("5835")) {
      {}
    } else {
      stryCov_9fa48("5835");
      return encodeURIComponent(value);
    }
  }
  private relativeDate(date: Date): string {
    if (stryMutAct_9fa48("5836")) {
      {}
    } else {
      stryCov_9fa48("5836");
      const now = Date.now();
      const diff = stryMutAct_9fa48("5837") ? date.getTime() + now : (stryCov_9fa48("5837"), date.getTime() - now);
      const abs = Math.abs(diff);
      const future = stryMutAct_9fa48("5841") ? diff <= 0 : stryMutAct_9fa48("5840") ? diff >= 0 : stryMutAct_9fa48("5839") ? false : stryMutAct_9fa48("5838") ? true : (stryCov_9fa48("5838", "5839", "5840", "5841"), diff > 0);
      if (stryMutAct_9fa48("5845") ? abs >= 60_000 : stryMutAct_9fa48("5844") ? abs <= 60_000 : stryMutAct_9fa48("5843") ? false : stryMutAct_9fa48("5842") ? true : (stryCov_9fa48("5842", "5843", "5844", "5845"), abs < 60_000)) return future ? stryMutAct_9fa48("5846") ? "" : (stryCov_9fa48("5846"), 'en unos segundos') : stryMutAct_9fa48("5847") ? "" : (stryCov_9fa48("5847"), 'hace unos segundos');
      if (stryMutAct_9fa48("5851") ? abs >= 3_600_000 : stryMutAct_9fa48("5850") ? abs <= 3_600_000 : stryMutAct_9fa48("5849") ? false : stryMutAct_9fa48("5848") ? true : (stryCov_9fa48("5848", "5849", "5850", "5851"), abs < 3_600_000)) {
        if (stryMutAct_9fa48("5852")) {
          {}
        } else {
          stryCov_9fa48("5852");
          const m = Math.round(stryMutAct_9fa48("5853") ? abs * 60_000 : (stryCov_9fa48("5853"), abs / 60_000));
          return future ? stryMutAct_9fa48("5854") ? `` : (stryCov_9fa48("5854"), `en ${m} min`) : stryMutAct_9fa48("5855") ? `` : (stryCov_9fa48("5855"), `hace ${m} min`);
        }
      }
      if (stryMutAct_9fa48("5859") ? abs >= 86_400_000 : stryMutAct_9fa48("5858") ? abs <= 86_400_000 : stryMutAct_9fa48("5857") ? false : stryMutAct_9fa48("5856") ? true : (stryCov_9fa48("5856", "5857", "5858", "5859"), abs < 86_400_000)) {
        if (stryMutAct_9fa48("5860")) {
          {}
        } else {
          stryCov_9fa48("5860");
          const h = Math.round(stryMutAct_9fa48("5861") ? abs * 3_600_000 : (stryCov_9fa48("5861"), abs / 3_600_000));
          return future ? stryMutAct_9fa48("5862") ? `` : (stryCov_9fa48("5862"), `en ~${h}h`) : stryMutAct_9fa48("5863") ? `` : (stryCov_9fa48("5863"), `hace ~${h}h`);
        }
      }
      if (stryMutAct_9fa48("5867") ? abs >= 2_592_000_000 : stryMutAct_9fa48("5866") ? abs <= 2_592_000_000 : stryMutAct_9fa48("5865") ? false : stryMutAct_9fa48("5864") ? true : (stryCov_9fa48("5864", "5865", "5866", "5867"), abs < 2_592_000_000)) {
        if (stryMutAct_9fa48("5868")) {
          {}
        } else {
          stryCov_9fa48("5868");
          const d = Math.round(stryMutAct_9fa48("5869") ? abs * 86_400_000 : (stryCov_9fa48("5869"), abs / 86_400_000));
          return future ? stryMutAct_9fa48("5870") ? `` : (stryCov_9fa48("5870"), `en ${d} días`) : stryMutAct_9fa48("5871") ? `` : (stryCov_9fa48("5871"), `hace ${d} días`);
        }
      }
      return date.toLocaleDateString(stryMutAct_9fa48("5872") ? "" : (stryCov_9fa48("5872"), 'es-AR'), stryMutAct_9fa48("5873") ? {} : (stryCov_9fa48("5873"), {
        day: stryMutAct_9fa48("5874") ? "" : (stryCov_9fa48("5874"), 'numeric'),
        month: stryMutAct_9fa48("5875") ? "" : (stryCov_9fa48("5875"), 'short'),
        year: stryMutAct_9fa48("5876") ? "" : (stryCov_9fa48("5876"), 'numeric')
      }));
    }
  }
}