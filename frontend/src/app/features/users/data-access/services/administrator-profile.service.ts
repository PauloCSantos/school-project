import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdministratorProfileRequest } from '../dto';
import { profileToRequest } from '../../../../core/mappers/profile.mapper';
import { AdministratorProfile } from '../../../../core/types/profile.type';

@Injectable({ providedIn: 'root' })
export class AdministratorProfileService {
  private readonly endpoint = '/user-administrator';
  private readonly endpointAll = '/users-administrator';
  constructor(private http: HttpClient) {}

  create(payload: AdministratorProfileRequest): Observable<any> {
    const body = profileToRequest(payload as AdministratorProfileRequest);
    return this.http.post(this.endpoint, body);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`);
  }

  update(id: string, payload: Partial<AdministratorProfile>): Observable<any> {
    const body = profileToRequest(payload as any);
    return this.http.patch(`${this.endpoint}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  list(params?: Record<string, any>): Observable<any[]> {
    return this.http.get<any[]>(this.endpointAll, { params });
  }
}
