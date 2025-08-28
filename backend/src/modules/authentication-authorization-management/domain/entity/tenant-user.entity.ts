import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { RoleUsersEnum, StatesEnum } from '@/modules/@shared/enums/enums';
import { RoleUsers, States } from '@/modules/@shared/type/sharedTypes';
import { isNotEmpty, isString, validEmail } from '@/modules/@shared/utils/validations';

export type TenantUserRoleProps = {
  /** Email address of the user */
  email: string;
  /** Role assigned to the user in this tenant */
  role: RoleUsers;
  state?: States;
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

  private _lifecycle: Lifecycle;

  /**
   * Creates a new TenantUserRole.
   * @param props - Properties to initialize the role association.
   * @throws Error if email is invalid, role is not in the enum,
   *         or boolean flags are not of type boolean.
   */
  constructor({ email, role, state }: TenantUserRoleProps) {
    if (!this.validateEmail(email)) throw new Error('Field email is not valid');
    if (!Object.values(RoleUsersEnum).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    this._email = email;
    this._role = role;
    this._lifecycle = Lifecycle.from(state ?? StatesEnum.ACTIVE);
  }

  /**
   * Gets the role assigned to this user.
   */
  get role(): RoleUsers {
    return this._role;
  }

  /**
   * Validates the format of an email address.
   * @param input - The email string to validate.
   * @returns True if the input is a non-empty, valid email string.
   */
  private validateEmail(input: string): boolean {
    return isString(input) && isNotEmpty(input) && validEmail(input);
  }

  get state(): States {
    return this._lifecycle.value;
  }
  get isActive(): boolean {
    return !this._lifecycle.equals(StatesEnum.INACTIVE);
  }
  get isPending(): boolean {
    return this._lifecycle.equals(StatesEnum.PENDING);
  }

  deactivate(): void {
    this._lifecycle = this._lifecycle.deactivate();
  }
  reactivate(requireVerification = false): void {
    this._lifecycle = this._lifecycle.activate(requireVerification);
  }
  markVerified(): void {
    this._lifecycle = this._lifecycle.markVerified();
  }
}
