import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.interfaces';
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
    return this.http
      .get<ApiResponse<SummaryReport>>(`${this.apiUrl}/summary`)
      .pipe(map((res) => res.data));
  }

  getIncome(filters?: PeriodFilter): Observable<IncomeReport> {
    return this.http
      .get<ApiResponse<IncomeReport>>(`${this.apiUrl}/income`, {
        params: this.buildPeriodParams(filters),
      })
      .pipe(map((res) => res.data));
  }

  getExpenses(filters?: PeriodFilter): Observable<ExpenseReport> {
    return this.http
      .get<ApiResponse<ExpenseReport>>(`${this.apiUrl}/expenses`, {
        params: this.buildPeriodParams(filters),
      })
      .pipe(map((res) => res.data));
  }

  getProfit(filters?: PeriodFilter): Observable<ProfitReport> {
    return this.http
      .get<ApiResponse<ProfitReport>>(`${this.apiUrl}/profit`, {
        params: this.buildPeriodParams(filters),
      })
      .pipe(map((res) => res.data));
  }

  getServices(filters?: PeriodFilter): Observable<ServicesReport> {
    return this.http
      .get<ApiResponse<ServicesReport>>(`${this.apiUrl}/services`, {
        params: this.buildPeriodParams(filters),
      })
      .pipe(map((res) => res.data));
  }

  getTechnicians(): Observable<TechnicianRanking[]> {
    return this.http
      .get<ApiResponse<TechnicianRanking[]>>(`${this.apiUrl}/technicians`)
      .pipe(map((res) => res.data));
  }

  getTechnicianDetail(id: string): Observable<TechnicianDetail> {
    return this.http
      .get<ApiResponse<TechnicianDetail>>(`${this.apiUrl}/technicians/${id}`)
      .pipe(map((res) => res.data));
  }

  getClientReport(id: string): Observable<ClientReport> {
    return this.http
      .get<ApiResponse<ClientReport>>(`${this.apiUrl}/clients/${id}`)
      .pipe(map((res) => res.data));
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
