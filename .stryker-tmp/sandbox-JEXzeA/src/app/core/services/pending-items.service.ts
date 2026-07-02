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
import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PendingItem, CreatePendingItemDto, UpdatePendingItemDto, PendingItemFilters, PaginatedResponse } from '../models/pending-item.interfaces';
@Service()
export class PendingItemsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("733") ? "" : (stryCov_9fa48("733"), '/api/pending-items');
  getAll(filters?: PendingItemFilters): Observable<PaginatedResponse<PendingItem>> {
    if (stryMutAct_9fa48("734")) {
      {}
    } else {
      stryCov_9fa48("734");
      let params = new HttpParams();
      if (stryMutAct_9fa48("737") ? filters.status : stryMutAct_9fa48("736") ? false : stryMutAct_9fa48("735") ? true : (stryCov_9fa48("735", "736", "737"), filters?.status)) params = params.set(stryMutAct_9fa48("738") ? "" : (stryCov_9fa48("738"), 'status'), filters.status);
      if (stryMutAct_9fa48("741") ? filters.priority : stryMutAct_9fa48("740") ? false : stryMutAct_9fa48("739") ? true : (stryCov_9fa48("739", "740", "741"), filters?.priority)) params = params.set(stryMutAct_9fa48("742") ? "" : (stryCov_9fa48("742"), 'priority'), filters.priority);
      if (stryMutAct_9fa48("745") ? filters.type : stryMutAct_9fa48("744") ? false : stryMutAct_9fa48("743") ? true : (stryCov_9fa48("743", "744", "745"), filters?.type)) params = params.set(stryMutAct_9fa48("746") ? "" : (stryCov_9fa48("746"), 'type'), filters.type);
      if (stryMutAct_9fa48("749") ? filters.assignedToId : stryMutAct_9fa48("748") ? false : stryMutAct_9fa48("747") ? true : (stryCov_9fa48("747", "748", "749"), filters?.assignedToId)) params = params.set(stryMutAct_9fa48("750") ? "" : (stryCov_9fa48("750"), 'assignedToId'), filters.assignedToId);
      if (stryMutAct_9fa48("753") ? filters.dueDateFrom : stryMutAct_9fa48("752") ? false : stryMutAct_9fa48("751") ? true : (stryCov_9fa48("751", "752", "753"), filters?.dueDateFrom)) params = params.set(stryMutAct_9fa48("754") ? "" : (stryCov_9fa48("754"), 'dueDateFrom'), filters.dueDateFrom);
      if (stryMutAct_9fa48("757") ? filters.dueDateTo : stryMutAct_9fa48("756") ? false : stryMutAct_9fa48("755") ? true : (stryCov_9fa48("755", "756", "757"), filters?.dueDateTo)) params = params.set(stryMutAct_9fa48("758") ? "" : (stryCov_9fa48("758"), 'dueDateTo'), filters.dueDateTo);
      if (stryMutAct_9fa48("761") ? filters.page : stryMutAct_9fa48("760") ? false : stryMutAct_9fa48("759") ? true : (stryCov_9fa48("759", "760", "761"), filters?.page)) params = params.set(stryMutAct_9fa48("762") ? "" : (stryCov_9fa48("762"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("765") ? filters.limit : stryMutAct_9fa48("764") ? false : stryMutAct_9fa48("763") ? true : (stryCov_9fa48("763", "764", "765"), filters?.limit)) params = params.set(stryMutAct_9fa48("766") ? "" : (stryCov_9fa48("766"), 'limit'), filters.limit.toString());
      if (stryMutAct_9fa48("769") ? filters.sortBy : stryMutAct_9fa48("768") ? false : stryMutAct_9fa48("767") ? true : (stryCov_9fa48("767", "768", "769"), filters?.sortBy)) params = params.set(stryMutAct_9fa48("770") ? "" : (stryCov_9fa48("770"), 'sortBy'), filters.sortBy);
      if (stryMutAct_9fa48("773") ? filters.order : stryMutAct_9fa48("772") ? false : stryMutAct_9fa48("771") ? true : (stryCov_9fa48("771", "772", "773"), filters?.order)) params = params.set(stryMutAct_9fa48("774") ? "" : (stryCov_9fa48("774"), 'order'), filters.order);
      return this.http.get<PaginatedResponse<PendingItem>>(this.apiUrl, stryMutAct_9fa48("775") ? {} : (stryCov_9fa48("775"), {
        params
      }));
    }
  }
  getById(id: string): Observable<PendingItem> {
    if (stryMutAct_9fa48("776")) {
      {}
    } else {
      stryCov_9fa48("776");
      return this.http.get<PendingItem>(stryMutAct_9fa48("777") ? `` : (stryCov_9fa48("777"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreatePendingItemDto): Observable<PendingItem> {
    if (stryMutAct_9fa48("778")) {
      {}
    } else {
      stryCov_9fa48("778");
      return this.http.post<PendingItem>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdatePendingItemDto): Observable<PendingItem> {
    if (stryMutAct_9fa48("779")) {
      {}
    } else {
      stryCov_9fa48("779");
      return this.http.patch<PendingItem>(stryMutAct_9fa48("780") ? `` : (stryCov_9fa48("780"), `${this.apiUrl}/${id}`), dto);
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("781")) {
      {}
    } else {
      stryCov_9fa48("781");
      return this.http.delete<void>(stryMutAct_9fa48("782") ? `` : (stryCov_9fa48("782"), `${this.apiUrl}/${id}`));
    }
  }
}