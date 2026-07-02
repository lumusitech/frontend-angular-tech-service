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
import { ServiceType, CreateServiceTypeDto, UpdateServiceTypeDto, ServiceTypeFilters } from '../models/service-type.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
@Service()
export class ServiceTypesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("954") ? "" : (stryCov_9fa48("954"), '/api/service-types');
  getAll(filters?: ServiceTypeFilters): Observable<PaginatedResponse<ServiceType>> {
    if (stryMutAct_9fa48("955")) {
      {}
    } else {
      stryCov_9fa48("955");
      let params = new HttpParams();
      if (stryMutAct_9fa48("958") ? filters.search : stryMutAct_9fa48("957") ? false : stryMutAct_9fa48("956") ? true : (stryCov_9fa48("956", "957", "958"), filters?.search)) params = params.set(stryMutAct_9fa48("959") ? "" : (stryCov_9fa48("959"), 'search'), filters.search);
      if (stryMutAct_9fa48("962") ? filters?.isActive === undefined : stryMutAct_9fa48("961") ? false : stryMutAct_9fa48("960") ? true : (stryCov_9fa48("960", "961", "962"), (stryMutAct_9fa48("963") ? filters.isActive : (stryCov_9fa48("963"), filters?.isActive)) !== undefined)) params = params.set(stryMutAct_9fa48("964") ? "" : (stryCov_9fa48("964"), 'isActive'), filters.isActive.toString());
      if (stryMutAct_9fa48("967") ? filters.page : stryMutAct_9fa48("966") ? false : stryMutAct_9fa48("965") ? true : (stryCov_9fa48("965", "966", "967"), filters?.page)) params = params.set(stryMutAct_9fa48("968") ? "" : (stryCov_9fa48("968"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("971") ? filters.limit : stryMutAct_9fa48("970") ? false : stryMutAct_9fa48("969") ? true : (stryCov_9fa48("969", "970", "971"), filters?.limit)) params = params.set(stryMutAct_9fa48("972") ? "" : (stryCov_9fa48("972"), 'limit'), filters.limit.toString());
      return this.http.get<PaginatedResponse<ServiceType>>(this.apiUrl, stryMutAct_9fa48("973") ? {} : (stryCov_9fa48("973"), {
        params
      }));
    }
  }
  getById(id: string): Observable<ServiceType> {
    if (stryMutAct_9fa48("974")) {
      {}
    } else {
      stryCov_9fa48("974");
      return this.http.get<ServiceType>(stryMutAct_9fa48("975") ? `` : (stryCov_9fa48("975"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreateServiceTypeDto): Observable<ServiceType> {
    if (stryMutAct_9fa48("976")) {
      {}
    } else {
      stryCov_9fa48("976");
      return this.http.post<ServiceType>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdateServiceTypeDto): Observable<ServiceType> {
    if (stryMutAct_9fa48("977")) {
      {}
    } else {
      stryCov_9fa48("977");
      return this.http.patch<ServiceType>(stryMutAct_9fa48("978") ? `` : (stryCov_9fa48("978"), `${this.apiUrl}/${id}`), dto);
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("979")) {
      {}
    } else {
      stryCov_9fa48("979");
      return this.http.delete<void>(stryMutAct_9fa48("980") ? `` : (stryCov_9fa48("980"), `${this.apiUrl}/${id}`));
    }
  }
}