import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.interfaces';
import {
  Client,
  CreateClientDto,
  UpdateClientDto,
  ClientFilters,
  PaginatedResponse,
} from '../models/client.interfaces';

@Service()
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/clients';

  getAll(filters?: ClientFilters): Observable<PaginatedResponse<Client>> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.isActive !== undefined)
      params = params.set('isActive', filters.isActive.toString());
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http
      .get<ApiResponse<PaginatedResponse<Client>>>(this.apiUrl, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Client> {
    return this.http
      .get<ApiResponse<Client>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(dto: CreateClientDto): Observable<Client> {
    return this.http
      .post<ApiResponse<Client>>(this.apiUrl, dto)
      .pipe(map((res) => res.data));
  }

  update(id: string, dto: UpdateClientDto): Observable<Client> {
    return this.http
      .patch<ApiResponse<Client>>(`${this.apiUrl}/${id}`, dto)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }
}
