import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortalResponse } from '../models/portal.interfaces';

@Service()
export class PortalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/portal/track';

  track(code: string): Observable<PortalResponse> {
    return this.http.get<PortalResponse>(`${this.apiUrl}/${code}`);
  }
}
