export interface PeriodFilter {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dateFrom?: string;
  dateTo?: string;
  category?: string;
}

export interface PeriodRange {
  from: string;
  to: string;
  label: string;
}

// ─── Summary ────────────────────────────────────────

export interface DashboardKPIs {
  totalIncome: number;
  totalExpenses: number;
  totalMaterialCosts: number;
  netProfit: number;
  averageTicket: number;
  workOrderCount: number;
  completedCount: number;
  completionRate: number;
  averageResolutionDays: number;
  collectionRate: number;
}

export interface MonthlyTrend {
  labels: string[];
  income: number[];
  expenses: number[];
  profit: number[];
  workOrderCount: number[];
}

export interface OrdersByStatus {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

export interface TopService {
  name: string;
  count: number;
  revenue: number;
}

export interface PaymentMethodDistribution {
  method: string;
  label: string;
  count: number;
  total: number;
  percentage: number;
}

export interface TopClient {
  clientId: string;
  clientName: string;
  workOrderCount: number;
  totalSpent: number;
  lastWorkOrderDate: string;
}

export interface TechnicianPerformance {
  technicianId: string;
  name: string;
  completedOrders: number;
  averageResolutionDays: number;
  totalRevenue: number;
}

export interface WorkOrdersByPriority {
  priority: string;
  label: string;
  count: number;
}

export interface DashboardTrends {
  incomeChange: number;
  ordersChange: number;
  profitChange: number;
  averageTicketChange: number;
}

export interface SummaryReport {
  kpis: DashboardKPIs;
  monthlyTrend: MonthlyTrend;
  workOrdersByStatus: OrdersByStatus[];
  topServices: TopService[];
  paymentMethodDistribution: PaymentMethodDistribution[];
  topClients: TopClient[];
  technicianPerformance: TechnicianPerformance[];
  workOrdersByPriority: WorkOrdersByPriority[];
  trends: DashboardTrends;
}

// ─── Income ─────────────────────────────────────────

export interface IncomeByMethod {
  method: string;
  label: string;
  total: number;
  count: number;
  percentage: number;
}

export interface IncomeByDay {
  date: string;
  total: number;
}

export interface IncomeReport {
  period: PeriodRange;
  totalIncome: number;
  paymentCount: number;
  averageTicket: number;
  byMethod: IncomeByMethod[];
  byDay: IncomeByDay[];
  previousPeriodTotal: number;
  changePercentage: number;
}

// ─── Expenses ───────────────────────────────────────

export interface ExpenseByCategory {
  category: string;
  label: string;
  total: number;
  count: number;
  percentage: number;
}

export interface ExpenseReport {
  period: PeriodRange;
  totalExpenses: number;
  byCategory: ExpenseByCategory[];
  previousPeriodTotal: number;
  changePercentage: number;
}

// ─── Profit ─────────────────────────────────────────

export interface ProfitReport {
  period: PeriodRange;
  income: number;
  materialCosts: number;
  operationalExpenses: number;
  grossProfit: number;
  netProfit: number;
  workOrderCount: number;
  previousPeriodNetProfit: number;
  changePercentage: number;
}

// ─── Services ───────────────────────────────────────

export interface ServiceRanking {
  name: string;
  count: number;
  revenue: number;
}

export interface ServicesReport {
  period: PeriodRange;
  services: ServiceRanking[];
}

// ─── Technicians ────────────────────────────────────

export interface TechnicianRanking {
  technicianId: string;
  name: string;
  completedOrders: number;
  averageResolutionDays: number;
  totalRevenue: number;
}

export interface TechnicianDetail {
  technicianId: string;
  name: string;
  completedOrders: number;
  inProgressOrders: number;
  averageResolutionDays: number;
  totalRevenue: number;
  recentOrders: {
    trackingCode: string;
    serviceTypeName: string;
    status: string;
    completedAt: Date | null;
  }[];
}

// ─── Client Report ──────────────────────────────────

export interface ClientReportKPIs {
  totalWorkOrders: number;
  completedOrders: number;
  totalSpent: number;
  outstandingDebt: number;
  averageTicket: number;
  lastServiceDate: Date | null;
  isRecurrent: boolean;
}

export interface ClientReportOrder {
  id: string;
  trackingCode: string;
  status: string;
  serviceTypeName: string;
  createdAt: Date;
  completedAt: Date | null;
  totalPaid: number;
  pendingAmount: number;
  materialsCost: number;
}

export interface ClientReportPayment {
  id: string;
  amount: number;
  method: string;
  status: string;
  paidAt: Date;
  trackingCode: string;
}

export interface ClientReport {
  client: { id: string; name: string; email: string; phone: string; address: string };
  kpis: ClientReportKPIs;
  workOrders: ClientReportOrder[];
  paymentHistory: ClientReportPayment[];
}
