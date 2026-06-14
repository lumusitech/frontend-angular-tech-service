import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserFilters } from '../models/user.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Service()
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/users';

  getAll(filters?: UserFilters): Observable<PaginatedResponse<User>> {
    let params = new HttpParams();

    if (filters?.role) params = params.set('role', filters.role);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<User>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
