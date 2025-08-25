import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { isGreaterZero, isNumeric, validId } from '@/modules/@shared/utils/validations';

type StudentUserProps = {
  id?: string;
  userId: string;
  paymentYear: number;
};

export default class UserStudent {
  private _id;
  private _userId;
  private _paymentYear;

  constructor({ id, userId, paymentYear }: StudentUserProps) {
    if (userId === undefined) throw new Error('Master user needs id');
    if (!validId(userId)) throw new Error('Invalid id');
    if (paymentYear === undefined) throw new Error('Payment field is mandatory');
    if (!this.validatePayment(paymentYear)) throw new Error('Field payment is not valid');
    if (id) {
      if (!validId(id)) throw new Error('Invalid id');
      this._id = new Id(id);
    } else {
      this._id = new Id();
    }
    this._userId = userId;
    this._paymentYear = paymentYear;
  }

  get id(): Id {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get paymentYear(): number {
    return this._paymentYear;
  }

  set paymentYear(value: number) {
    if (!this.validatePayment(value)) throw new Error('Field payment is not valid');
    this._paymentYear = value;
  }

  paymentWithCurrencyBR(): string {
    return `R$ ${this._paymentYear}`;
  }

  private validatePayment(value: number): boolean {
    return isGreaterZero(value) && isNumeric(value);
  }
}
