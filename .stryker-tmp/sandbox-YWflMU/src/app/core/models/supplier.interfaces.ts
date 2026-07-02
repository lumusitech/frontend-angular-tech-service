// @ts-nocheck
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreateSupplierDto {
  name: string;
  contact: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
  isActive?: boolean;
}
export interface UpdateSupplierDto {
  name?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
}
export interface SupplierFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}