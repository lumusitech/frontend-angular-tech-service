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
import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppNotification, NotificationFilters, PaginatedNotifications } from '../models/notification.interfaces';
@Service()
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("665") ? "" : (stryCov_9fa48("665"), '/api/notifications');
  readonly unreadCount = signal(0);
  getAll(filters?: NotificationFilters): Observable<PaginatedNotifications> {
    if (stryMutAct_9fa48("666")) {
      {}
    } else {
      stryCov_9fa48("666");
      let params = new HttpParams();
      if (stryMutAct_9fa48("669") ? filters.page : stryMutAct_9fa48("668") ? false : stryMutAct_9fa48("667") ? true : (stryCov_9fa48("667", "668", "669"), filters?.page)) params = params.set(stryMutAct_9fa48("670") ? "" : (stryCov_9fa48("670"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("673") ? filters.limit : stryMutAct_9fa48("672") ? false : stryMutAct_9fa48("671") ? true : (stryCov_9fa48("671", "672", "673"), filters?.limit)) params = params.set(stryMutAct_9fa48("674") ? "" : (stryCov_9fa48("674"), 'limit'), filters.limit.toString());
      if (stryMutAct_9fa48("677") ? filters.sortBy : stryMutAct_9fa48("676") ? false : stryMutAct_9fa48("675") ? true : (stryCov_9fa48("675", "676", "677"), filters?.sortBy)) params = params.set(stryMutAct_9fa48("678") ? "" : (stryCov_9fa48("678"), 'sortBy'), filters.sortBy);
      if (stryMutAct_9fa48("681") ? filters.order : stryMutAct_9fa48("680") ? false : stryMutAct_9fa48("679") ? true : (stryCov_9fa48("679", "680", "681"), filters?.order)) params = params.set(stryMutAct_9fa48("682") ? "" : (stryCov_9fa48("682"), 'order'), filters.order);
      if (stryMutAct_9fa48("685") ? filters.type : stryMutAct_9fa48("684") ? false : stryMutAct_9fa48("683") ? true : (stryCov_9fa48("683", "684", "685"), filters?.type)) params = params.set(stryMutAct_9fa48("686") ? "" : (stryCov_9fa48("686"), 'type'), filters.type);
      if (stryMutAct_9fa48("689") ? filters?.isRead === undefined : stryMutAct_9fa48("688") ? false : stryMutAct_9fa48("687") ? true : (stryCov_9fa48("687", "688", "689"), (stryMutAct_9fa48("690") ? filters.isRead : (stryCov_9fa48("690"), filters?.isRead)) !== undefined)) params = params.set(stryMutAct_9fa48("691") ? "" : (stryCov_9fa48("691"), 'isRead'), filters.isRead.toString());
      return this.http.get<PaginatedNotifications>(this.apiUrl, stryMutAct_9fa48("692") ? {} : (stryCov_9fa48("692"), {
        params
      }));
    }
  }
  getUnreadCount(): Observable<number> {
    if (stryMutAct_9fa48("693")) {
      {}
    } else {
      stryCov_9fa48("693");
      return this.http.get<number>(stryMutAct_9fa48("694") ? `` : (stryCov_9fa48("694"), `${this.apiUrl}/unread-count`));
    }
  }
  markAsRead(id: string): Observable<AppNotification> {
    if (stryMutAct_9fa48("695")) {
      {}
    } else {
      stryCov_9fa48("695");
      return this.http.patch<AppNotification>(stryMutAct_9fa48("696") ? `` : (stryCov_9fa48("696"), `${this.apiUrl}/${id}/read`), {});
    }
  }
  markAllAsRead(): Observable<void> {
    if (stryMutAct_9fa48("697")) {
      {}
    } else {
      stryCov_9fa48("697");
      return this.http.patch<void>(stryMutAct_9fa48("698") ? `` : (stryCov_9fa48("698"), `${this.apiUrl}/read-all`), {});
    }
  }
  incrementUnread(): void {
    if (stryMutAct_9fa48("699")) {
      {}
    } else {
      stryCov_9fa48("699");
      this.unreadCount.update(stryMutAct_9fa48("700") ? () => undefined : (stryCov_9fa48("700"), c => stryMutAct_9fa48("701") ? c - 1 : (stryCov_9fa48("701"), c + 1)));
    }
  }
}