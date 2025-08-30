import { MapperError } from '../../application/errors/mapper.error';
import { TenantUserRole } from '../../domain/entity/tenant-user.entity';
import Tenant from '../../domain/entity/tenant.entity';
import type { IFindTenantOutput as TenantMapperProps } from '../dto/base-tenant.dto';
import { toRoleType, toStateType } from '@/modules/@shared/utils/formatting';

/**
 * Interface that defines the data structure for mapping Tenant entities
 */

export type { TenantMapperProps };

/**
 * Mapper responsible for converting between Tenant entity and DTOs
 */
export class TenantMapper {
  /**
   * Converts an Tenant entity into a plain object (DTO)
   * @param input Tenant entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Tenant): TenantMapperProps {
    if (!input || !(input instanceof Tenant)) {
      throw new MapperError('Invalid Tenant entity provided to mapper');
    }

    const tenantUsers = Array.from(input.tenantUserRolesMap.entries()).flatMap(
      ([email, roles]) =>
        roles.map(r => ({
          email,
          role: r.role,
          state: r.state,
        }))
    );

    return {
      id: input.id,
      cnpj: input.cnpj,
      tenantUsers,
    };
  }

  /**
   * Converts a plain object (DTO) into an Tenant entity
   * @param input Object with Tenant properties
   * @returns Tenant instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: TenantMapperProps): Tenant {
    if (!input || !input.id) {
      throw new MapperError('Invalid Tenant data provided to mapper');
    }

    const tenant = new Tenant({
      id: input.id,
      cnpj: input.cnpj,
    });
    if (!input.tenantUsers || input.tenantUsers.length === 0) {
      return tenant;
    }

    const tenantUsers = new Map<string, TenantUserRole[]>();

    for (const tenantUser of input.tenantUsers) {
      const arr = tenantUsers.get(tenantUser.email) ?? [];
      arr.push(
        new TenantUserRole({
          email: tenantUser.email,
          role: toRoleType(tenantUser.role),
          state: toStateType(tenantUser.state),
        })
      );
      tenantUsers.set(tenantUser.email, arr);
    }
    tenant.setRoles(tenantUsers);

    return tenant;
  }

  static toObjList(entities: Tenant[]): TenantMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  static toInstanceList(inputs: TenantMapperProps[]): Tenant[] {
    return inputs.map(input => this.toInstance(input));
  }
}
