import {
  isAlpha,
  isNotEmpty,
  isString,
  maxLengthInclusive,
  minLength,
  validId,
} from '@/modules/@shared/utils/validations';

import Salary from '../@shared/value-object/salary.value-object';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { States } from '@/modules/@shared/type/sharedTypes';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';

type AdministratorUserProps = {
  id?: string;
  userId: string;
  salary: Salary;
  graduation: string;
  state?: States;
};

export default class UserAdministrator {
  private _id;
  private _userId;
  private _salary;
  private _graduation;
  private _lifecycle: Lifecycle;

  constructor({ id, userId, graduation, salary, state }: AdministratorUserProps) {
    if (userId === undefined || salary === undefined || graduation === undefined)
      throw new Error('Salary and graduation are mandatory');
    if (!this.validateGraduation(graduation))
      throw new Error('Field graduation is not valid');
    if (!(salary instanceof Salary)) throw new Error('Invalid salary');
    if (!validId(userId)) throw new Error('Invalid id');
    if (id) {
      if (!validId(id)) throw new Error('Invalid id');
      this._id = new Id(id);
    } else {
      this._id = new Id();
    }
    this._userId = userId;
    this._salary = salary;
    this._graduation = graduation;
    this._lifecycle = Lifecycle.from(state ?? StatesEnum.ACTIVE);
  }

  get id(): Id {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get salary(): Salary {
    return this._salary;
  }

  get graduation(): string {
    return this._graduation;
  }

  set graduation(input: string) {
    if (!this.validateGraduation(input)) throw new Error('Field graduation is not valid');
    this._graduation = input;
  }

  private validateGraduation(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      isAlpha(input) &&
      minLength(input, 3) &&
      maxLengthInclusive(input, 255)
    );
  }

  get state(): States {
    return this._lifecycle.value;
  }
  get isActive(): boolean {
    return !this._lifecycle.equals(StatesEnum.INACTIVE);
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
