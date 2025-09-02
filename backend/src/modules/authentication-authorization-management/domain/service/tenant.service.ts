import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import { TenantNotFoundError } from '../../application/errors/tenant-not-found.error';
import { RoleNotFoundError } from '../../application/errors/role-not-found.error';
import { InactiveTenantError } from '../../application/errors/inactive.error';
import { ValidationError } from '@/modules/@shared/application/errors/validation.error';

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
  verifyTenantRole(masterId: string, email: string, role: RoleUsers): Promise<void>;
  getAvailableTenantsAndRoles(
    userEmail: string
  ): Promise<{ id: string; roles: RoleUsers[] }[]>;
}
/**
 * Domain service for Tenant operations.
 */
export class TenantService implements TenantServiceInterface {
  constructor(private readonly tenantRepository: TenantGateway) {}

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
    const tenant = await this.tenantRepository.find(masterId);
    if (!tenant) {
      throw new TenantNotFoundError();
    }
    tenant.changeTenantUserRole(email, oldRole, newRole);
    return tenant;
  }

  public async getTenant(id?: string): Promise<Tenant> {
    if (!id) {
      throw new TenantNotFoundError();
    }
    const tenant = await this.tenantRepository.find(id);
    if (!tenant) throw new TenantNotFoundError();
    return tenant;
  }

  public async verifyTenantRole(
    masterId: string,
    email: string,
    role: RoleUsers
  ): Promise<void> {
    const tenant = await this.tenantRepository.find(masterId);
    if (!tenant) throw new TenantNotFoundError();

    const roles = tenant.tenantUserRolesMap.get(email) ?? [];
    const userRole = roles.find(ur => ur._email === email && ur.role === role);

    if (!userRole) {
      throw new RoleNotFoundError(
        `The user "${email}" does not have the role "${role}" registered`
      );
    }

    if (userRole.isActive === false) {
      throw new InactiveTenantError(
        `The role "${role}" of the user "${email}" is inactive`
      );
    }
  }

  async getAvailableTenantsAndRoles(
    userEmail: string
  ): Promise<{ id: string; roles: RoleUsers[] }[]> {
    const tenants = await this.tenantRepository.findByEmail(userEmail);
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
      existing = await this.tenantRepository.find(id);
    }
    if (existing) {
      return { tenant: existing, isNew: false };
    }
    if (!cnpj) {
      throw new ValidationError('CNPJ is mandatory to create a new tenant');
    }
    return { tenant: new Tenant({ id: new Id().value, cnpj }), isNew: true };
  }
}
