import { AuthUserServiceInterface } from '../service/interface/user-entity-service.interface';
import { isNotEmpty, validEmail } from '@/modules/@shared/utils/validations';

/**
 * Properties required to create an authenticated user.
 */
export type AuthUserProps = {
  /** User's email address */
  email: string;
  /** User's password (plaintext or already hashed if `isHashed` is true) */
  password: string;
  /** Whether the user is active. Defaults to true if omitted. */
  isActive?: boolean;
  /** Whether the password is already hashed. Defaults to false if omitted. */
  isHashed?: boolean;
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
  /** Whether the user account is active */
  private _isActive: boolean = true;
  /** Whether the password is already hashed */
  private _isHashed: boolean;

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
    this._isActive = !!!input.isActive;
    this._isHashed = input.isHashed === true;
  }

  /**
   * Validates all parameters provided to the constructor.
   *
   * @param input - The properties passed to constructor.
   * @throws Error if email or password missing/invalid, or if isHashed is not boolean when provided.
   */
  private validateConstructorParams(input: AuthUserProps): void {
    if (input.email === undefined || input.password === undefined) {
      throw new Error('All fields are mandatory');
    }

    if (!this.validateEmail(input.email)) {
      throw new Error('Field email is not valid');
    }

    if (!this.validatePassword(input.password)) {
      throw new Error('Field password is not valid');
    }

    if (input.isHashed !== undefined && typeof input.isHashed !== 'boolean') {
      throw new Error('The field isHashed must be a boolean');
    }

    if (input.isActive !== undefined && typeof input.isActive !== 'boolean') {
      throw new Error('The field isActive must be a boolean');
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
      throw new Error('Field email is not valid');
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
      throw new Error('Use the method to hash before get');
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
      throw new Error('Field password is not valid');
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
   * Gets the active status of the user.
   *
   * @returns True if the user is active, false otherwise.
   */
  async getStatus(): Promise<boolean> {
    return this._isActive;
  }

  /**
   * Activates the user account.
   */
  async activate(): Promise<void> {
    this._isActive = true;
  }

  /**
   * Deactivates the user account.
   */
  async deactivate(): Promise<void> {
    this._isActive = false;
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
      throw new Error('Field password is not valid');
    }

    if (!this._isHashed) {
      throw new Error('Use the method to hash before comparing');
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
}
