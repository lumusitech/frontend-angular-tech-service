export type ExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'salaries'
  | 'tools'
  | 'transport'
  | 'advertising'
  | 'supplies'
  | 'maintenance'
  | 'hosting'
  | 'other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  isRecurring: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  isRecurring?: boolean;
  notes?: string;
}

export interface UpdateExpenseDto {
  description?: string;
  amount?: number;
  date?: string;
  category?: ExpenseCategory;
  isRecurring?: boolean;
  notes?: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  isRecurring?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
