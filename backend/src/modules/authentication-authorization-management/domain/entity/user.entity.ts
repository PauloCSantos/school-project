import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AuthUserService from '../../application/service/user-entity.service';
import {
  isNotEmpty,
  validEmail,
  validId,
  validRole,
} from '@/modules/@shared/utils/validations';

/**
 * Properties required to create an authenticated user
 */
export type AuthUserProps = {
  email: string;
  password: string;
  masterId?: string;
  role: RoleUsers;
  isHashed?: boolean;
};

/**
 * Entity representing an authenticated user in the system
 *
 * Responsible for validating and managing user credentials and access rights
 */
export default class AuthUser {
  private _email: string;
  private _password: string;
  private _masterId: string;
  private _role: RoleUsers;
  private _isHashed: boolean;
  private readonly _authService: AuthUserService;

  /**
   * Creates a new authenticated user
   *
   * @param input - User properties including email, password, role, and optional masterId
   * @param authService - Service for password hashing and verification
   * @throws Error if any required field is missing or invalid
   */
  constructor(input: AuthUserProps, authService: AuthUserService) {
    this.validateConstructorParams(input, authService);

    this._authService = authService;
    this._email = input.email;
    this._role = input.role;
    this._masterId =
      input.masterId !== undefined ? input.masterId : new Id().value;
    this._password = input.password;
    this._isHashed = input.isHashed === true;
  }

  /**
   * Validates all parameters provided to the constructor
   */
  private validateConstructorParams(
    input: AuthUserProps,
    authService: AuthUserService
  ): void {
    // Check if required fields are present
    if (
      input.email === undefined ||
      input.password === undefined ||
      input.role === undefined
    ) {
      throw new Error('All fields are mandatory');
    }

    // Validate service type
    if (!(authService instanceof AuthUserService)) {
      throw new Error('authservice type is incorrect');
    }

    // Validate field values
    if (!this.validateEmail(input.email)) {
      throw new Error('Field email is not valid');
    }

    if (!this.validatePassword(input.password)) {
      throw new Error('Field password is not valid');
    }

    if (!validRole(input.role)) {
      throw new Error('Field role is not valid');
    }

    // Validate masterId if provided
    if (input.masterId && !validId(input.masterId)) {
      throw new Error('Field masterId is not valid');
    }

    // Check masterId requirement for non-master roles
    if (input.role !== 'master' && input.masterId === undefined) {
      throw new Error('The masterId field is mandatory for regular users');
    }

    // Validate isHashed if provided
    if (input.isHashed !== undefined && typeof input.isHashed !== 'boolean') {
      throw new Error('The field isHashed must be a boolean');
    }
  }

  /**
   * User's email address
   */
  get email(): string {
    return this._email;
  }

  /**
   * Sets a new email address after validation
   */
  set email(input: string) {
    if (!this.validateEmail(input)) {
      throw new Error('Field email is not valid');
    }
    this._email = input;
  }

  /**
   * User's master ID (for hierarchical relationships)
   */
  get masterId(): string {
    return this._masterId;
  }

  /**
   * User's role in the system
   */
  get role(): RoleUsers {
    return this._role;
  }

  /**
   * Sets a new role after validation
   */
  set role(input: string) {
    if (!validRole(input)) {
      throw new Error('Field role is not valid');
    }
    this._role = input as RoleUsers;
  }

  /**
   * Indicates if the password is stored as a hash
   */
  get isHashed(): boolean {
    return this._isHashed;
  }

  /**
   * Retrieves the password (only if hashed)
   */
  get password(): string {
    if (!this._isHashed) {
      throw new Error('Use the method to hash before get');
    }
    return this._password;
  }

  /**
   * Sets a new password after validation
   */
  set password(input: string) {
    if (!this.validatePassword(input)) {
      throw new Error('Field password is not valid');
    }
    this._password = input;
    this._isHashed = false;
  }

  /**
   * Hashes the password if not already hashed
   */
  async hashPassword(): Promise<void> {
    if (!this._isHashed) {
      this._password = await this._authService.generateHash(this._password);
      this._isHashed = true;
    }
  }

  /**
   * Compares a plain text password with the stored hashed password
   *
   * @param input - Plain text password to compare
   * @returns True if the passwords match, false otherwise
   * @throws Error if the password is not hashed or input is invalid
   */
  async comparePassword(input: string): Promise<boolean> {
    if (!this.validatePassword(input)) {
      throw new Error('Field password is not valid');
    }

    if (!this._isHashed) {
      throw new Error('Use the method to hash before comparing');
    }

    return this._authService.comparePassword(input, this._password);
  }

  /**
   * Validates an email string
   */
  private validateEmail(input: string): boolean {
    return isNotEmpty(input) && validEmail(input);
  }

  /**
   * Validates a password string
   */
  private validatePassword(input: string): boolean {
    return isNotEmpty(input);
  }
}
