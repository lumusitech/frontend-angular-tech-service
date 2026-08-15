import { LoginPreferencesResponse } from './user-preferences.interfaces';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  preferences?: LoginPreferencesResponse;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'seller';
  phone?: string;
  avatar?: string;
  commission?: number;
}

export type UserRole = User['role'];
