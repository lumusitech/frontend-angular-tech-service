import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, InvoiceFilters } from '../models/invoice.interfaces';
import { BulkInvoiceCancelResult, BulkInvoiceIssueResult } from '../models/invoice.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Service()
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/billing/invoices';

  getAll(filters?: InvoiceFilters): Observable<PaginatedResponse<Invoice>> {
    let params = new HttpParams();

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.invoiceType) params = params.set('invoiceType', filters.invoiceType);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters?.clientName) params = params.set('clientName', filters.clientName);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.order) params = params.set('order', filters.order);

    return this.http.get<PaginatedResponse<Invoice>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
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
    return this.http.post<Invoice>(this.apiUrl, dto);
  }

  issue(id: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${id}/issue`, {});
  }

  cancel(id: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${id}/cancel`, {});
  }

  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  bulkIssue(ids: string[]): Observable<BulkInvoiceIssueResult> {
    return this.http.post<BulkInvoiceIssueResult>(`${this.apiUrl}/bulk-issue`, { ids });
  }

  bulkCancel(ids: string[]): Observable<BulkInvoiceCancelResult> {
    return this.http.post<BulkInvoiceCancelResult>(`${this.apiUrl}/bulk-cancel`, { ids });
  }
}
