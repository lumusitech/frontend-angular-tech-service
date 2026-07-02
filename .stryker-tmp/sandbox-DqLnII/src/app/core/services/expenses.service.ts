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
import { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseFilters } from '../models/expense.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
@Service()
export class ExpensesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), '/api/expenses');
  getAll(filters?: ExpenseFilters): Observable<PaginatedResponse<Expense>> {
    if (stryMutAct_9fa48("552")) {
      {}
    } else {
      stryCov_9fa48("552");
      let params = new HttpParams();
      if (stryMutAct_9fa48("555") ? filters.category : stryMutAct_9fa48("554") ? false : stryMutAct_9fa48("553") ? true : (stryCov_9fa48("553", "554", "555"), filters?.category)) params = params.set(stryMutAct_9fa48("556") ? "" : (stryCov_9fa48("556"), 'category'), filters.category);
      if (stryMutAct_9fa48("559") ? filters?.isRecurring === undefined : stryMutAct_9fa48("558") ? false : stryMutAct_9fa48("557") ? true : (stryCov_9fa48("557", "558", "559"), (stryMutAct_9fa48("560") ? filters.isRecurring : (stryCov_9fa48("560"), filters?.isRecurring)) !== undefined)) params = params.set(stryMutAct_9fa48("561") ? "" : (stryCov_9fa48("561"), 'isRecurring'), filters.isRecurring.toString());
      if (stryMutAct_9fa48("564") ? filters.startDate : stryMutAct_9fa48("563") ? false : stryMutAct_9fa48("562") ? true : (stryCov_9fa48("562", "563", "564"), filters?.startDate)) params = params.set(stryMutAct_9fa48("565") ? "" : (stryCov_9fa48("565"), 'dateFrom'), filters.startDate);
      if (stryMutAct_9fa48("568") ? filters.endDate : stryMutAct_9fa48("567") ? false : stryMutAct_9fa48("566") ? true : (stryCov_9fa48("566", "567", "568"), filters?.endDate)) params = params.set(stryMutAct_9fa48("569") ? "" : (stryCov_9fa48("569"), 'dateTo'), filters.endDate);
      if (stryMutAct_9fa48("572") ? filters.page : stryMutAct_9fa48("571") ? false : stryMutAct_9fa48("570") ? true : (stryCov_9fa48("570", "571", "572"), filters?.page)) params = params.set(stryMutAct_9fa48("573") ? "" : (stryCov_9fa48("573"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("576") ? filters.limit : stryMutAct_9fa48("575") ? false : stryMutAct_9fa48("574") ? true : (stryCov_9fa48("574", "575", "576"), filters?.limit)) params = params.set(stryMutAct_9fa48("577") ? "" : (stryCov_9fa48("577"), 'limit'), filters.limit.toString());
      return this.http.get<PaginatedResponse<Expense>>(this.apiUrl, stryMutAct_9fa48("578") ? {} : (stryCov_9fa48("578"), {
        params
      }));
    }
  }
  getById(id: string): Observable<Expense> {
    if (stryMutAct_9fa48("579")) {
      {}
    } else {
      stryCov_9fa48("579");
      return this.http.get<Expense>(stryMutAct_9fa48("580") ? `` : (stryCov_9fa48("580"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreateExpenseDto): Observable<Expense> {
    if (stryMutAct_9fa48("581")) {
      {}
    } else {
      stryCov_9fa48("581");
      return this.http.post<Expense>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdateExpenseDto): Observable<Expense> {
    if (stryMutAct_9fa48("582")) {
      {}
    } else {
      stryCov_9fa48("582");
      return this.http.patch<Expense>(stryMutAct_9fa48("583") ? `` : (stryCov_9fa48("583"), `${this.apiUrl}/${id}`), dto);
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("584")) {
      {}
    } else {
      stryCov_9fa48("584");
      return this.http.delete<void>(stryMutAct_9fa48("585") ? `` : (stryCov_9fa48("585"), `${this.apiUrl}/${id}`));
    }
  }
}