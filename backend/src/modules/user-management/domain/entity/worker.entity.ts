import { validId } from '@/modules/@shared/utils/validations';
import Salary from '../@shared/value-object/salary.value-object';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

type WorkerUserProps = {
  id?: string;
  userId: string;
  salary: Salary;
};

export default class UserWorker {
  private _id;
  private _userId;
  private _salary;

  constructor({ id, userId, salary }: WorkerUserProps) {
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
}
