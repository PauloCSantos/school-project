import { isNotEmpty, validBirthday, validEmail } from '@/util/validations';
import Address from '../value-object/address.value-object';
import Id from '../value-object/id.value-object';
import Name from '../value-object/name.value-object';

export type UserBaseProps = {
  id?: Id;
  name: Name;
  address: Address;
  email: string;
  birthday: Date;
};

export default abstract class UserBase {
  private _id;
  private _name;
  private _address;
  private _email;
  private _birthday;

  constructor(input: UserBaseProps) {
    this._id = input.id || new Id();
    this._name = input.name;
    this._address = input.address;

    if (!this.validateBirthday(input.birthday))
      throw new Error('Field birthday is not valid');
    this._birthday = input.birthday;

    if (!this.validateEmail(input.email))
      throw new Error('Field email is not valid');
    this._email = input.email;
  }

  get id(): Id {
    return this._id;
  }

  get name(): Name {
    return this._name;
  }

  get address(): Address {
    return this._address;
  }

  get email(): string {
    return this._email;
  }

  get birthday(): Date {
    return this._birthday;
  }

  set birthday(input: Date) {
    if (!this.validateBirthday(input))
      throw new Error('Field birthday is not valid');
    this._birthday = input;
  }

  set email(input: string) {
    if (!this.validateEmail(input)) throw new Error('Field email is not valid');
    this._email = input;
  }

  private validateEmail(input: string): boolean {
    return isNotEmpty(input) && validEmail(input);
  }

  private validateBirthday(input: Date): boolean {
    return validBirthday(input);
  }
}
