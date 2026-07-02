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
import { Client, CreateClientDto, UpdateClientDto, ClientFilters, PaginatedResponse } from '../models/client.interfaces';
@Service()
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("484") ? "" : (stryCov_9fa48("484"), '/api/clients');
  getAll(filters?: ClientFilters): Observable<PaginatedResponse<Client>> {
    if (stryMutAct_9fa48("485")) {
      {}
    } else {
      stryCov_9fa48("485");
      let params = new HttpParams();
      if (stryMutAct_9fa48("488") ? filters.search : stryMutAct_9fa48("487") ? false : stryMutAct_9fa48("486") ? true : (stryCov_9fa48("486", "487", "488"), filters?.search)) params = params.set(stryMutAct_9fa48("489") ? "" : (stryCov_9fa48("489"), 'search'), filters.search);
      if (stryMutAct_9fa48("492") ? filters?.isActive === undefined : stryMutAct_9fa48("491") ? false : stryMutAct_9fa48("490") ? true : (stryCov_9fa48("490", "491", "492"), (stryMutAct_9fa48("493") ? filters.isActive : (stryCov_9fa48("493"), filters?.isActive)) !== undefined)) params = params.set(stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), 'isActive'), filters.isActive.toString());
      if (stryMutAct_9fa48("497") ? filters.page : stryMutAct_9fa48("496") ? false : stryMutAct_9fa48("495") ? true : (stryCov_9fa48("495", "496", "497"), filters?.page)) params = params.set(stryMutAct_9fa48("498") ? "" : (stryCov_9fa48("498"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("501") ? filters.limit : stryMutAct_9fa48("500") ? false : stryMutAct_9fa48("499") ? true : (stryCov_9fa48("499", "500", "501"), filters?.limit)) params = params.set(stryMutAct_9fa48("502") ? "" : (stryCov_9fa48("502"), 'limit'), filters.limit.toString());
      return this.http.get<PaginatedResponse<Client>>(this.apiUrl, stryMutAct_9fa48("503") ? {} : (stryCov_9fa48("503"), {
        params
      }));
    }
  }
  getById(id: string): Observable<Client> {
    if (stryMutAct_9fa48("504")) {
      {}
    } else {
      stryCov_9fa48("504");
      return this.http.get<Client>(stryMutAct_9fa48("505") ? `` : (stryCov_9fa48("505"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreateClientDto): Observable<Client> {
    if (stryMutAct_9fa48("506")) {
      {}
    } else {
      stryCov_9fa48("506");
      return this.http.post<Client>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdateClientDto): Observable<Client> {
    if (stryMutAct_9fa48("507")) {
      {}
    } else {
      stryCov_9fa48("507");
      return this.http.patch<Client>(stryMutAct_9fa48("508") ? `` : (stryCov_9fa48("508"), `${this.apiUrl}/${id}`), dto);
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("509")) {
      {}
    } else {
      stryCov_9fa48("509");
      return this.http.delete<void>(stryMutAct_9fa48("510") ? `` : (stryCov_9fa48("510"), `${this.apiUrl}/${id}`));
    }
  }
}