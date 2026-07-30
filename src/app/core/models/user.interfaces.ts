export interface SkillRef {
  id: string;
  name: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'seller';
  isActive: boolean;
  phone?: string;
  avatar?: string;
  commission?: number;
  experience?: string;
  trustRating?: number;
  skills?: SkillRef[];
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: User['role'];
  phone?: string;
  commission?: number;
  experience?: string;
  trustRating?: number;
  skillIds?: string[];
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: User['role'];
  isActive?: boolean;
  phone?: string;
  commission?: number;
  experience?: string;
  trustRating?: number;
  skillIds?: string[];
}

export interface UserFilters {
  role?: User['role'];
  search?: string;
  page?: number;
  limit?: number;
}
