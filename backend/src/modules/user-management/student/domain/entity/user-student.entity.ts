import { isGreaterZero, isNumeric } from '@/util/validations';
import UserBase, {
  UserBaseProps,
} from '../../../@shared/domain/entity/user-base.entity';

type StudentUserProps = UserBaseProps & {
  paymentYear: number;
};

export default class UserStudent extends UserBase {
  private _paymentYear;

  constructor(input: StudentUserProps) {
    super(input);
    if (!this.validatePayment(input.paymentYear))
      throw new Error('Field payment is not valid');
    this._paymentYear = input.paymentYear;
  }

  get paymentYear(): number {
    return this._paymentYear;
  }

  set paymentYear(value: number) {
    if (!this.validatePayment(value))
      throw new Error('Field payment is not valid');
    this._paymentYear = value;
  }

  paymentWithCurrencyBR(): string {
    return `R$ ${this._paymentYear}`;
  }

  private validatePayment(value: number): boolean {
    return isGreaterZero(value) && isNumeric(value);
  }
}
