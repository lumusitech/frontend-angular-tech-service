import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.interfaces';
import {
  ServiceType,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  ServiceTypeFilters,
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

    return this.http
      .get<ApiResponse<PaginatedResponse<ServiceType>>>(this.apiUrl, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<ServiceType> {
    return this.http
      .get<ApiResponse<ServiceType>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(dto: CreateServiceTypeDto): Observable<ServiceType> {
    return this.http
      .post<ApiResponse<ServiceType>>(this.apiUrl, dto)
      .pipe(map((res) => res.data));
  }

  update(id: string, dto: UpdateServiceTypeDto): Observable<ServiceType> {
    return this.http
      .patch<ApiResponse<ServiceType>>(`${this.apiUrl}/${id}`, dto)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }
}
