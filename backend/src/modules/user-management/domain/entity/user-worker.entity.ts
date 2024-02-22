import UserBase, {
  UserBaseProps,
} from '../../@shared/domain/entity/user-base.entity';
import Salary from '../../@shared/domain/value-object/salary.value-object';

type WorkerUserProps = UserBaseProps & {
  salary: Salary;
};

export default class UserWorker extends UserBase {
  private _salary;

  constructor(input: WorkerUserProps) {
    super(input);
    if (input.salary === undefined)
      throw new Error('Salary filed is mandatory');
    if (!(input.salary instanceof Salary)) throw new Error('Invalid salary');
    this._salary = input.salary;
  }

  get salary(): Salary {
    return this._salary;
  }
}
