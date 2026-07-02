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
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsListComponent } from './notifications-list.component';
import { AppNotification } from '../../core/models/notification.interfaces';
import { getSearchTerm } from '../../core/utils/notification.utils';
@Component({
  selector: 'app-notifications-page',
  imports: [NotificationsListComponent],
  template: `
    <app-notifications-list (notificationClick)="handleClick($event)" />
  `
})
export class NotificationsPageComponent {
  private readonly router = inject(Router);
  handleClick(notification: AppNotification): void {
    if (stryMutAct_9fa48("2932")) {
      {}
    } else {
      stryCov_9fa48("2932");
      if (stryMutAct_9fa48("2935") ? false : stryMutAct_9fa48("2934") ? true : stryMutAct_9fa48("2933") ? notification.referenceType : (stryCov_9fa48("2933", "2934", "2935"), !notification.referenceType)) return;
      const routes: Record<string, string> = stryMutAct_9fa48("2936") ? {} : (stryCov_9fa48("2936"), {
        work_order: stryMutAct_9fa48("2937") ? "" : (stryCov_9fa48("2937"), '/admin/work-orders'),
        task: stryMutAct_9fa48("2938") ? "" : (stryCov_9fa48("2938"), '/admin/work-orders'),
        payment: stryMutAct_9fa48("2939") ? "" : (stryCov_9fa48("2939"), '/admin/payments'),
        pending_item: stryMutAct_9fa48("2940") ? "" : (stryCov_9fa48("2940"), '/admin/pending-items'),
        inquiry: stryMutAct_9fa48("2941") ? "" : (stryCov_9fa48("2941"), '/admin/inquiries')
      });
      const baseRoute = routes[notification.referenceType];
      if (stryMutAct_9fa48("2944") ? false : stryMutAct_9fa48("2943") ? true : stryMutAct_9fa48("2942") ? baseRoute : (stryCov_9fa48("2942", "2943", "2944"), !baseRoute)) return;
      const search = getSearchTerm(notification);
      const queryParams: Record<string, string> = {};
      if (stryMutAct_9fa48("2946") ? false : stryMutAct_9fa48("2945") ? true : (stryCov_9fa48("2945", "2946"), notification.referenceId)) {
        if (stryMutAct_9fa48("2947")) {
          {}
        } else {
          stryCov_9fa48("2947");
          queryParams[stryMutAct_9fa48("2948") ? "" : (stryCov_9fa48("2948"), 'highlight')] = notification.referenceId;
        }
      } else if (stryMutAct_9fa48("2950") ? false : stryMutAct_9fa48("2949") ? true : (stryCov_9fa48("2949", "2950"), search)) {
        if (stryMutAct_9fa48("2951")) {
          {}
        } else {
          stryCov_9fa48("2951");
          queryParams[stryMutAct_9fa48("2952") ? "" : (stryCov_9fa48("2952"), 'highlight')] = search;
        }
      }
      if (stryMutAct_9fa48("2954") ? false : stryMutAct_9fa48("2953") ? true : (stryCov_9fa48("2953", "2954"), search)) {
        if (stryMutAct_9fa48("2955")) {
          {}
        } else {
          stryCov_9fa48("2955");
          queryParams[stryMutAct_9fa48("2956") ? "" : (stryCov_9fa48("2956"), 'search')] = search;
        }
      }
      queryParams[stryMutAct_9fa48("2957") ? "" : (stryCov_9fa48("2957"), 'fromNotification')] = stryMutAct_9fa48("2958") ? "" : (stryCov_9fa48("2958"), 'true');
      this.router.navigate(stryMutAct_9fa48("2959") ? [] : (stryCov_9fa48("2959"), [baseRoute]), stryMutAct_9fa48("2960") ? {} : (stryCov_9fa48("2960"), {
        queryParams
      }));
    }
  }
}