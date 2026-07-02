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
import { Invoice, InvoiceFilters } from '../models/invoice.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
@Service()
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("427") ? "" : (stryCov_9fa48("427"), '/api/billing/invoices');
  getAll(filters?: InvoiceFilters): Observable<PaginatedResponse<Invoice>> {
    if (stryMutAct_9fa48("428")) {
      {}
    } else {
      stryCov_9fa48("428");
      let params = new HttpParams();
      if (stryMutAct_9fa48("431") ? filters.status : stryMutAct_9fa48("430") ? false : stryMutAct_9fa48("429") ? true : (stryCov_9fa48("429", "430", "431"), filters?.status)) params = params.set(stryMutAct_9fa48("432") ? "" : (stryCov_9fa48("432"), 'status'), filters.status);
      if (stryMutAct_9fa48("435") ? filters.invoiceType : stryMutAct_9fa48("434") ? false : stryMutAct_9fa48("433") ? true : (stryCov_9fa48("433", "434", "435"), filters?.invoiceType)) params = params.set(stryMutAct_9fa48("436") ? "" : (stryCov_9fa48("436"), 'invoiceType'), filters.invoiceType);
      if (stryMutAct_9fa48("439") ? filters.dateFrom : stryMutAct_9fa48("438") ? false : stryMutAct_9fa48("437") ? true : (stryCov_9fa48("437", "438", "439"), filters?.dateFrom)) params = params.set(stryMutAct_9fa48("440") ? "" : (stryCov_9fa48("440"), 'dateFrom'), filters.dateFrom);
      if (stryMutAct_9fa48("443") ? filters.dateTo : stryMutAct_9fa48("442") ? false : stryMutAct_9fa48("441") ? true : (stryCov_9fa48("441", "442", "443"), filters?.dateTo)) params = params.set(stryMutAct_9fa48("444") ? "" : (stryCov_9fa48("444"), 'dateTo'), filters.dateTo);
      if (stryMutAct_9fa48("447") ? filters.clientName : stryMutAct_9fa48("446") ? false : stryMutAct_9fa48("445") ? true : (stryCov_9fa48("445", "446", "447"), filters?.clientName)) params = params.set(stryMutAct_9fa48("448") ? "" : (stryCov_9fa48("448"), 'clientName'), filters.clientName);
      if (stryMutAct_9fa48("451") ? filters.page : stryMutAct_9fa48("450") ? false : stryMutAct_9fa48("449") ? true : (stryCov_9fa48("449", "450", "451"), filters?.page)) params = params.set(stryMutAct_9fa48("452") ? "" : (stryCov_9fa48("452"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("455") ? filters.limit : stryMutAct_9fa48("454") ? false : stryMutAct_9fa48("453") ? true : (stryCov_9fa48("453", "454", "455"), filters?.limit)) params = params.set(stryMutAct_9fa48("456") ? "" : (stryCov_9fa48("456"), 'limit'), filters.limit.toString());
      if (stryMutAct_9fa48("459") ? filters.sortBy : stryMutAct_9fa48("458") ? false : stryMutAct_9fa48("457") ? true : (stryCov_9fa48("457", "458", "459"), filters?.sortBy)) params = params.set(stryMutAct_9fa48("460") ? "" : (stryCov_9fa48("460"), 'sortBy'), filters.sortBy);
      if (stryMutAct_9fa48("463") ? filters.order : stryMutAct_9fa48("462") ? false : stryMutAct_9fa48("461") ? true : (stryCov_9fa48("461", "462", "463"), filters?.order)) params = params.set(stryMutAct_9fa48("464") ? "" : (stryCov_9fa48("464"), 'order'), filters.order);
      return this.http.get<PaginatedResponse<Invoice>>(this.apiUrl, stryMutAct_9fa48("465") ? {} : (stryCov_9fa48("465"), {
        params
      }));
    }
  }
  getById(id: string): Observable<Invoice> {
    if (stryMutAct_9fa48("466")) {
      {}
    } else {
      stryCov_9fa48("466");
      return this.http.get<Invoice>(stryMutAct_9fa48("467") ? `` : (stryCov_9fa48("467"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: {
    invoiceType: 'A' | 'B' | 'C';
    clientName: string;
    clientCuit?: string;
    clientAddress: string;
    clientIvaCondition?: string;
    concept?: string;
    subtotal: number;
    ivaAmount?: number;
    total: number;
    workOrderId: string;
    paymentId?: string;
  }): Observable<Invoice> {
    if (stryMutAct_9fa48("468")) {
      {}
    } else {
      stryCov_9fa48("468");
      return this.http.post<Invoice>(this.apiUrl, dto);
    }
  }
  issue(id: string): Observable<Invoice> {
    if (stryMutAct_9fa48("469")) {
      {}
    } else {
      stryCov_9fa48("469");
      return this.http.post<Invoice>(stryMutAct_9fa48("470") ? `` : (stryCov_9fa48("470"), `${this.apiUrl}/${id}/issue`), {});
    }
  }
  cancel(id: string): Observable<Invoice> {
    if (stryMutAct_9fa48("471")) {
      {}
    } else {
      stryCov_9fa48("471");
      return this.http.post<Invoice>(stryMutAct_9fa48("472") ? `` : (stryCov_9fa48("472"), `${this.apiUrl}/${id}/cancel`), {});
    }
  }
  downloadPdf(id: string): Observable<Blob> {
    if (stryMutAct_9fa48("473")) {
      {}
    } else {
      stryCov_9fa48("473");
      return this.http.get(stryMutAct_9fa48("474") ? `` : (stryCov_9fa48("474"), `${this.apiUrl}/${id}/pdf`), stryMutAct_9fa48("475") ? {} : (stryCov_9fa48("475"), {
        responseType: stryMutAct_9fa48("476") ? "" : (stryCov_9fa48("476"), 'blob')
      }));
    }
  }
}