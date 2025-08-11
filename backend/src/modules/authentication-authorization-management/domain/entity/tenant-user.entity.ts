import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import {
  isNotEmpty,
  isString,
  validEmail,
} from '@/modules/@shared/utils/validations';

export type TenantUserRoleProps = {
  /** Email address of the user */
  email: string;
  /** Role assigned to the user in this tenant */
  role: RoleUsers;
  /** Whether the role is active */
  isActive?: boolean;
  /** Whether the user still needs verification */
  needVerification?: boolean;
};

/**
 * Represents the association of a user to a tenant
 * with a specific role.
 */
export class TenantUserRole {
  /** User's email address */
  readonly _email: string;

  /** Role assigned to the user */
  private _role: RoleUsers;

  /** Whether the role is currently active */
  private _isActive: boolean;

  /** Whether the role requires verification */
  private _needVerification: boolean = false;

  /**
   * Creates a new TenantUserRole.
   * @param props - Properties to initialize the role association.
   * @throws Error if email is invalid, role is not in the enum,
   *         or boolean flags are not of type boolean.
   */
  constructor({
    email,
    role,
    isActive,
    needVerification,
  }: TenantUserRoleProps) {
    if (!this.validateEmail(email)) throw new Error('Field email is not valid');
    if (!Object.values(RoleUsersEnum).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    if (isActive !== undefined && typeof isActive !== 'boolean') {
      throw new Error('The field isActive must be a boolean');
    }
    if (
      needVerification !== undefined &&
      typeof needVerification !== 'boolean'
    ) {
      throw new Error('The field needVerification must be a boolean');
    }

    this._email = email;
    this._role = role;
    this._isActive = !!isActive;
    this._needVerification = !!needVerification;
  }

  /**
   * Gets the role assigned to this user.
   */
  get role(): RoleUsers {
    return this._role;
  }

  /**
   * Gets whether the role is currently active.
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Gets whether the role still needs verification.
   */
  get needVerification(): boolean {
    return this._needVerification;
  }

  /**
   * Deactivates this role.
   */
  deactivate() {
    this._isActive = false;
  }

  /**
   * Activates this role.
   * @param requireVerification - If true, marks the role as needing verification.
   */
  activate(requireVerification = false) {
    this._isActive = true;
    this._needVerification = requireVerification;
  }

  /**
   * Marks the role as having been verified.
   */
  markVerified() {
    this._needVerification = false;
  }

  /**
   * Validates the format of an email address.
   * @param input - The email string to validate.
   * @returns True if the input is a non-empty, valid email string.
   */
  private validateEmail(input: string): boolean {
    return isString(input) && isNotEmpty(input) && validEmail(input);
  }
}
