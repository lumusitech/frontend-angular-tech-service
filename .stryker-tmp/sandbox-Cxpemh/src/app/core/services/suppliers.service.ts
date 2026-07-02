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
import { Supplier, CreateSupplierDto, UpdateSupplierDto, SupplierFilters } from '../models/supplier.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
@Service()
export class SuppliersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("1012") ? "" : (stryCov_9fa48("1012"), '/api/suppliers');
  getAll(filters?: SupplierFilters): Observable<PaginatedResponse<Supplier>> {
    if (stryMutAct_9fa48("1013")) {
      {}
    } else {
      stryCov_9fa48("1013");
      let params = new HttpParams();
      if (stryMutAct_9fa48("1016") ? filters.search : stryMutAct_9fa48("1015") ? false : stryMutAct_9fa48("1014") ? true : (stryCov_9fa48("1014", "1015", "1016"), filters?.search)) params = params.set(stryMutAct_9fa48("1017") ? "" : (stryCov_9fa48("1017"), 'search'), filters.search);
      if (stryMutAct_9fa48("1020") ? filters?.isActive === undefined : stryMutAct_9fa48("1019") ? false : stryMutAct_9fa48("1018") ? true : (stryCov_9fa48("1018", "1019", "1020"), (stryMutAct_9fa48("1021") ? filters.isActive : (stryCov_9fa48("1021"), filters?.isActive)) !== undefined)) params = params.set(stryMutAct_9fa48("1022") ? "" : (stryCov_9fa48("1022"), 'isActive'), filters.isActive.toString());
      if (stryMutAct_9fa48("1025") ? filters.page : stryMutAct_9fa48("1024") ? false : stryMutAct_9fa48("1023") ? true : (stryCov_9fa48("1023", "1024", "1025"), filters?.page)) params = params.set(stryMutAct_9fa48("1026") ? "" : (stryCov_9fa48("1026"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("1029") ? filters.limit : stryMutAct_9fa48("1028") ? false : stryMutAct_9fa48("1027") ? true : (stryCov_9fa48("1027", "1028", "1029"), filters?.limit)) params = params.set(stryMutAct_9fa48("1030") ? "" : (stryCov_9fa48("1030"), 'limit'), filters.limit.toString());
      return this.http.get<PaginatedResponse<Supplier>>(this.apiUrl, stryMutAct_9fa48("1031") ? {} : (stryCov_9fa48("1031"), {
        params
      }));
    }
  }
  getById(id: string): Observable<Supplier> {
    if (stryMutAct_9fa48("1032")) {
      {}
    } else {
      stryCov_9fa48("1032");
      return this.http.get<Supplier>(stryMutAct_9fa48("1033") ? `` : (stryCov_9fa48("1033"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreateSupplierDto): Observable<Supplier> {
    if (stryMutAct_9fa48("1034")) {
      {}
    } else {
      stryCov_9fa48("1034");
      return this.http.post<Supplier>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdateSupplierDto): Observable<Supplier> {
    if (stryMutAct_9fa48("1035")) {
      {}
    } else {
      stryCov_9fa48("1035");
      return this.http.patch<Supplier>(stryMutAct_9fa48("1036") ? `` : (stryCov_9fa48("1036"), `${this.apiUrl}/${id}`), dto);
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("1037")) {
      {}
    } else {
      stryCov_9fa48("1037");
      return this.http.delete<void>(stryMutAct_9fa48("1038") ? `` : (stryCov_9fa48("1038"), `${this.apiUrl}/${id}`));
    }
  }
}