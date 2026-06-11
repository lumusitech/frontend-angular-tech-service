import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseFilters,
} from '../models/expense.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/finances/expenses';

  getAll(filters?: ExpenseFilters): Observable<PaginatedResponse<Expense>> {
    let params = new HttpParams();

    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.isRecurring !== undefined)
      params = params.set('isRecurring', filters.isRecurring.toString());
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<Expense>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateExpenseDto): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateExpenseDto): Observable<Expense> {
    return this.http.patch<Expense>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
