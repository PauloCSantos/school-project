import { Injectable, inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { profileToRequest } from '../../../../core/mappers/profile.mapper';
import { AnyProfileRequest } from '../dto/user.request';

export type ProfileServiceConfig = {
  usualEndpoint: string;
  listEndpoint: string;
};

export const PROFILE_SERVICE_CONFIG = new InjectionToken<ProfileServiceConfig>(
  'PROFILE_SERVICE_CONFIG'
);

@Injectable()
export class ProfileService {
  private http = inject(HttpClient);
  private cfg = inject(PROFILE_SERVICE_CONFIG);

  create(payload: AnyProfileRequest): Observable<any> {
    return this.http.post(this.cfg.usualEndpoint, profileToRequest(payload));
  }

  find(id: string): Observable<any> {
    return this.http.get(`${this.cfg.usualEndpoint}/${id}`);
  }

  update(id: string, payload: AnyProfileRequest): Observable<any> {
    return this.http.patch(`${this.cfg.usualEndpoint}/${id}`, profileToRequest(payload));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.cfg.usualEndpoint}/${id}`);
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.cfg.listEndpoint);
  }
}
