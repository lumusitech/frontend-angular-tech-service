import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BusinessSetting {
  id: string;
  businessName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
  phone: string;
  email: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  timestamp: string;
}

@Service()
export class BusinessSettingsService {
  private http = inject(HttpClient);

  readonly settingsResource = httpResource<ApiResponse<BusinessSetting>>(
    () => '/api/business-settings',
  );

  update(dto: Partial<BusinessSetting>): Observable<ApiResponse<BusinessSetting>> {
    return this.http.patch<ApiResponse<BusinessSetting>>('/api/business-settings', dto);
  }
}
