export enum NotificationType {
  WORK_ORDER_CREATED = 'work_order.created',
  WORK_ORDER_STATUS_CHANGED = 'work_order.status_changed',
  WORK_ORDER_TECHNICIAN_ASSIGNED = 'work_order.technician_assigned',
  TASK_CREATED = 'task.created',
  TASK_COMPLETED = 'task.completed',
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_APPROVED = 'payment.approved',
  PAYMENT_REJECTED = 'payment.rejected',
  PENDING_ITEM_CREATED = 'pending_item.created',
  PENDING_ITEM_DUE_TODAY = 'pending_item.due_today',
  PENDING_ITEM_OVERDUE = 'pending_item.overdue',
  INQUIRY_CREATED = 'inquiry.created',
  INQUIRY_ASSIGNED = 'inquiry.assigned',
  INQUIRY_CONTACTED = 'inquiry.contacted',
  INQUIRY_REVIEWED = 'inquiry.reviewed',
  WORK_ORDER_NOTE_ADDED = 'work_order.note_added',
  WORK_ORDER_MATERIAL_ADDED = 'work_order.material_added',
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string | null;
  referenceType: string | null;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  type?: NotificationType;
  isRead?: boolean;
}

export interface PaginatedNotifications {
  data: AppNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
