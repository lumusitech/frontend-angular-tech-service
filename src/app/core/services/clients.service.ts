import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Client,
  CreateClientDto,
  UpdateClientDto,
  ClientFilters,
  PaginatedResponse,
  BulkClientStatusResult,
  BulkClientDeleteResult,
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

    return this.http.get<PaginatedResponse<Client>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateClientDto): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  bulkUpdateStatus(ids: string[], isActive: boolean): Observable<BulkClientStatusResult> {
    return this.http.patch<BulkClientStatusResult>(`${this.apiUrl}/bulk-status`, { ids, isActive });
  }

  bulkDelete(ids: string[]): Observable<BulkClientDeleteResult> {
    return this.http.post<BulkClientDeleteResult>(`${this.apiUrl}/bulk-delete`, { ids });
  }
}
