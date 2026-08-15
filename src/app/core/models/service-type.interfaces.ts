export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  estimatedDuration?: number;
  isActive: boolean;
  requiresDelivery: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceTypeDto {
  name: string;
  description?: string;
  estimatedDuration?: number;
  isActive?: boolean;
  requiresDelivery?: boolean;
}

export interface UpdateServiceTypeDto {
  name?: string;
  description?: string;
  estimatedDuration?: number;
  isActive?: boolean;
  requiresDelivery?: boolean;
}

export interface ServiceTypeFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface BulkServiceTypeStatusResult {
  succeeded: { id: string; isActive: boolean }[];
  failed: { id: string; reason: string }[];
}

export interface BulkServiceTypeDeleteResult {
  succeeded: { id: string }[];
  failed: { id: string; reason: string }[];
}
