import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';

export type CreateTenantInputDto = {
  email: string;
  role: RoleUsers;
  masterId?: string;
  cnpj?: string;
};
export type CreateTenantOutputDto = {
  tenant: Tenant;
  isNew: boolean;
};
export interface TenantServiceInterface {
  manageUserRoleAssignmentInTenant(
    input: CreateTenantInputDto
  ): Promise<CreateTenantOutputDto>;
  changeUserRoleInTenant(
    masterId: string,
    email: string,
    oldRole: RoleUsers,
    newRole: RoleUsers
  ): Promise<Tenant>;
  getTenant(id?: string): Promise<Tenant>;
  verifyTenantRole(
    masterId: string,
    email: string,
    role: RoleUsers
  ): Promise<void>;
  getAvailableTenantsAndRoles(
    userEmail: string
  ): Promise<{ id: string; roles: RoleUsers[] }[]>;
}
/**
 * Domain service for Tenant operations.
 */
export class TenantService implements TenantServiceInterface {
  constructor(private readonly tenantGateway: TenantGateway) {}

  public async manageUserRoleAssignmentInTenant({
    email,
    role,
    masterId,
    cnpj,
  }: CreateTenantInputDto): Promise<CreateTenantOutputDto> {
    const { tenant, isNew } = await this.getOrCreateTenant(masterId, cnpj);
    tenant.addTenantUserRole(email, role);
    return { tenant, isNew };
  }

  public async changeUserRoleInTenant(
    masterId: string,
    email: string,
    oldRole: RoleUsers,
    newRole: RoleUsers
  ): Promise<Tenant> {
    const tenant = await this.tenantGateway.find(masterId);
    if (!tenant) {
      throw new Error('Tenant não encontrado');
    }
    tenant.changeTenantUserRole(email, oldRole, newRole);
    return tenant;
  }

  public async getTenant(id?: string): Promise<Tenant> {
    if (!id) {
      throw new Error('Tenant não encontrado');
    }
    const tenant = await this.tenantGateway.find(id);
    if (!tenant) throw new Error('Tenant não encontrado');
    return tenant;
  }

  public async verifyTenantRole(
    masterId: string,
    email: string,
    role: RoleUsers
  ): Promise<void> {
    const tenant = await this.tenantGateway.find(masterId);
    if (!tenant) throw new Error('Tenant não encontrado');

    const roles = tenant.tenantUserRolesMap.get(email) ?? [];
    const userRole = roles.find(ur => ur._email === email && ur.role === role);

    if (!userRole) {
      throw new Error(
        `Usuário "${email}" não possui a role "${role}" cadastrada`
      );
    }

    if (userRole.isActive === false) {
      throw new Error(`A role "${role}" do usuário "${email}" está inativa`);
    }
  }

  async getAvailableTenantsAndRoles(
    userEmail: string
  ): Promise<{ id: string; roles: RoleUsers[] }[]> {
    const tenants = await this.tenantGateway.findByEmail(userEmail);
    const options = tenants.map(t => ({
      id: t.id,
      roles: t.tenantUserRolesMap
        .get(userEmail)!
        .filter(r => r.isActive)
        .map(r => r.role),
    }));
    return options;
  }

  private async getOrCreateTenant(
    id?: string,
    cnpj?: string
  ): Promise<{ tenant: Tenant; isNew: boolean }> {
    let existing: Tenant | null = null;
    if (id) {
      existing = await this.tenantGateway.find(id);
    }
    if (existing) {
      return { tenant: existing, isNew: false };
    }
    if (!cnpj) {
      throw new Error('CNPJ é obrigatório para criar um novo tenant');
    }
    return { tenant: new Tenant({ id: new Id().value, cnpj }), isNew: true };
  }
}
