import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import TenantGateway from '../../../application/gateway/tenant.gateway';
import { TenantMapper, TenantMapperProps } from '../../mapper/tenant.mapper';
import { ConflictError } from '@/modules/@shared/application/errors/conflict.error';
import { TenantNotFoundError } from '@/modules/authentication-authorization-management/application/errors/tenant-not-found.error';

/**
 * In-memory implementation of TenantGateway.
 * Stores and manipulates tenant entities in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryTenantRepository implements TenantGateway {
  private _tenants = new Map<string, Omit<TenantMapperProps, 'tenantUsers'>>();
  private _tenantsUsers = new Map<
    string,
    Map<number, TenantMapperProps['tenantUsers'][number]>
  >();

  /**
   * @param initialTenants lista opcional de Tenants para “seedar” o repositório
   */
  constructor(initialTenants: Tenant[] = []) {
    initialTenants.forEach(t => {
      const obj = TenantMapper.toObj(t);
      this._tenants.set(obj.id, { id: obj.id, cnpj: obj.cnpj });

      const usersTenantsMap = new Map<number, TenantMapperProps['tenantUsers'][number]>();
      obj.tenantUsers.forEach((element, idx) => {
        usersTenantsMap.set(idx, element);
      });
      this._tenantsUsers.set(obj.id, usersTenantsMap);
    });
  }

  /**
   * Saves a tenant in memory.
   * @param tenant - The tenant entity to save
   */
  async create(tenant: Tenant): Promise<void> {
    if (this._tenants.has(tenant.id)) {
      throw new ConflictError('Tenant already exists');
    }
    const obj = TenantMapper.toObj(tenant);

    this._tenants.set(tenant.id, { id: obj.id, cnpj: obj.cnpj });
    const usersTenantsMap = new Map<number, TenantMapperProps['tenantUsers'][number]>();
    obj.tenantUsers.forEach((element, idx) => {
      usersTenantsMap.set(idx, element);
    });

    this._tenantsUsers.set(tenant.id, usersTenantsMap);
  }

  /**
   * Finds a tenant by its ID.
   * @param id - The ID of the tenant to find
   * @returns Promise resolving to the found Tenant or null if not found
   */
  async find(id: string): Promise<Tenant | null> {
    const tenant = this._tenants.get(id);
    if (!tenant) return null;

    const usersTenantsMap = this._tenantsUsers.get(id);
    const tenantUsers = usersTenantsMap ? Array.from(usersTenantsMap.values()) : [];
    const props: TenantMapperProps = { ...tenant, tenantUsers };

    return TenantMapper.toInstance(props);
  }

  /**
   * Finds tenants by its Email.
   * @param email - The email of the tenants to find
   * @returns Promise resolving to the array of found Tenants
   */
  async findByEmail(email: string): Promise<Tenant[]> {
    const tenantIds: string[] = [];
    for (const [tenantId, usersMap] of this._tenantsUsers.entries()) {
      if (!usersMap) continue;

      for (const u of usersMap.values()) {
        if (u.email === email) {
          tenantIds.push(tenantId);
          break;
        }
      }
    }

    if (tenantIds.length === 0) return [];

    const tenants = await Promise.all(tenantIds.map(id => this.find(id)));
    return tenants.filter((t): t is Tenant => t !== null);
  }

  /**
   * Updates a tenant.
   * @param id - The ID of the tenant to update
   * @param tenant - The updated tenant entity
   * @throws Error if the tenant is not found
   */
  async update(id: string, tenant: Tenant): Promise<void> {
    if (!this._tenants.has(id)) {
      throw new TenantNotFoundError();
    }

    const obj = TenantMapper.toObj(tenant);
    this._tenants.set(id, { id: obj.id, cnpj: obj.cnpj });

    const usersTenantsMap = new Map<number, TenantMapperProps['tenantUsers'][number]>();
    obj.tenantUsers.forEach((element, idx) => {
      usersTenantsMap.set(idx, element);
    });

    this._tenantsUsers.set(id, usersTenantsMap);
  }

  /**
   * Deletes a tenant by its ID.
   * @param tenant - tenant - The updated tenant entity
   * @throws Error if the tenant is not found
   */
  async delete(tenant: Tenant): Promise<void> {
    if (!this._tenants.has(tenant.id)) {
      throw new TenantNotFoundError();
    }

    const obj = TenantMapper.toObj(tenant);
    this._tenants.set(tenant.id, { id: obj.id, cnpj: obj.cnpj });

    const usersTenantsMap = new Map<number, TenantMapperProps['tenantUsers'][number]>();
    obj.tenantUsers.forEach((element, idx) => {
      usersTenantsMap.set(idx, element);
    });

    this._tenantsUsers.set(obj.id, usersTenantsMap);
  }
}
