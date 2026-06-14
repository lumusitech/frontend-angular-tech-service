import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardKPIs,
  MonthlyRevenue,
  OrdersByStatus,
  TopService,
  PaymentMethodDistribution,
} from '../models/dashboard.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
import { ApiResponse } from '../models/api-response.interfaces';
import { unwrapResponse } from '../operators/unwrap-response.operator';

@Service()
export class DashboardService {
  private readonly http = inject(HttpClient);

  getKPIs(): Observable<DashboardKPIs> {
    return new Observable((subscriber) => {
      let activeOrders = 0;
      let completedToday = 0;
      let pendingPayments = 0;
      let remaining = 3;

      const check = () => {
        if (--remaining === 0) {
          subscriber.next({
            activeOrders,
            completedToday,
            monthlyRevenue: 0,
            previousMonthRevenue: 0,
            availableTechnicians: 0,
            pendingPayments,
          });
          subscriber.complete();
        }
      };

      this.http
        .get<ApiResponse<PaginatedResponse<unknown>>>('/api/work-orders?status=in_progress&limit=1')
        .pipe(unwrapResponse())
        .subscribe({
          next: (res) => {
            activeOrders = res.total;
            check();
          },
          error: () => check(),
        });

      this.http
        .get<ApiResponse<PaginatedResponse<unknown>>>('/api/work-orders?status=completed&limit=1')
        .pipe(unwrapResponse())
        .subscribe({
          next: (res) => {
            completedToday = res.total;
            check();
          },
          error: () => check(),
        });

      this.http
        .get<ApiResponse<PaginatedResponse<unknown>>>('/api/payments?status=pending&limit=1')
        .pipe(unwrapResponse())
        .subscribe({
          next: (res) => {
            pendingPayments = res.total;
            check();
          },
          error: () => check(),
        });
    });
  }

  getMonthlyRevenue(): Observable<MonthlyRevenue[]> {
    return this.http.get<MonthlyRevenue[]>('/api/reports/monthly-revenue');
  }

  getOrdersByStatus(): Observable<OrdersByStatus[]> {
    return this.http.get<OrdersByStatus[]>('/api/reports/orders-by-status');
  }

  getTopServices(): Observable<TopService[]> {
    return this.http.get<TopService[]>('/api/reports/top-services');
  }

  getPaymentMethodDistribution(): Observable<PaymentMethodDistribution[]> {
    return this.http.get<PaymentMethodDistribution[]>('/api/reports/payment-methods');
  }
}
