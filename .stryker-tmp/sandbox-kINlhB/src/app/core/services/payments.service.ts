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
import { Payment, CreatePaymentDto, UpdatePaymentDto, PaymentFilters } from '../models/payment.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
@Service()
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("702") ? "" : (stryCov_9fa48("702"), '/api/payments');
  getAll(filters?: PaymentFilters): Observable<PaginatedResponse<Payment>> {
    if (stryMutAct_9fa48("703")) {
      {}
    } else {
      stryCov_9fa48("703");
      let params = new HttpParams();
      if (stryMutAct_9fa48("706") ? filters.status : stryMutAct_9fa48("705") ? false : stryMutAct_9fa48("704") ? true : (stryCov_9fa48("704", "705", "706"), filters?.status)) params = params.set(stryMutAct_9fa48("707") ? "" : (stryCov_9fa48("707"), 'status'), filters.status);
      if (stryMutAct_9fa48("710") ? filters.method : stryMutAct_9fa48("709") ? false : stryMutAct_9fa48("708") ? true : (stryCov_9fa48("708", "709", "710"), filters?.method)) params = params.set(stryMutAct_9fa48("711") ? "" : (stryCov_9fa48("711"), 'method'), filters.method);
      if (stryMutAct_9fa48("714") ? filters.workOrderId : stryMutAct_9fa48("713") ? false : stryMutAct_9fa48("712") ? true : (stryCov_9fa48("712", "713", "714"), filters?.workOrderId)) params = params.set(stryMutAct_9fa48("715") ? "" : (stryCov_9fa48("715"), 'workOrderId'), filters.workOrderId);
      if (stryMutAct_9fa48("718") ? filters.page : stryMutAct_9fa48("717") ? false : stryMutAct_9fa48("716") ? true : (stryCov_9fa48("716", "717", "718"), filters?.page)) params = params.set(stryMutAct_9fa48("719") ? "" : (stryCov_9fa48("719"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("722") ? filters.limit : stryMutAct_9fa48("721") ? false : stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720", "721", "722"), filters?.limit)) params = params.set(stryMutAct_9fa48("723") ? "" : (stryCov_9fa48("723"), 'limit'), filters.limit.toString());
      return this.http.get<PaginatedResponse<Payment>>(this.apiUrl, stryMutAct_9fa48("724") ? {} : (stryCov_9fa48("724"), {
        params
      }));
    }
  }
  getById(id: string): Observable<Payment> {
    if (stryMutAct_9fa48("725")) {
      {}
    } else {
      stryCov_9fa48("725");
      return this.http.get<Payment>(stryMutAct_9fa48("726") ? `` : (stryCov_9fa48("726"), `${this.apiUrl}/${id}`));
    }
  }
  create(workOrderId: string, dto: CreatePaymentDto): Observable<Payment> {
    if (stryMutAct_9fa48("727")) {
      {}
    } else {
      stryCov_9fa48("727");
      return this.http.post<Payment>(stryMutAct_9fa48("728") ? `` : (stryCov_9fa48("728"), `/api/work-orders/${workOrderId}/payments`), dto);
    }
  }
  update(id: string, dto: UpdatePaymentDto): Observable<Payment> {
    if (stryMutAct_9fa48("729")) {
      {}
    } else {
      stryCov_9fa48("729");
      return this.http.patch<Payment>(stryMutAct_9fa48("730") ? `` : (stryCov_9fa48("730"), `${this.apiUrl}/${id}`), dto);
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("731")) {
      {}
    } else {
      stryCov_9fa48("731");
      return this.http.delete<void>(stryMutAct_9fa48("732") ? `` : (stryCov_9fa48("732"), `${this.apiUrl}/${id}`));
    }
  }
}