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
import { PeriodFilter, SummaryReport, IncomeReport, ExpenseReport, ProfitReport, ServicesReport, TechnicianRanking, TechnicianDetail, ClientReport } from '../models/report.interfaces';
@Service()
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("908") ? "" : (stryCov_9fa48("908"), '/api/reports');
  private buildPeriodParams(filters?: PeriodFilter): HttpParams {
    if (stryMutAct_9fa48("909")) {
      {}
    } else {
      stryCov_9fa48("909");
      let params = new HttpParams();
      if (stryMutAct_9fa48("912") ? filters.period : stryMutAct_9fa48("911") ? false : stryMutAct_9fa48("910") ? true : (stryCov_9fa48("910", "911", "912"), filters?.period)) params = params.set(stryMutAct_9fa48("913") ? "" : (stryCov_9fa48("913"), 'period'), filters.period);
      if (stryMutAct_9fa48("916") ? filters.dateFrom : stryMutAct_9fa48("915") ? false : stryMutAct_9fa48("914") ? true : (stryCov_9fa48("914", "915", "916"), filters?.dateFrom)) params = params.set(stryMutAct_9fa48("917") ? "" : (stryCov_9fa48("917"), 'dateFrom'), filters.dateFrom);
      if (stryMutAct_9fa48("920") ? filters.dateTo : stryMutAct_9fa48("919") ? false : stryMutAct_9fa48("918") ? true : (stryCov_9fa48("918", "919", "920"), filters?.dateTo)) params = params.set(stryMutAct_9fa48("921") ? "" : (stryCov_9fa48("921"), 'dateTo'), filters.dateTo);
      if (stryMutAct_9fa48("924") ? filters.category : stryMutAct_9fa48("923") ? false : stryMutAct_9fa48("922") ? true : (stryCov_9fa48("922", "923", "924"), filters?.category)) params = params.set(stryMutAct_9fa48("925") ? "" : (stryCov_9fa48("925"), 'category'), filters.category);
      return params;
    }
  }
  getSummary(): Observable<SummaryReport> {
    if (stryMutAct_9fa48("926")) {
      {}
    } else {
      stryCov_9fa48("926");
      return this.http.get<SummaryReport>(stryMutAct_9fa48("927") ? `` : (stryCov_9fa48("927"), `${this.apiUrl}/summary`));
    }
  }
  getIncome(filters?: PeriodFilter): Observable<IncomeReport> {
    if (stryMutAct_9fa48("928")) {
      {}
    } else {
      stryCov_9fa48("928");
      return this.http.get<IncomeReport>(stryMutAct_9fa48("929") ? `` : (stryCov_9fa48("929"), `${this.apiUrl}/income`), stryMutAct_9fa48("930") ? {} : (stryCov_9fa48("930"), {
        params: this.buildPeriodParams(filters)
      }));
    }
  }
  getExpenses(filters?: PeriodFilter): Observable<ExpenseReport> {
    if (stryMutAct_9fa48("931")) {
      {}
    } else {
      stryCov_9fa48("931");
      return this.http.get<ExpenseReport>(stryMutAct_9fa48("932") ? `` : (stryCov_9fa48("932"), `${this.apiUrl}/expenses`), stryMutAct_9fa48("933") ? {} : (stryCov_9fa48("933"), {
        params: this.buildPeriodParams(filters)
      }));
    }
  }
  getProfit(filters?: PeriodFilter): Observable<ProfitReport> {
    if (stryMutAct_9fa48("934")) {
      {}
    } else {
      stryCov_9fa48("934");
      return this.http.get<ProfitReport>(stryMutAct_9fa48("935") ? `` : (stryCov_9fa48("935"), `${this.apiUrl}/profit`), stryMutAct_9fa48("936") ? {} : (stryCov_9fa48("936"), {
        params: this.buildPeriodParams(filters)
      }));
    }
  }
  getServices(filters?: PeriodFilter): Observable<ServicesReport> {
    if (stryMutAct_9fa48("937")) {
      {}
    } else {
      stryCov_9fa48("937");
      return this.http.get<ServicesReport>(stryMutAct_9fa48("938") ? `` : (stryCov_9fa48("938"), `${this.apiUrl}/services`), stryMutAct_9fa48("939") ? {} : (stryCov_9fa48("939"), {
        params: this.buildPeriodParams(filters)
      }));
    }
  }
  getTechnicians(): Observable<TechnicianRanking[]> {
    if (stryMutAct_9fa48("940")) {
      {}
    } else {
      stryCov_9fa48("940");
      return this.http.get<TechnicianRanking[]>(stryMutAct_9fa48("941") ? `` : (stryCov_9fa48("941"), `${this.apiUrl}/technicians`));
    }
  }
  getTechnicianDetail(id: string): Observable<TechnicianDetail> {
    if (stryMutAct_9fa48("942")) {
      {}
    } else {
      stryCov_9fa48("942");
      return this.http.get<TechnicianDetail>(stryMutAct_9fa48("943") ? `` : (stryCov_9fa48("943"), `${this.apiUrl}/technicians/${id}`));
    }
  }
  getClientReport(id: string): Observable<ClientReport> {
    if (stryMutAct_9fa48("944")) {
      {}
    } else {
      stryCov_9fa48("944");
      return this.http.get<ClientReport>(stryMutAct_9fa48("945") ? `` : (stryCov_9fa48("945"), `${this.apiUrl}/clients/${id}`));
    }
  }
  downloadBudgetPdf(workOrderId: string): Observable<Blob> {
    if (stryMutAct_9fa48("946")) {
      {}
    } else {
      stryCov_9fa48("946");
      return this.http.get(stryMutAct_9fa48("947") ? `` : (stryCov_9fa48("947"), `${this.apiUrl}/work-orders/${workOrderId}/budget`), stryMutAct_9fa48("948") ? {} : (stryCov_9fa48("948"), {
        responseType: stryMutAct_9fa48("949") ? "" : (stryCov_9fa48("949"), 'blob')
      }));
    }
  }
  downloadReceiptPdf(paymentId: string): Observable<Blob> {
    if (stryMutAct_9fa48("950")) {
      {}
    } else {
      stryCov_9fa48("950");
      return this.http.get(stryMutAct_9fa48("951") ? `` : (stryCov_9fa48("951"), `${this.apiUrl}/payments/${paymentId}/receipt`), stryMutAct_9fa48("952") ? {} : (stryCov_9fa48("952"), {
        responseType: stryMutAct_9fa48("953") ? "" : (stryCov_9fa48("953"), 'blob')
      }));
    }
  }
}