import Tenant from '../../domain/entity/tenant.entity';

export default interface TenantGateway {
  create(tenant: Tenant): Promise<void>;
  find(id: string): Promise<Tenant | null>;
  update(id: string, tenant: Tenant): Promise<void>;
  delete(id: string): Promise<void>;
}
