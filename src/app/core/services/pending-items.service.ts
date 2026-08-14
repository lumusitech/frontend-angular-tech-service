import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PendingItem,
  CreatePendingItemDto,
  UpdatePendingItemDto,
  PendingItemFilters,
  PendingItemStatus,
  BulkPendingItemStatusResult,
  BulkPendingItemDeleteResult,
  PaginatedResponse,
} from '../models/pending-item.interfaces';

@Service()
export class PendingItemsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/pending-items';

  getAll(filters?: PendingItemFilters): Observable<PaginatedResponse<PendingItem>> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.assignedToId) params = params.set('assignedToId', filters.assignedToId);
    if (filters?.dueDateFrom) params = params.set('dueDateFrom', filters.dueDateFrom);
    if (filters?.dueDateTo) params = params.set('dueDateTo', filters.dueDateTo);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.order) params = params.set('order', filters.order);

    return this.http.get<PaginatedResponse<PendingItem>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<PendingItem> {
    return this.http.get<PendingItem>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreatePendingItemDto): Observable<PendingItem> {
    return this.http.post<PendingItem>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdatePendingItemDto): Observable<PendingItem> {
    return this.http.patch<PendingItem>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  bulkUpdateStatus(
    ids: string[],
    status: PendingItemStatus,
  ): Observable<BulkPendingItemStatusResult> {
    return this.http.patch<BulkPendingItemStatusResult>(`${this.apiUrl}/bulk-status`, {
      ids,
      status,
    });
  }

  bulkDelete(ids: string[]): Observable<BulkPendingItemDeleteResult> {
    return this.http.post<BulkPendingItemDeleteResult>(`${this.apiUrl}/bulk-delete`, { ids });
  }
}
