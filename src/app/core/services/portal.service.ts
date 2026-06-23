import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PortalResponse } from '../models/portal.interfaces';
import { ApiResponse } from '../models/api-response.interfaces';

@Service()
export class PortalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/portal/track';

  track(code: string): Observable<PortalResponse> {
    return this.http
      .get<ApiResponse<PortalResponse>>(`${this.apiUrl}/${code}`)
      .pipe(map((res) => res.data));
  }
}
