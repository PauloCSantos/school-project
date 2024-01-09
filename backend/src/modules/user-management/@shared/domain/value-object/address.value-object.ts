import {
  isNotEmpty,
  maxLengthInclusive,
  minLength,
  isNumeric,
} from '@/util/validations';

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
      throw new Error('The street field was not filled in correctly');
    this._street = value;
  }
  set city(value: string) {
    if (!this.validateField(value))
      throw new Error('The city field was not filled in correctly');
    this._city = value;
  }
  set zip(value: string) {
    if (!this.validateField(value, 20, 5))
      throw new Error('The zip field was not filled in correctly');
    this._zip = value;
  }
  set number(value: number) {
    if (!isNumeric(value))
      throw new Error('The number field must be of numeric type');
    this._number = value;
  }
  set avenue(value: string) {
    if (!this.validateField(value))
      throw new Error('The avenue field was not filled in correctly');
    this._avenue = value;
  }
  set state(value: string) {
    if (!this.validateField(value, 255, 1))
      throw new Error('The state field was not filled in correctly');
    this._state = value;
  }

  private validateField(
    value: string,
    maxLen: number = 255,
    minLen: number = 2
  ): boolean {
    return (
      isNotEmpty(value) &&
      minLength(value, minLen) &&
      maxLengthInclusive(value, maxLen)
    );
  }
}
