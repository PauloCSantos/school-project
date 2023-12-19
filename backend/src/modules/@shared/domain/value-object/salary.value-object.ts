import { isNumeric } from '@/src/util/validations';

type inputProps = {
  salary: number;
  currency?: 'R$' | '€' | '$';
};
export class Salary {
  private _salary: number;
  private _currency: 'R$' | '€' | '$';
  constructor(input: inputProps) {
    if (!isNumeric(input.salary))
      throw new Error('The salary field must be of numeric type');
    this._currency = input.currency ?? 'R$';
    this._salary = input.salary;
  }

  calculateTotalIncome(): string {
    return `${this._currency}:${this._salary}`;
  }

  set salary(value: number) {
    this._salary = value;
  }

  get salary(): number {
    return this._salary;
  }

  get currency(): 'R$' | '€' | '$' {
    return this._currency;
  }

  set currency(value: 'R$' | '€' | '$') {
    this._currency = value;
  }

  increaseSalary(percentValue: number) {
    this._salary = percentValue * this._salary + this._salary;
  }

  decreaseSalary(percentValue: number) {
    this._salary = percentValue * this._salary - this._salary;
  }
}
