export interface PendingItem {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  type: PendingItemType;
  priority: PendingItemPriority;
  status: PendingItemStatus;
  referenceType: string | null;
  referenceId: string | null;
  assignedTo: PendingItemUser | null;
  assignedToId: string | null;
  createdBy: PendingItemUser;
  createdById: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PendingItemUser {
  id: string;
  name: string;
  email: string;
}

export enum PendingItemType {
  WORK_ORDER = 'work_order',
  INQUIRY = 'inquiry',
  MAINTENANCE = 'maintenance',
  FOLLOW_UP = 'follow_up',
  OTHER = 'other',
}

export enum PendingItemPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum PendingItemStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface CreatePendingItemDto {
  title: string;
  description?: string;
  dueDate: string;
  type: PendingItemType;
  priority?: PendingItemPriority;
  referenceType?: string;
  referenceId?: string;
  assignedToId?: string;
}

export interface UpdatePendingItemDto {
  title?: string;
  description?: string;
  dueDate?: string;
  type?: PendingItemType;
  priority?: PendingItemPriority;
  status?: PendingItemStatus;
  referenceType?: string;
  referenceId?: string;
  assignedToId?: string;
  completedAt?: string;
}

export interface PendingItemFilters {
  status?: PendingItemStatus;
  priority?: PendingItemPriority;
  type?: PendingItemType;
  assignedToId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
