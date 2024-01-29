import {
  isAlpha,
  isNotEmpty,
  maxLengthInclusive,
  minLength,
} from '@/util/validations';
import UserBase, {
  UserBaseProps,
} from '../../@shared/domain/entity/user-base.entity';
import Salary from '../../@shared/domain/value-object/salary.value-object';

type AdministratorUserProps = UserBaseProps & {
  salary: Salary;
  graduation: string;
};

export default class UserAdministrator extends UserBase {
  private _salary;
  private _graduation;

  constructor(input: AdministratorUserProps) {
    super(input);
    if (!input.salary || !input.graduation)
      throw new Error('Salary and graduation are mandatory');
    if (!this.validateGraduation(input.graduation))
      throw new Error('Field graduation is not valid');
    this._salary = input.salary;
    this._graduation = input.graduation;
  }

  get salary(): Salary {
    return this._salary;
  }

  get graduation(): string {
    return this._graduation;
  }

  set graduation(input: string) {
    if (!this.validateGraduation(input))
      throw new Error('Field graduation is not valid');
    this._graduation = input;
  }

  private validateGraduation(input: string): boolean {
    return (
      isNotEmpty(input) &&
      isAlpha(input) &&
      minLength(input, 3) &&
      maxLengthInclusive(input, 255)
    );
  }
}
