export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'transfer';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled';

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  provider: string;
  status: PaymentStatus;
  description?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  dueDate?: string;
  paidAt?: string;
  workOrder: {
    id: string;
    trackingCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  amount: number;
  method: PaymentMethod;
  provider: string;
  description?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  dueDate?: string;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  paidAt?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  workOrderId?: string;
  page?: number;
  limit?: number;
}
