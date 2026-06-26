import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class BusinessSettingsService {
  private http = inject(HttpClient);

  private readonly _settings = signal<BusinessSetting | null>(null);

  readonly settings = this._settings.asReadonly();

  constructor() {
    this.load();
  }

  load(): void {
    this.http.get<BusinessSetting>('/api/business-settings').subscribe(data => {
      this._settings.set(data);
    });
  }

  update(dto: Partial<BusinessSetting>): Observable<BusinessSetting> {
    return this.http.patch<BusinessSetting>('/api/business-settings', dto).pipe(
      tap(() => this.load()),
    );
  }
}
