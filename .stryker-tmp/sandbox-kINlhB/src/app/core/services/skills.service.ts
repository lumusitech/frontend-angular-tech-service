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
import { Skill, CreateSkillDto, UpdateSkillDto, SkillFilters } from '../models/skill.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
@Service()
export class SkillsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("981") ? "" : (stryCov_9fa48("981"), '/api/skills');
  getAll(filters?: SkillFilters): Observable<PaginatedResponse<Skill>> {
    if (stryMutAct_9fa48("982")) {
      {}
    } else {
      stryCov_9fa48("982");
      let params = new HttpParams();
      if (stryMutAct_9fa48("985") ? filters.search : stryMutAct_9fa48("984") ? false : stryMutAct_9fa48("983") ? true : (stryCov_9fa48("983", "984", "985"), filters?.search)) params = params.set(stryMutAct_9fa48("986") ? "" : (stryCov_9fa48("986"), 'search'), filters.search);
      if (stryMutAct_9fa48("989") ? filters.category : stryMutAct_9fa48("988") ? false : stryMutAct_9fa48("987") ? true : (stryCov_9fa48("987", "988", "989"), filters?.category)) params = params.set(stryMutAct_9fa48("990") ? "" : (stryCov_9fa48("990"), 'category'), filters.category);
      if (stryMutAct_9fa48("993") ? filters?.isActive === undefined : stryMutAct_9fa48("992") ? false : stryMutAct_9fa48("991") ? true : (stryCov_9fa48("991", "992", "993"), (stryMutAct_9fa48("994") ? filters.isActive : (stryCov_9fa48("994"), filters?.isActive)) !== undefined)) params = params.set(stryMutAct_9fa48("995") ? "" : (stryCov_9fa48("995"), 'isActive'), filters.isActive.toString());
      if (stryMutAct_9fa48("998") ? filters.page : stryMutAct_9fa48("997") ? false : stryMutAct_9fa48("996") ? true : (stryCov_9fa48("996", "997", "998"), filters?.page)) params = params.set(stryMutAct_9fa48("999") ? "" : (stryCov_9fa48("999"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("1002") ? filters.limit : stryMutAct_9fa48("1001") ? false : stryMutAct_9fa48("1000") ? true : (stryCov_9fa48("1000", "1001", "1002"), filters?.limit)) params = params.set(stryMutAct_9fa48("1003") ? "" : (stryCov_9fa48("1003"), 'limit'), filters.limit.toString());
      return this.http.get<PaginatedResponse<Skill>>(this.apiUrl, stryMutAct_9fa48("1004") ? {} : (stryCov_9fa48("1004"), {
        params
      }));
    }
  }
  getById(id: string): Observable<Skill> {
    if (stryMutAct_9fa48("1005")) {
      {}
    } else {
      stryCov_9fa48("1005");
      return this.http.get<Skill>(stryMutAct_9fa48("1006") ? `` : (stryCov_9fa48("1006"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreateSkillDto): Observable<Skill> {
    if (stryMutAct_9fa48("1007")) {
      {}
    } else {
      stryCov_9fa48("1007");
      return this.http.post<Skill>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdateSkillDto): Observable<Skill> {
    if (stryMutAct_9fa48("1008")) {
      {}
    } else {
      stryCov_9fa48("1008");
      return this.http.patch<Skill>(stryMutAct_9fa48("1009") ? `` : (stryCov_9fa48("1009"), `${this.apiUrl}/${id}`), dto);
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("1010")) {
      {}
    } else {
      stryCov_9fa48("1010");
      return this.http.delete<void>(stryMutAct_9fa48("1011") ? `` : (stryCov_9fa48("1011"), `${this.apiUrl}/${id}`));
    }
  }
}