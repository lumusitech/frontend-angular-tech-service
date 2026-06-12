import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierFilters,
} from '../models/supplier.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Service()
export class SuppliersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/suppliers';

  getAll(filters?: SupplierFilters): Observable<PaginatedResponse<Supplier>> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.isActive !== undefined)
      params = params.set('isActive', filters.isActive.toString());
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<Supplier>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateSupplierDto): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateSupplierDto): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
