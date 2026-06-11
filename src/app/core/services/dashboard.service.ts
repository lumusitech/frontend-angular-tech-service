import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import {
  DashboardKPIs,
  MonthlyRevenue,
  OrdersByStatus,
  TopService,
  PaymentMethodDistribution,
} from '../models/dashboard.interfaces';
import { WorkOrdersService } from './work-orders.service';
import { PaymentsService } from './payments.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly paymentsService = inject(PaymentsService);

  getKPIs(): Observable<DashboardKPIs> {
    return forkJoin({
      activeOrders: this.workOrdersService.getAll({ status: 'in_progress', limit: 1 }),
      completedToday: this.workOrdersService.getAll({ status: 'completed', limit: 1 }),
      pendingPayments: this.paymentsService.getAll({ status: 'pending', limit: 1 }),
    }).pipe(
      map(({ activeOrders, completedToday, pendingPayments }) => ({
        activeOrders: activeOrders.total,
        completedToday: completedToday.total,
        monthlyRevenue: 0,
        previousMonthRevenue: 0,
        availableTechnicians: 0,
        pendingPayments: pendingPayments.total,
      })),
    );
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
