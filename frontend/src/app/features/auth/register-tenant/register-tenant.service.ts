import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterTenantRequest } from './register-tenant.request';
import { RegisterTenantResponse } from './register-tenant.response';

@Injectable({ providedIn: 'root' })
export class TenantService {
  constructor(private http: HttpClient) {}
  registerTenant(payload: RegisterTenantRequest): Observable<RegisterTenantResponse> {
    return this.http.post<RegisterTenantResponse>(`/registerTenant`, payload);
  }
}
