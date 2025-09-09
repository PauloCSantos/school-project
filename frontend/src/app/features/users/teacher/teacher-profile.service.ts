import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { profileToRequest } from '../../../core/mappers/profile.mapper';
import { TeacherProfile } from '../../../core/types/profile.type';
import { TeacherProfileRequest } from './teacher-profile.request';

@Injectable({ providedIn: 'root' })
export class TeacherProfileService {
  private readonly endpoint = '/user-teacher';
  constructor(private http: HttpClient) {}

  create(payload: TeacherProfileRequest): Observable<any> {
    const body = profileToRequest(payload as any);
    return this.http.post(this.endpoint, body);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`);
  }

  update(id: string, payload: Partial<TeacherProfile>): Observable<any> {
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
