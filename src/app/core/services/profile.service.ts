import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interfaces';

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<User> {
    return this.http.get<User>('/api/auth/profile');
  }

  updateProfile(dto: UpdateProfileDto): Observable<User> {
    return this.http.patch<User>('/api/auth/profile', dto);
  }

  changePassword(dto: ChangePasswordDto): Observable<void> {
    return this.http.post<void>('/api/auth/change-password', dto);
  }
}
