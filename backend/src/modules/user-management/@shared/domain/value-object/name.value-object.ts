import { capitalizeString } from '@/util/formatting';
import {
  isAlpha,
  isNotEmpty,
  maxLengthInclusive,
  minLength,
} from '@/util/validations';

type NameProps = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export default class Name {
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;

  constructor(input: NameProps) {
    if (!input.firstName && !input.lastName) {
      throw new Error('First and last name are mandatory');
    }
    if (!this.validateMandatoryInput(input.firstName)) {
      throw new Error('The first name field does not meet all requirements');
    }
    if (!this.validateMandatoryInput(input.lastName)) {
      throw new Error('The last name field does not meet all requirements');
    }

    this._firstName = capitalizeString(input.firstName);
    this._lastName = capitalizeString(input.lastName);

    if (input.middleName === undefined) {
      this._middleName = '';
    } else {
      if (!this.validateOptionalInput(input.middleName)) {
        throw new Error('The middle name field does not meet all requirements');
      }
      this._middleName = capitalizeString(input.middleName);
    }
  }

  set firstName(value: string) {
    if (!this.validateMandatoryInput(value)) {
      throw new Error('The first name field does not meet all requirements');
    }
    this._firstName = value;
  }

  set lastName(value: string) {
    if (!this.validateMandatoryInput(value)) {
      throw new Error('The last name field does not meet all requirements');
    }
    this._firstName = value;
  }

  set middleName(value: string) {
    if (!this.validateOptionalInput(value) && value !== '') {
      throw new Error('The middle name field does not meet all requirements');
    }
    this._middleName = value;
  }

  fullName(): string {
    if (this._middleName.length === 0) {
      return this.fullNameWithoutMiddle();
    } else {
      return this.fullNameWithMiddle();
    }
  }

  shortName(): string {
    if (this._middleName.length === 0) {
      return this.shortNameWithoutMiddle();
    } else {
      return this.shortNameWithMiddle();
    }
  }

  private validateMandatoryInput(input: string): boolean {
    return (
      isAlpha(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 50) &&
      minLength(input, 2)
    );
  }

  private validateOptionalInput(input: string): boolean {
    return (
      isAlpha(input) && maxLengthInclusive(input, 50) && minLength(input, 2)
    );
  }

  private shortNameWithoutMiddle(): string {
    return `${this._firstName} ${this._lastName.charAt(0)}`;
  }

  private shortNameWithMiddle(): string {
    return `${this._firstName} ${this._middleName.charAt(
      0
    )} ${this._lastName.charAt(0)}`;
  }

  private fullNameWithoutMiddle(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  private fullNameWithMiddle(): string {
    return `${this._firstName} ${this._middleName} ${this._lastName}`;
  }
}
