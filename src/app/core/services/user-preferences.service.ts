import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPreferences, UpdateUserPreferencesDto } from '../models/user-preferences.interfaces';

@Service()
export class UserPreferencesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/user-preferences';

  get(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(this.apiUrl);
  }

  update(dto: UpdateUserPreferencesDto): Observable<UserPreferences> {
    return this.http.put<UserPreferences>(this.apiUrl, dto);
  }
}
