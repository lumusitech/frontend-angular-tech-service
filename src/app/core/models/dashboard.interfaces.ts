export interface DashboardKPIs {
  activeOrders: number;
  completedToday: number;
  monthlyRevenue: number;
  previousMonthRevenue: number;
  availableTechnicians: number;
  pendingPayments: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface TopService {
  name: string;
  count: number;
}

export interface PaymentMethodDistribution {
  method: string;
  count: number;
}
