import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProfileRequest } from '../dto';
import { profileToRequest } from '../mappers/profile.mapper';
import { StudentProfile } from '../../../../domain/users/profile.type';

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  private readonly endpoint = '/user-student';
  private readonly endpointAll = '/users-student';
  constructor(private http: HttpClient) {}

  create(payload: StudentProfileRequest): Observable<any> {
    const body = profileToRequest(payload as any);
    return this.http.post(this.endpoint, body);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`);
  }

  update(id: string, payload: Partial<StudentProfile>): Observable<any> {
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
