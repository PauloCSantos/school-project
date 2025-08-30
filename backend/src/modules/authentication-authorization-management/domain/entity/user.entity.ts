import { States } from '@/modules/@shared/type/sharedTypes';
import { AuthUserServiceInterface } from '../service/interface/user-entity-service.interface';
import { isNotEmpty, validEmail } from '@/modules/@shared/utils/validations';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';
import { ValidationError } from '@/modules/@shared/application/errors/validation.error';
import { InternalError } from '@/modules/@shared/application/errors/internal.error';

/**
 * Properties required to create an authenticated user.
 */
export type AuthUserProps = {
  /** User's email address */
  email: string;
  /** User's password (plaintext or already hashed if `isHashed` is true) */
  password: string;
  /** Whether the password is already hashed. Defaults to false if omitted. */
  isHashed?: boolean;
  state?: States;
};

/**
 * Entity representing an authenticated user in the system.
 *
 * Responsible for validating and managing user credentials and access rights.
 */
export default class AuthUser {
  /** User's email address */
  private _email: string;
  /** User's password or hashed password */
  private _password: string;
  /** Whether the password is already hashed */
  private _isHashed: boolean;
  private _lifecycle: Lifecycle;

  /**
   * Creates a new authenticated user.
   *
   * @param input - User properties including email, password, and optional flags.
   * @param authService - Service for password hashing and verification.
   * @throws Error if any required field is missing or invalid.
   */
  constructor(
    input: AuthUserProps,
    private readonly authService: AuthUserServiceInterface
  ) {
    this.validateConstructorParams(input);

    this._email = input.email;
    this._password = input.password;
    this._isHashed = input.isHashed === true;
    this._lifecycle = Lifecycle.from(input.state ?? StatesEnum.ACTIVE);
  }

  /**
   * Validates all parameters provided to the constructor.
   *
   * @param input - The properties passed to constructor.
   * @throws Error if email or password missing/invalid, or if isHashed is not boolean when provided.
   */
  private validateConstructorParams(input: AuthUserProps): void {
    if (input.email === undefined || input.password === undefined) {
      throw new ValidationError('All fields are mandatory');
    }

    if (!this.validateEmail(input.email)) {
      throw new ValidationError('Field email is not valid');
    }

    if (!this.validatePassword(input.password)) {
      throw new ValidationError('Field password is not valid');
    }

    if (input.isHashed !== undefined && typeof input.isHashed !== 'boolean') {
      throw new ValidationError('The field isHashed must be a boolean');
    }
  }

  /**
   * Gets the user's email address.
   */
  get email(): string {
    return this._email;
  }

  /**
   * Sets a new email address after validation.
   *
   * @throws Error if the provided email is invalid.
   */
  set email(input: string) {
    if (!this.validateEmail(input)) {
      throw new ValidationError('Field email is not valid');
    }
    this._email = input;
  }

  /**
   * Indicates if the password is stored as a hash.
   */
  get isHashed(): boolean {
    return this._isHashed;
  }

  /**
   * Retrieves the password (only if hashed).
   *
   * @throws Error if the password is not hashed yet.
   */
  get password(): string {
    if (!this._isHashed) {
      throw new InternalError('Use the method to hash before get');
    }
    return this._password;
  }

  /**
   * Sets a new password after validation.
   * Marks the password as not hashed.
   *
   * @throws Error if the provided password is invalid.
   */
  set password(input: string) {
    if (!this.validatePassword(input)) {
      throw new ValidationError('Field password is not valid');
    }
    this._password = input;
    this._isHashed = false;
  }

  /**
   * Hashes the password if not already hashed.
   */
  async hashPassword(): Promise<void> {
    if (!this._isHashed) {
      this._password = await this.authService.generateHash(this._password);
      this._isHashed = true;
    }
  }

  /**
   * Compares a plain text password with the stored hashed password.
   *
   * @param input - Plain text password to compare.
   * @returns True if the passwords match, false otherwise.
   * @throws Error if the password is not hashed or input is invalid.
   */
  async comparePassword(input: string): Promise<boolean> {
    if (!this.validatePassword(input)) {
      throw new ValidationError('Field password is not valid');
    }

    if (!this._isHashed) {
      throw new InternalError('Use the method to hash before comparing');
    }

    return this.authService.comparePassword(input, this._password);
  }

  /**
   * Validates an email string.
   *
   * @param input - The email string to validate.
   * @returns True if the input is a non-empty valid email.
   */
  private validateEmail(input: string): boolean {
    return isNotEmpty(input) && validEmail(input);
  }

  /**
   * Validates a password string.
   *
   * @param input - The password string to validate.
   * @returns True if the password is non-empty.
   */
  private validatePassword(input: string): boolean {
    return isNotEmpty(input);
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
