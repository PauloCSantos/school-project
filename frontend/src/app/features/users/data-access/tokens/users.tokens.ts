import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../../../domain/users/role.type';
import { ListParams as ListParamsCore } from '../../../../core/types/list-params';

export type TokenRoles = Exclude<Role, 'master'>;
export interface ListParams extends ListParamsCore {
  q?: string;
}

export interface Paginated<T> {
  items: T[];
  total?: number;
  quantity?: number;
  offset?: number;
}

export interface UserRoleDataService<TItem = unknown, TCreate = unknown, TUpdate = unknown> {
  list(params?: ListParams): Observable<Paginated<TItem> | TItem[]>;
  getById(id: string): Observable<TItem>;
  create(payload: TCreate): Observable<TItem>;
  update(id: string, payload: TUpdate): Observable<TItem>;
  delete(id: string): Observable<void>;
}

export interface UserRoleRegistryEntry {
  role: TokenRoles;
  service: UserRoleDataService;
}

export const USER_ROLE_REGISTRY = new InjectionToken<UserRoleRegistryEntry[]>('USER_ROLE_REGISTRY');
