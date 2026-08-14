export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  internetProvider?: string;
  internetPlan?: string;
  isActive: boolean;
  cuit?: string;
  ivaCondition?: 'responsable_inscripto' | 'consumidor_final' | 'monotributo' | 'exento';
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  internetProvider?: string;
  internetPlan?: string;
  isActive?: boolean;
  cuit?: string;
  ivaCondition?: 'responsable_inscripto' | 'consumidor_final' | 'monotributo' | 'exento';
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  internetProvider?: string;
  internetPlan?: string;
  isActive?: boolean;
  cuit?: string;
  ivaCondition?: 'responsable_inscripto' | 'consumidor_final' | 'monotributo' | 'exento';
}

export interface ClientFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BulkClientStatusSucceeded {
  id: string;
  isActive: boolean;
}

export interface BulkClientFailedItem {
  id: string;
  reason: string;
}

export interface BulkClientStatusResult {
  succeeded: BulkClientStatusSucceeded[];
  failed: BulkClientFailedItem[];
}

export interface BulkClientDeleteResult {
  succeeded: { id: string }[];
  failed: BulkClientFailedItem[];
}
