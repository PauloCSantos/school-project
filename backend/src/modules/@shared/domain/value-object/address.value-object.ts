import {
  isAlpha,
  isNotEmpty,
  maxLengthInclusive,
  minLength,
  isNumeric,
} from '@/src/util/validations';

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
      !input.street ||
      !input.city ||
      !input.avenue ||
      !input.zip ||
      !input.state ||
      !input.number
    ) {
      throw new Error('All address fields are mandatory');
    }
    if (!this.validateField(input.street))
      throw new Error('The street field was not filled in correctly');
    if (!this.validateField(input.city))
      throw new Error('The city field was not filled in correctly');
    if (!this.validateField(input.avenue))
      throw new Error('The avenue field was not filled in correctly');
    if (!this.validateField(input.zip, 20, 5))
      throw new Error('The zip field was not filled in correctly');
    if (!this.validateField(input.state, 255, 1))
      throw new Error('The state field was not filled in correctly');
    if (!isNumeric(input.number))
      throw new Error('The number field must be of numeric type');

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

  set street(value: string) {
    this._street = value;
  }

  get city(): string {
    return this._city;
  }

  set city(value: string) {
    this._city = value;
  }

  get zip(): string {
    return this._zip;
  }

  set zip(value: string) {
    this._zip = value;
  }

  get number(): number {
    return this._number;
  }

  set number(value: number) {
    this._number = value;
  }

  get avenue(): string {
    return this._avenue;
  }

  set avenue(value: string) {
    this._avenue = value;
  }

  get state(): string {
    return this._state;
  }

  set state(value: string) {
    this._state = value;
  }

  private validateField(
    value: string,
    maxLen: number = 255,
    minLen: number = 2
  ): boolean {
    return (
      isAlpha(value) &&
      minLength(value, minLen) &&
      maxLengthInclusive(value, maxLen) &&
      isNotEmpty(value)
    );
  }
}
