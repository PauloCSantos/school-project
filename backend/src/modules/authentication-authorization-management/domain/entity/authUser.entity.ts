import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { isNotEmpty, validEmail, validId, validRole } from '@/util/validations';
import AuthUserService from '../service/authUser-entity.service';

type AuthUserProps = {
  email: string;
  password: string;
  masterId?: string;
  role: RoleUsers;
  isHashed?: boolean;
};
export default class AuthUser {
  private _email;
  private _password;
  private _masterId;
  private _role;
  private _authService;
  private _isHashed;

  constructor(input: AuthUserProps, authService: AuthUserService) {
    if (
      input.email === undefined ||
      input.password === undefined ||
      input.role === undefined
    ) {
      throw new Error('All fields are mandatory');
    }

    if (!this.validateEmail(input.email))
      throw new Error('Field email is not valid');
    if (!this.validatePassword(input.password))
      throw new Error('Field password is not valid');
    if (!validRole(input.role)) throw new Error('Field role is not valid');
    if (input.masterId) {
      if (!validId(input.masterId))
        throw new Error('Field masterId is not valid');
    }
    if (input.role !== 'master') {
      if (input.masterId === undefined) {
        throw new Error('The masterId field is mandatory for regular users');
      }
    }
    if (input.isHashed) {
      if (!(typeof input.isHashed === 'boolean'))
        throw new Error('The field isHashed must be a boolean');
      this._isHashed = input.isHashed;
    } else {
      this._isHashed = false;
    }
    if (!(authService instanceof AuthUserService))
      throw new Error('authservice type is incorrect');
    this._authService = authService;
    this._email = input.email;
    this._role = input.role;
    this._masterId =
      input.masterId !== undefined ? input.masterId : new Id().id;
    this._password = input.password;
  }

  get email(): string {
    return this._email;
  }

  get masterId(): string {
    return this._masterId;
  }

  get role(): string {
    return this._role;
  }

  set email(input: string) {
    if (!this.validateEmail(input)) throw new Error('Field email is not valid');
    this._email = input;
  }

  set password(input: string) {
    if (!this.validatePassword(input))
      throw new Error('Field password is not valid');
    this._password = input;
    this._isHashed = false;
  }

  set role(input: string) {
    if (!validRole(input)) throw new Error('Field role is not valid');
    this._role = input as RoleUsers;
  }

  async hashPassword() {
    if (this._isHashed === false) {
      const hash = await this._authService.generateHash(this._password);
      this._password = hash;
      this._isHashed = true;
    }
  }

  async comparePassword(input: string) {
    if (!this.validatePassword(input))
      throw new Error('Field password is not valid');
    if (this._isHashed === false)
      throw new Error('Use the method to hash before comparing');
    const response = await this._authService.comparePassword(
      this._password,
      input
    );
    return response;
  }

  private validateEmail(input: string): boolean {
    return isNotEmpty(input) && validEmail(input);
  }
  private validatePassword(input: string): boolean {
    return isNotEmpty(input);
  }
}
