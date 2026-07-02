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
import { Directive, inject, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
@Directive({
  selector: '[role]'
})
export class RoleDirective {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private rendered = stryMutAct_9fa48("6234") ? true : (stryCov_9fa48("6234"), false);
  readonly appRole = input.required<string>(stryMutAct_9fa48("6235") ? {} : (stryCov_9fa48("6235"), {
    alias: stryMutAct_9fa48("6236") ? "" : (stryCov_9fa48("6236"), 'role')
  }));
  constructor() {
    if (stryMutAct_9fa48("6237")) {
      {}
    } else {
      stryCov_9fa48("6237");
      effect(() => {
        if (stryMutAct_9fa48("6238")) {
          {}
        } else {
          stryCov_9fa48("6238");
          const allowed = this.appRole().split(stryMutAct_9fa48("6239") ? "" : (stryCov_9fa48("6239"), ',')).map(stryMutAct_9fa48("6240") ? () => undefined : (stryCov_9fa48("6240"), r => stryMutAct_9fa48("6241") ? r : (stryCov_9fa48("6241"), r.trim())));
          const userRole = stryMutAct_9fa48("6242") ? this.authService.user()?.role && '' : (stryCov_9fa48("6242"), (stryMutAct_9fa48("6243") ? this.authService.user().role : (stryCov_9fa48("6243"), this.authService.user()?.role)) ?? (stryMutAct_9fa48("6244") ? "Stryker was here!" : (stryCov_9fa48("6244"), '')));
          const hasAccess = allowed.includes(userRole);
          if (stryMutAct_9fa48("6247") ? hasAccess || !this.rendered : stryMutAct_9fa48("6246") ? false : stryMutAct_9fa48("6245") ? true : (stryCov_9fa48("6245", "6246", "6247"), hasAccess && (stryMutAct_9fa48("6248") ? this.rendered : (stryCov_9fa48("6248"), !this.rendered)))) {
            if (stryMutAct_9fa48("6249")) {
              {}
            } else {
              stryCov_9fa48("6249");
              this.viewContainer.createEmbeddedView(this.templateRef);
              this.rendered = stryMutAct_9fa48("6250") ? false : (stryCov_9fa48("6250"), true);
            }
          } else if (stryMutAct_9fa48("6253") ? !hasAccess || this.rendered : stryMutAct_9fa48("6252") ? false : stryMutAct_9fa48("6251") ? true : (stryCov_9fa48("6251", "6252", "6253"), (stryMutAct_9fa48("6254") ? hasAccess : (stryCov_9fa48("6254"), !hasAccess)) && this.rendered)) {
            if (stryMutAct_9fa48("6255")) {
              {}
            } else {
              stryCov_9fa48("6255");
              this.viewContainer.clear();
              this.rendered = stryMutAct_9fa48("6256") ? true : (stryCov_9fa48("6256"), false);
            }
          }
        }
      });
    }
  }
}