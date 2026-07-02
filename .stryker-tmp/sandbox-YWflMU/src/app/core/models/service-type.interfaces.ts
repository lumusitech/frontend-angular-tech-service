// @ts-nocheck
export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  estimatedDuration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreateServiceTypeDto {
  name: string;
  description?: string;
  estimatedDuration?: number;
  isActive?: boolean;
}
export interface UpdateServiceTypeDto {
  name?: string;
  description?: string;
  estimatedDuration?: number;
  isActive?: boolean;
}
export interface ServiceTypeFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}