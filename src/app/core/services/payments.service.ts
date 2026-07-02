import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentFilters,
} from '../models/payment.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Service()
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/payments';

  getAll(filters?: PaymentFilters): Observable<PaginatedResponse<Payment>> {
    let params = new HttpParams();

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.method) params = params.set('method', filters.method);
    if (filters?.workOrderId) params = params.set('workOrderId', filters.workOrderId);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<Payment>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  create(workOrderId: string, dto: CreatePaymentDto): Observable<Payment> {
    return this.http.post<Payment>(`/api/work-orders/${workOrderId}/payments`, dto);
  }

  update(id: string, dto: UpdatePaymentDto): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
