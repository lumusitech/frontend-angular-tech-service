import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserPreferences, UpdateUserPreferencesDto } from '../models/user-preferences.interfaces';
import { ApiResponse } from '../models/api-response.interfaces';

@Service()
export class UserPreferencesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/user-preferences';

  get(): Observable<UserPreferences> {
    return this.http.get<ApiResponse<UserPreferences>>(this.apiUrl).pipe(map((res) => res.data));
  }

  update(dto: UpdateUserPreferencesDto): Observable<UserPreferences> {
    return this.http
      .put<ApiResponse<UserPreferences>>(this.apiUrl, dto)
      .pipe(map((res) => res.data));
  }
}
