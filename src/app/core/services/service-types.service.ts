import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ServiceType,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  ServiceTypeFilters,
  BulkServiceTypeStatusResult,
  BulkServiceTypeDeleteResult,
} from '../models/service-type.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Service()
export class ServiceTypesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/service-types';

  getAll(filters?: ServiceTypeFilters): Observable<PaginatedResponse<ServiceType>> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.isActive !== undefined)
      params = params.set('isActive', filters.isActive.toString());
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<ServiceType>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ServiceType> {
    return this.http.get<ServiceType>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateServiceTypeDto): Observable<ServiceType> {
    return this.http.post<ServiceType>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateServiceTypeDto): Observable<ServiceType> {
    return this.http.patch<ServiceType>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  bulkUpdateStatus(ids: string[], isActive: boolean): Observable<BulkServiceTypeStatusResult> {
    return this.http.patch<BulkServiceTypeStatusResult>(`${this.apiUrl}/bulk-status`, {
      ids,
      isActive,
    });
  }

  bulkDelete(ids: string[]): Observable<BulkServiceTypeDeleteResult> {
    return this.http.post<BulkServiceTypeDeleteResult>(`${this.apiUrl}/bulk-delete`, { ids });
  }
}
