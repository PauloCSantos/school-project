import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MasterProfileRequest } from '../dto/master/master.request';
import { profileToRequest } from '../../../../core/mappers/profile.mapper';
import { MasterProfile } from '../../../../core/types/profile.type';

@Injectable({ providedIn: 'root' })
export class MasterProfileService {
  private readonly endpoint = '/user-master';
  constructor(private http: HttpClient) {}

  create(payload: MasterProfileRequest): Observable<any> {
    const body = profileToRequest(payload as any);
    return this.http.post(this.endpoint, body);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`);
  }

  update(id: string, payload: Partial<MasterProfile>): Observable<any> {
    const body = profileToRequest(payload as any);
    return this.http.patch(`${this.endpoint}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  list(params?: Record<string, any>): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint, { params });
  }
}
