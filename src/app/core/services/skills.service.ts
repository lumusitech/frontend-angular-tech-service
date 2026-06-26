import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Skill,
  CreateSkillDto,
  UpdateSkillDto,
  SkillFilters,
} from '../models/skill.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Service()
export class SkillsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/skills';

  getAll(filters?: SkillFilters): Observable<PaginatedResponse<Skill>> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<Skill>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateSkillDto): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateSkillDto): Observable<Skill> {
    return this.http.patch<Skill>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
