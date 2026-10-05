import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams, UserRoleDataService } from '../tokens/users.tokens';
import { WorkerProfileService } from '../services/worker-profile.service';

@Injectable()
export class WorkerUsersAdapter implements UserRoleDataService<any, any, any> {
  constructor(private svc: WorkerProfileService) {}

  list(params?: ListParams): Observable<any[]> {
    return this.svc.list(params as any);
  }

  getById(id: string): Observable<any> {
    return this.svc.getById(id);
  }

  create(payload: any): Observable<any> {
    return this.svc.create(payload);
  }

  update(id: string, payload: any): Observable<any> {
    return this.svc.update(id, payload);
  }

  delete(id: string): Observable<void> {
    return this.svc.delete(id);
  }
}
