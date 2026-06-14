export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician';
  isActive: boolean;
  createdAt: string;
}

export interface UserFilters {
  role?: 'admin' | 'technician';
  page?: number;
  limit?: number;
}
