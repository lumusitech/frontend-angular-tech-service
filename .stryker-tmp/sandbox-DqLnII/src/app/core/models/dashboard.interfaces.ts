// @ts-nocheck
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
export interface DashboardSummary {
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
export interface PendingItemSummary {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
  type: string;
  assignedTo: {
    id: string;
    name: string;
  } | null;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface InquirySummary {
  id: string;
  clientName: string;
  description: string;
  source: string;
  status: string;
  priority: string | null;
  createdAt: string;
}