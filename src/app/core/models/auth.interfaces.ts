export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician';
}

export type UserRole = User['role'];
