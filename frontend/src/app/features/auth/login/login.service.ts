import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDiscoverRequest, LoginSessionRequest } from './login.request';
import { LoginDiscoverResponse, LoginSessionResponse } from './login.response';
import { SKIP_AUTH } from '../../../core/interceptors/auth.interceptor';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private path: string = '/login';
  constructor(private http: HttpClient) {}

  discoverTenants(payload: LoginDiscoverRequest): Observable<LoginDiscoverResponse> {
    return this.http.post<LoginDiscoverResponse>(this.path, payload, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  createSession(payload: LoginSessionRequest): Observable<LoginSessionResponse> {
    return this.http.post<LoginSessionResponse>(this.path, payload, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }
}
