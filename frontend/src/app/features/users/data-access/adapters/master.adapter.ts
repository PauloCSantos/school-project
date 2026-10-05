import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams, UserRoleDataService } from '../tokens/users.tokens';
import { MasterProfileService } from '../services/master-profile.service';

@Injectable()
export class MasterUsersAdapter implements UserRoleDataService<any, any, any> {
  constructor(private svc: MasterProfileService) {}

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
