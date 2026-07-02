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
import { Directive, inject, input, HostListener } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly appCopyToClipboard = input.required<string>(stryMutAct_9fa48("6213") ? {} : (stryCov_9fa48("6213"), {
    alias: stryMutAct_9fa48("6214") ? "" : (stryCov_9fa48("6214"), 'appCopyToClipboard')
  }));
  @HostListener('click', ['$event'])
  async onClick(event: Event): Promise<void> {
    if (stryMutAct_9fa48("6215")) {
      {}
    } else {
      stryCov_9fa48("6215");
      event.stopPropagation();
      const text = this.appCopyToClipboard();
      if (stryMutAct_9fa48("6218") ? false : stryMutAct_9fa48("6217") ? true : stryMutAct_9fa48("6216") ? text : (stryCov_9fa48("6216", "6217", "6218"), !text)) return;
      try {
        if (stryMutAct_9fa48("6219")) {
          {}
        } else {
          stryCov_9fa48("6219");
          await navigator.clipboard.writeText(text);
          this.toastService.show(this.translationService.instant(stryMutAct_9fa48("6220") ? "" : (stryCov_9fa48("6220"), 'common.copied')), stryMutAct_9fa48("6221") ? "" : (stryCov_9fa48("6221"), 'success'));
        }
      } catch {
        if (stryMutAct_9fa48("6222")) {
          {}
        } else {
          stryCov_9fa48("6222");
          this.fallbackCopy(text);
        }
      }
    }
  }
  private fallbackCopy(text: string): void {
    if (stryMutAct_9fa48("6223")) {
      {}
    } else {
      stryCov_9fa48("6223");
      const textarea = document.createElement(stryMutAct_9fa48("6224") ? "" : (stryCov_9fa48("6224"), 'textarea'));
      textarea.value = text;
      textarea.style.position = stryMutAct_9fa48("6225") ? "" : (stryCov_9fa48("6225"), 'fixed');
      textarea.style.opacity = stryMutAct_9fa48("6226") ? "" : (stryCov_9fa48("6226"), '0');
      document.body.appendChild(textarea);
      textarea.select();
      try {
        if (stryMutAct_9fa48("6227")) {
          {}
        } else {
          stryCov_9fa48("6227");
          document.execCommand(stryMutAct_9fa48("6228") ? "" : (stryCov_9fa48("6228"), 'copy'));
          this.toastService.show(this.translationService.instant(stryMutAct_9fa48("6229") ? "" : (stryCov_9fa48("6229"), 'common.copied')), stryMutAct_9fa48("6230") ? "" : (stryCov_9fa48("6230"), 'success'));
        }
      } catch {
        if (stryMutAct_9fa48("6231")) {
          {}
        } else {
          stryCov_9fa48("6231");
          this.toastService.show(this.translationService.instant(stryMutAct_9fa48("6232") ? "" : (stryCov_9fa48("6232"), 'common.copyError')), stryMutAct_9fa48("6233") ? "" : (stryCov_9fa48("6233"), 'error'));
        }
      }
      document.body.removeChild(textarea);
    }
  }
}