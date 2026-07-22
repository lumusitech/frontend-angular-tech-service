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
