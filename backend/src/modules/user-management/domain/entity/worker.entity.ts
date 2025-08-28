import { validId } from '@/modules/@shared/utils/validations';
import Salary from '../@shared/value-object/salary.value-object';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { States } from '@/modules/@shared/type/sharedTypes';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';

type WorkerUserProps = {
  id?: string;
  userId: string;
  salary: Salary;
  state?: States;
};

export default class UserWorker {
  private _id;
  private _userId;
  private _salary;
  private _lifecycle: Lifecycle;

  constructor({ id, userId, salary, state }: WorkerUserProps) {
    if (userId === undefined) throw new Error('Master user needs id');
    if (!validId(userId)) throw new Error('Invalid id');
    if (salary === undefined) throw new Error('Salary field is mandatory');
    if (!(salary instanceof Salary)) throw new Error('Invalid salary');
    if (id) {
      if (!validId(id)) throw new Error('Invalid id');
      this._id = new Id(id);
    } else {
      this._id = new Id();
    }
    this._userId = userId;
    this._salary = salary;
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
