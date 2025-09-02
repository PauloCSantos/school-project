import {
  isString,
  validCNPJ,
  validEmail,
  validId,
} from '@/modules/@shared/utils/validations';
import { TenantUserRole } from './tenant-user.entity';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { ConflictError } from '@/modules/@shared/application/errors/conflict.error';
import { AcessDeniedError } from '@/modules/@shared/application/errors/access-denied.error';
import { RoleNotFoundError } from '../../application/errors/role-not-found.error';
import { ValidationError } from '@/modules/@shared/application/errors/validation.error';

/**
 * Input properties for constructing a Tenant.
 */
export type TenantProps = {
  /** UUID of the tenant */
  id: string;
  /** CNPJ of the tenant (unformatted string) */
  cnpj: string;
};

/**
 * Aggregate Root: represents a Tenant and its memberships.
 */
export default class Tenant {
  /** Unique identifier of the tenant (UUID). */
  public readonly id: string;

  /** CNPJ of the tenant (unformatted). */
  private _cnpj: string;

  /**
   * Stores user–tenant associations in a Map where:
   *   key = user email
   *   value = array of TenantUserRole (history)
   */
  private _tenantsUserRole: Map<string, TenantUserRole[]> = new Map();

  /**
   * Creates a new Tenant.
   * @param input - Properties needed to initialize a Tenant.
   * @throws Error if the id is not a valid UUID or the CNPJ is invalid.
   */
  constructor(input: TenantProps) {
    const { id, cnpj } = input;
    if (!validId(id)) {
      throw new ValidationError('Invalid tenant ID');
    }
    if (!isString(cnpj) || !validCNPJ(cnpj)) {
      throw new ValidationError('Invalid CNPJ');
    }
    this.id = id;
    this._cnpj = cnpj;
  }

  /**
   * Gets the CNPJ of the tenant.
   */
  get cnpj(): string {
    return this._cnpj;
  }

  /**
   * Sets the CNPJ of the tenant.
   * @throws Error if the new value is not a string or is an invalid CNPJ.
   */
  set cnpj(value: string) {
    if (!isString(value) || !validCNPJ(value)) {
      throw new ValidationError('Invalid CNPJ');
    }
    this._cnpj = value;
  }

  /**
   * Exposes the complete Map of user emails to their TenantUserRole history, immutably.
   */
  get tenantUserRolesMap(): ReadonlyMap<string, TenantUserRole[]> {
    return this._tenantsUserRole;
  }

  /**
   * Adds a user–tenant association with a role.
   * Ensures there is no duplicate active (userEmail, role) in this tenant.
   * @param email - The user's email address.
   * @param role - The role to assign.
   * @throws Error if the user already has the role active in this tenant.
   */
  addTenantUserRole(email: string, role: RoleUsers) {
    const roles = this._tenantsUserRole.get(email) ?? [];
    const existing = roles.find(r => r.role === role);

    if (existing) {
      if (existing.isActive) {
        throw new ConflictError(
          `User already has the role '${role}' active in this tenant.`
        );
      }
      existing.reactivate(true);
    } else {
      const newRole = new TenantUserRole({
        email,
        role,
      });
      roles.push(newRole);
    }

    this._tenantsUserRole.set(email, roles);
  }

  /**
   * Changes the role of an existing user–tenant association.
   * @param email - The user's email address.
   * @param oldRole - The current role to replace.
   * @param newRole - The new role to assign.
   * @throws Error if attempting to change to or from the MASTER role,
   *               if the old role isn’t found, or if the new role is already active.
   */
  changeTenantUserRole(email: string, oldRole: RoleUsers, newRole: RoleUsers) {
    if (oldRole === RoleUsersEnum.MASTER || newRole === RoleUsersEnum.MASTER) {
      throw new AcessDeniedError('Changing the MASTER role is not allowed');
    }
    if (oldRole === newRole) {
      return;
    }

    const roles = this._tenantsUserRole.get(email) ?? [];
    const oldTenantRole = roles.find(r => r.role === oldRole);
    if (!oldTenantRole) {
      throw new RoleNotFoundError(`Old role '${oldRole}' not found for user ${email}`);
    }

    const targetRole = roles.find(r => r.role === newRole);

    if (targetRole && targetRole.isActive) {
      throw new ConflictError(
        `User already has the role '${newRole}' active in this tenant`
      );
    }

    if (targetRole && !targetRole.isActive) {
      oldTenantRole.deactivate();
      targetRole.reactivate(true);
      return;
    }

    oldTenantRole.deactivate();
    const newTenantRole = new TenantUserRole({
      email,
      role: newRole,
    });
    roles.push(newTenantRole);

    this._tenantsUserRole.set(email, roles);
  }

  /**
   * Renames a user's email key in the tenantUserRolesMap,
   * preserving all existing role history.
   *
   * @param oldEmail - The current email key to be replaced.
   * @param newEmail - The new email key to use.
   * @throws Error if oldEmail not found, newEmail already exists, or inputs are invalid.
   */
  renameUserEmail(oldEmail: string, newEmail: string) {
    if (!validEmail(oldEmail) || !validEmail(newEmail)) {
      throw new ValidationError('Invalid email value');
    }
    const roles = this._tenantsUserRole.get(oldEmail);
    if (!roles) {
      throw new RoleNotFoundError(`No roles found for user ${oldEmail}`);
    }
    if (this._tenantsUserRole.has(newEmail)) {
      throw new ConflictError(`A user already exists with email ${newEmail}`);
    }

    this._tenantsUserRole.set(newEmail, roles);
    this._tenantsUserRole.delete(oldEmail);
  }

  public setRoles(entries: Iterable<[string, TenantUserRole[]]>): void {
    if (this._tenantsUserRole.size > 0) {
      throw new ConflictError('Tenant roles already initialized');
    }
    const next = new Map<string, TenantUserRole[]>();
    for (const [email, roles] of entries) {
      next.set(email, roles.slice());
    }
    this._tenantsUserRole = next;
  }
}
