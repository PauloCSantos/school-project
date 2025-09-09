import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { profileToRequest } from '../../../core/mappers/profile.mapper';
import { WorkerProfile } from '../../../core/types/profile.type';
import { WorkerProfileRequest } from './worker-profile.request';

@Injectable({ providedIn: 'root' })
export class WorkerProfileService {
  private readonly endpoint = '/user-worker';
  constructor(private http: HttpClient) {}

  create(payload: WorkerProfileRequest): Observable<any> {
    const body = profileToRequest(payload as any);
    return this.http.post(this.endpoint, body);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`);
  }

  update(id: string, payload: Partial<WorkerProfile>): Observable<any> {
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
