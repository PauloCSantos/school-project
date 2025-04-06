import {
  isNotEmpty,
  isString,
  validDate,
  validEmail,
} from '@/modules/@shared/utils/validations';
import Address from '../value-object/address.value-object';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
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
    if (
      input.name === undefined ||
      input.address === undefined ||
      input.email === undefined ||
      input.birthday === undefined
    )
      throw new Error('All fields except Id are mandatory');

    if (!(input.name instanceof Name)) throw new Error('Invalid name');
    if (!(input.address instanceof Address)) throw new Error('Invalid address');
    if (!this.validateBirthday(input.birthday))
      throw new Error('Field birthday is not valid');
    if (!this.validateEmail(input.email))
      throw new Error('Field email is not valid');
    if (input.id) {
      if (!(input.id instanceof Id)) throw new Error('Invalid id');
      this._id = input.id;
    } else {
      this._id = new Id();
    }

    this._name = input.name;
    this._address = input.address;
    this._birthday = input.birthday;
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
    return isString(input) && isNotEmpty(input) && validEmail(input);
  }

  private validateBirthday(input: Date): boolean {
    return validDate(input);
  }
}
