export type WorkOrderStatus =
  | 'pending'
  | 'assigned'
  | 'on_the_way'
  | 'in_progress'
  | 'postponed'
  | 'completed'
  | 'delivered'
  | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';
export type WorkOrderLocation = 'on_site' | 'workshop';
export type NoteType = 'diagnosis' | 'issue' | 'observation' | 'internal';

export interface WorkOrder {
  id: string;
  trackingCode: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  location: WorkOrderLocation;
  diagnosis?: string;
  workAddress?: string;
  warrantyUntil?: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  commissionPercent?: number;
  sellerId?: string;
  clientId?: string;
  serviceTypeId?: string;
  seller?: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  serviceType: {
    id: string;
    name: string;
    requiresDelivery?: boolean;
  };
  technicians: {
    id: string;
    name: string;
  }[];
  tasks: WorkOrderTask[];
  materials: WorkOrderMaterial[];
  notes: WorkOrderNote[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderTask {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
  };
}

export interface WorkOrderMaterial {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: {
    id: string;
    name: string;
  };
}

export interface WorkOrderNote {
  id: string;
  type: NoteType;
  content: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface CreateWorkOrderDto {
  clientId: string;
  serviceTypeId: string;
  technicianIds?: string[];
  priority?: WorkOrderPriority;
  location?: WorkOrderLocation;
  diagnosis?: string;
  workAddress?: string;
  warrantyUntil?: string;
  scheduledDate?: string;
  sellerId?: string;
}

export interface UpdateWorkOrderDto {
  clientId?: string;
  serviceTypeId?: string;
  status?: WorkOrderStatus;
  statusDetail?: string;
  diagnosis?: string;
  workAddress?: string;
  scheduledDate?: string;
  warrantyUntil?: string;
  priority?: WorkOrderPriority;
  location?: WorkOrderLocation;
  startedAt?: string;
  completedAt?: string;
  commissionPercent?: number;
}

export interface CreateWorkOrderNoteDto {
  type: NoteType;
  content: string;
}

export type UpdateWorkOrderNoteDto = Partial<CreateWorkOrderNoteDto>;

export interface CreateWorkOrderMaterialDto {
  description: string;
  quantity: number;
  unitCost: number;
  supplierId?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  assignedToId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedToId?: string;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface WorkOrderStatusLog {
  id: string;
  workOrderId: string;
  fromStatus: WorkOrderStatus | null;
  toStatus: WorkOrderStatus;
  changedByUserId: string;
  changedBy?: { id: string; name: string };
  changedByRole: string;
  timestamp: string;
  duration: number | null;
  detail?: string | null;
}

export interface WorkOrderFilters {
  search?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  technicianId?: string;
  clientId?: string;
  sellerId?: string;
  page?: number;
  limit?: number;
}

export interface BulkWorkOrderStatusSucceeded {
  id: string;
  status: WorkOrderStatus;
}

export interface BulkWorkOrderFailedItem {
  id: string;
  reason: string;
}

export interface BulkWorkOrderStatusResult {
  succeeded: BulkWorkOrderStatusSucceeded[];
  failed: BulkWorkOrderFailedItem[];
}
