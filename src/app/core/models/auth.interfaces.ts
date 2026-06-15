import { LoginPreferencesResponse } from './user-preferences.interfaces';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    accessToken: string;
    user: User;
    preferences?: LoginPreferencesResponse;
  };
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician';
}

export type UserRole = User['role'];
