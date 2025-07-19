import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import TenantGateway from '../../../application/gateway/tenant.gateway';

/**
 * In-memory implementation of TenantGateway.
 * Stores and manipulates tenant entities in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryTenantRepository implements TenantGateway {
  private _tenants = new Map<string, Tenant>();

  /**
   * @param initialTenants lista opcional de Tenants para “seedar” o repositório
   */
  constructor(initialTenants: Tenant[] = []) {
    this._tenants = new Map(initialTenants.map(tenant => [tenant.id, tenant]));
  }

  /**
   * Saves a tenant in memory.
   * @param tenant - The tenant entity to save
   */
  async create(tenant: Tenant): Promise<void> {
    if (this._tenants.get(tenant.id)) throw new Error('Tenant already exists');
    this._tenants.set(tenant.id, tenant);
  }

  /**
   * Finds a tenant by its ID.
   * @param id - The ID of the tenant to find
   * @returns Promise resolving to the found Tenant or null if not found
   */
  async find(id: string): Promise<Tenant | null> {
    const tenant = this._tenants.get(id);
    return tenant ?? null;
  }

  /**
   * Updates a tenant's CNPJ.
   * @param id - The ID of the tenant to update
   * @param cnpj - The new CNPJ value
   * @throws Error if the tenant is not found
   */
  async update(id: string, tenant: Tenant): Promise<void> {
    if (!this._tenants.get(id)) {
      throw new Error('Tenant not found');
    }
    this._tenants.set(id, tenant);
  }

  /**
   * Deletes a tenant by its ID.
   * @param id - The ID of the tenant to delete
   * @throws Error if the tenant is not found
   */
  async delete(id: string): Promise<void> {
    if (!this._tenants.delete(id)) {
      throw new Error('Tenant not found');
    }
  }
}
