import { isNumeric, isGreaterZero, validCurrency } from '@/util/validations';

type inputProps = {
  salary: number;
  currency?: 'R$' | '€' | '$';
};
export default class Salary {
  private _salary: number;
  private _currency: 'R$' | '€' | '$';
  constructor(input: inputProps) {
    if (input.salary === undefined)
      throw new Error('Field salary is mandatory');
    if (!this.validateSalary(input.salary))
      throw new Error(
        'Salary must be greater than zero and be of numeric type'
      );
    if (input.currency !== undefined) {
      if (
        !(typeof input.currency === 'string') ||
        !validCurrency(input.currency)
      )
        throw new Error('This currency is not accepted');
      this._currency = input.currency;
    } else {
      this._currency = 'R$';
    }
    this._salary = input.salary;
  }

  calculateTotalIncome(): string {
    return `${this._currency}:${this._salary}`;
  }

  set salary(value: number) {
    if (!this.validateSalary(value))
      throw new Error(
        'Salary must be greater than zero and be of numeric type'
      );
    this._salary = value;
  }

  get salary(): number {
    return this._salary;
  }

  get currency(): 'R$' | '€' | '$' {
    return this._currency;
  }

  set currency(value: 'R$' | '€' | '$') {
    if (!(typeof value === 'string') || !validCurrency(value))
      throw new Error('This currency is not accepted');
    this._currency = value;
  }

  increaseSalary(percentValue: number) {
    if (!this.validateSalary(percentValue))
      throw new Error(
        'The percentage value must be greater than zero and be of numeric type'
      );
    this._salary = (percentValue / 100) * this._salary + this._salary;
  }

  decreaseSalary(percentValue: number) {
    if (!this.validateSalary(percentValue) && percentValue < 100)
      throw new Error(
        'The percentage value must be between 0 and 100 and be of numeric type'
      );
    this._salary = this._salary - (percentValue / 100) * this._salary;
  }

  private validateSalary(value: number): boolean {
    return isGreaterZero(value) && isNumeric(value);
  }
}
