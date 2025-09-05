import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDiscoverRequest, LoginSessionRequest } from './login.request';
import { LoginDiscoverResponse, LoginSessionResponse } from './login.response';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private path: string = '/login';
  constructor(private http: HttpClient) {}

  discoverTenants(payload: LoginDiscoverRequest): Observable<LoginDiscoverResponse> {
    return this.http.post<LoginDiscoverResponse>(this.path, payload);
  }

  createSession(payload: LoginSessionRequest): Observable<LoginSessionResponse> {
    return this.http.post<LoginSessionResponse>(this.path, payload);
  }
}
