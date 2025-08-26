import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';
import { States } from '@/modules/@shared/type/sharedTypes';
import { isGreaterZero, isNumeric, validId } from '@/modules/@shared/utils/validations';

type StudentUserProps = {
  id?: string;
  userId: string;
  paymentYear: number;
  state?: States;
};

export default class UserStudent {
  private _id;
  private _userId;
  private _paymentYear;
  private _lifecycle: Lifecycle;

  constructor({ id, userId, paymentYear, state }: StudentUserProps) {
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
    this._lifecycle = Lifecycle.from(state ?? StatesEnum.ACTIVE);
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

  get state(): States {
    return this._lifecycle.value;
  }
  get isActive(): boolean {
    return this._lifecycle.equals(StatesEnum.INACTIVE);
  }
  get isPending(): boolean {
    return this._lifecycle.equals(StatesEnum.PENDING);
  }

  deactivate(): void {
    this._lifecycle = this._lifecycle.deactivate();
  }
  reactivate(requireVerification = false): void {
    this._lifecycle = this._lifecycle.activate(requireVerification);
  }
  markVerified(): void {
    this._lifecycle = this._lifecycle.markVerified();
  }
}
