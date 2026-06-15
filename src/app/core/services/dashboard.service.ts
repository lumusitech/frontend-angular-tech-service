import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  DashboardSummary,
  PendingItemSummary,
  PaginatedResponse,
} from '../models/dashboard.interfaces';
import { ApiResponse } from '../models/api-response.interfaces';

@Service()
export class DashboardService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<DashboardSummary> {
    return this.http
      .get<ApiResponse<DashboardSummary>>('/api/reports/summary')
      .pipe(map((res) => res.data));
  }
}
