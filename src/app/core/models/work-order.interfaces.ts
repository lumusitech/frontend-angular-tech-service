export type WorkOrderStatus =
  | 'pending'
  | 'assigned'
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
  warrantyUntil?: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  serviceType: {
    id: string;
    name: string;
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
  warrantyUntil?: string;
  scheduledDate?: string;
}

export interface UpdateWorkOrderDto {
  status?: WorkOrderStatus;
  startedAt?: string;
  completedAt?: string;
}

export interface CreateWorkOrderNoteDto {
  type: NoteType;
  content: string;
}

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
  isCompleted?: boolean;
  completedAt?: string;
}

export interface WorkOrderFilters {
  search?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  technicianId?: string;
  clientId?: string;
  page?: number;
  limit?: number;
}
