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
import { ValidationError } from '@/modules/@shared/application/errors/validation.error';

type TeacherUserProps = {
  id?: string;
  userId: string;
  salary: Salary;
  graduation: string;
  academicDegrees: string;
  state?: States;
};

export default class UserTeacher {
  private _id;
  private _userId;
  private _salary;
  private _graduation;
  private _academicDegrees;
  private _lifecycle: Lifecycle;

  constructor({
    id,
    userId,
    salary,
    graduation,
    academicDegrees,
    state,
  }: TeacherUserProps) {
    if (
      userId === undefined ||
      salary === undefined ||
      graduation === undefined ||
      academicDegrees === undefined
    )
      throw new ValidationError(
        'User Id, salary, graduation and academic degrees are mandatory'
      );
    if (userId === undefined) throw new ValidationError('Master user needs id');
    if (!validId(userId)) throw new ValidationError('Invalid id');
    if (!this.validateGraduation(graduation))
      throw new ValidationError('Field graduation is not valid');
    if (!this.validateAcademicDegrees(academicDegrees))
      throw new ValidationError('Field academic degrees is not valid');
    if (!(salary instanceof Salary)) throw new ValidationError('Invalid salary');
    if (id) {
      if (!validId(id)) throw new ValidationError('Invalid id');
      this._id = new Id(id);
    } else {
      this._id = new Id();
    }
    this._userId = userId;
    this._salary = salary;
    this._graduation = graduation;
    this._academicDegrees = academicDegrees;
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

  get academicDegrees(): string {
    return this._academicDegrees;
  }

  set graduation(input: string) {
    if (!this.validateGraduation(input))
      throw new ValidationError('Field graduation is not valid');
    this._graduation = input;
  }

  set academicDegrees(input: string) {
    if (!this.validateAcademicDegrees(input))
      throw new ValidationError('Field academic degrees is not valid');
    this._academicDegrees = input;
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

  private validateAcademicDegrees(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      minLength(input, 2) &&
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
