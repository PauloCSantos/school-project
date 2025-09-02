import { ValidationError } from '@/modules/@shared/application/errors/validation.error';
import {
  isNotEmpty,
  maxLengthInclusive,
  minLength,
  isNumeric,
  isString,
} from '@/modules/@shared/utils/validations';

type AddressProps = {
  street: string;
  city: string;
  zip: string;
  number: number;
  avenue: string;
  state: string;
};

export default class Address {
  private _street: string;
  private _city: string;
  private _zip: string;
  private _number: number;
  private _avenue: string;
  private _state: string;

  constructor(input: AddressProps) {
    if (
      input.street === undefined ||
      input.city === undefined ||
      input.avenue === undefined ||
      input.zip === undefined ||
      input.state === undefined ||
      input.number === undefined
    ) {
      throw new ValidationError('All address fields are mandatory');
    }
    if (!this.validateField(input.street))
      throw new ValidationError('The street field was not filled in correctly');
    if (!this.validateField(input.city))
      throw new ValidationError('The city field was not filled in correctly');
    if (!this.validateField(input.avenue))
      throw new ValidationError('The avenue field was not filled in correctly');
    if (!this.validateField(input.zip, 20, 5))
      throw new ValidationError('The zip field was not filled in correctly');
    if (!this.validateField(input.state, 255, 1))
      throw new ValidationError('The state field was not filled in correctly');
    if (!isNumeric(input.number) || input.number < 0)
      throw new ValidationError('The number field was not filled in correctly');

    this._street = input.street;
    this._city = input.city;
    this._zip = input.zip;
    this._number = input.number;
    this._avenue = input.avenue;
    this._state = input.state;
  }

  get street(): string {
    return this._street;
  }
  get city(): string {
    return this._city;
  }
  get zip(): string {
    return this._zip;
  }
  get number(): number {
    return this._number;
  }
  get avenue(): string {
    return this._avenue;
  }
  get state(): string {
    return this._state;
  }

  set street(value: string) {
    if (!this.validateField(value))
      throw new ValidationError('The street field was not filled in correctly');
    this._street = value;
  }
  set city(value: string) {
    if (!this.validateField(value))
      throw new ValidationError('The city field was not filled in correctly');
    this._city = value;
  }
  set zip(value: string) {
    if (!this.validateField(value, 20, 5))
      throw new ValidationError('The zip field was not filled in correctly');
    this._zip = value;
  }
  set number(value: number) {
    if (!isNumeric(value) || value < 0)
      throw new ValidationError('The number field was not filled in correctly');
    this._number = value;
  }
  set avenue(value: string) {
    if (!this.validateField(value))
      throw new ValidationError('The avenue field was not filled in correctly');
    this._avenue = value;
  }
  set state(value: string) {
    if (!this.validateField(value, 255, 1))
      throw new ValidationError('The state field was not filled in correctly');
    this._state = value;
  }

  private validateField(
    value: string,
    maxLen: number = 255,
    minLen: number = 2
  ): boolean {
    return (
      isString(value) &&
      isNotEmpty(value) &&
      minLength(value, minLen) &&
      maxLengthInclusive(value, maxLen)
    );
  }
}
