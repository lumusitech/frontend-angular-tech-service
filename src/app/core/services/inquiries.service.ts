import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Inquiry,
  CreateInquiryDto,
  UpdateInquiryDto,
  ContactInquiryDto,
  ConvertInquiryDto,
  InquiryFilters,
  PaginatedResponse,
} from '../models/inquiry.interfaces';

@Service()
export class InquiriesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/inquiries';

  getAll(filters?: InquiryFilters): Observable<PaginatedResponse<Inquiry>> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.source) params = params.set('source', filters.source);
    if (filters?.assignedToId) params = params.set('assignedToId', filters.assignedToId);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.order) params = params.set('order', filters.order);

    return this.http.get<PaginatedResponse<Inquiry>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Inquiry> {
    return this.http.get<Inquiry>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateInquiryDto): Observable<Inquiry> {
    return this.http.post<Inquiry>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateInquiryDto): Observable<Inquiry> {
    return this.http.patch<Inquiry>(`${this.apiUrl}/${id}`, dto);
  }

  contact(id: string, dto: ContactInquiryDto): Observable<Inquiry> {
    return this.http.patch<Inquiry>(`${this.apiUrl}/${id}/contact`, dto);
  }

  review(
    id: string,
    dto: { adminDecision: 'approved' | 'rejected'; adminNotes?: string },
  ): Observable<Inquiry> {
    return this.http.patch<Inquiry>(`${this.apiUrl}/${id}/review`, dto);
  }

  convert(id: string, dto: ConvertInquiryDto): Observable<Inquiry> {
    return this.http.post<Inquiry>(`${this.apiUrl}/${id}/convert`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
