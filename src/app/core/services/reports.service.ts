import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PeriodFilter,
  SummaryReport,
  IncomeReport,
  ExpenseReport,
  ProfitReport,
  ServicesReport,
  TechnicianRanking,
  TechnicianDetail,
  ClientReport,
} from '../models/report.interfaces';

@Service()
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/reports';

  private buildPeriodParams(filters?: PeriodFilter): HttpParams {
    let params = new HttpParams();
    if (filters?.period) params = params.set('period', filters.period);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters?.category) params = params.set('category', filters.category);
    return params;
  }

  getSummary(): Observable<SummaryReport> {
    return this.http.get<SummaryReport>(`${this.apiUrl}/summary`);
  }

  getIncome(filters?: PeriodFilter): Observable<IncomeReport> {
    return this.http.get<IncomeReport>(`${this.apiUrl}/income`, {
      params: this.buildPeriodParams(filters),
    });
  }

  getExpenses(filters?: PeriodFilter): Observable<ExpenseReport> {
    return this.http.get<ExpenseReport>(`${this.apiUrl}/expenses`, {
      params: this.buildPeriodParams(filters),
    });
  }

  getProfit(filters?: PeriodFilter): Observable<ProfitReport> {
    return this.http.get<ProfitReport>(`${this.apiUrl}/profit`, {
      params: this.buildPeriodParams(filters),
    });
  }

  getServices(filters?: PeriodFilter): Observable<ServicesReport> {
    return this.http.get<ServicesReport>(`${this.apiUrl}/services`, {
      params: this.buildPeriodParams(filters),
    });
  }

  getTechnicians(): Observable<TechnicianRanking[]> {
    return this.http.get<TechnicianRanking[]>(`${this.apiUrl}/technicians`);
  }

  getTechnicianDetail(id: string): Observable<TechnicianDetail> {
    return this.http.get<TechnicianDetail>(`${this.apiUrl}/technicians/${id}`);
  }

  getClientReport(id: string): Observable<ClientReport> {
    return this.http.get<ClientReport>(`${this.apiUrl}/clients/${id}`);
  }

  downloadBudgetPdf(workOrderId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/work-orders/${workOrderId}/budget`, {
      responseType: 'blob',
    });
  }

  downloadReceiptPdf(paymentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/payments/${paymentId}/receipt`, {
      responseType: 'blob',
    });
  }
}
