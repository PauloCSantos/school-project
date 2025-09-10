import { Inject, Injectable, Optional } from '@angular/core';
import { USER_ROLE_REGISTRY, UserRoleDataService, ListParams, TokenRoles } from '../tokens/users.tokens';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly map = new Map<TokenRoles, UserRoleDataService>();

  constructor(@Optional() @Inject(USER_ROLE_REGISTRY) entries: { role: TokenRoles; service: UserRoleDataService }[] | null) {
    (entries ?? []).forEach(e => this.map.set(e.role, e.service));
  }

  private get(role: TokenRoles): UserRoleDataService {
    const svc = this.map.get(role);
    if (!svc) throw new Error(`Nenhum service registrado para o tipo: ${role}`);
    return svc;
  }

  list(role: TokenRoles, params?: ListParams) { return this.get(role).list(params); }
  getById(role: TokenRoles, id: string)       { return this.get(role).getById(id); }
  create(role: TokenRoles, payload: unknown)  { return this.get(role).create(payload as any); }
  update(role: TokenRoles, id: string, payload: unknown) { return this.get(role).update(id, payload as any); }
  delete(role: TokenRoles, id: string)        { return this.get(role).delete(id); }
}
