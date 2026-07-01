import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interfaces';

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);

  getProfile(userId: string): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}`);
  }

  updateProfile(userId: string, dto: UpdateProfileDto): Observable<User> {
    return this.http.patch<User>(`/api/users/${userId}`, dto);
  }

  changePassword(userId: string, dto: ChangePasswordDto): Observable<void> {
    return this.http.post<void>(`/api/users/${userId}/change-password`, dto);
  }
}
