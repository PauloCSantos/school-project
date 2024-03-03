import {
  isAlpha,
  isNotEmpty,
  isString,
  maxLengthInclusive,
  minLength,
} from '@/util/validations';
import UserBase, {
  UserBaseProps,
} from '../../@shared/domain/entity/user-base.entity';
import Salary from '../../@shared/domain/value-object/salary.value-object';

type TeacherUserProps = UserBaseProps & {
  salary: Salary;
  graduation: string;
  academicDegrees: string;
};

export default class UserTeacher extends UserBase {
  private _salary;
  private _graduation;
  private _academicDegrees;

  constructor(input: TeacherUserProps) {
    super(input);
    if (
      input.salary === undefined ||
      input.graduation === undefined ||
      input.academicDegrees === undefined
    )
      throw new Error('Salary, graduation and academic degrees are mandatory');
    if (!this.validateGraduation(input.graduation))
      throw new Error('Field graduation is not valid');
    if (!this.validateAcademicDegrees(input.academicDegrees))
      throw new Error('Field academic degrees is not valid');
    if (!(input.salary instanceof Salary)) throw new Error('Invalid salary');

    this._salary = input.salary;
    this._graduation = input.graduation;
    this._academicDegrees = input.academicDegrees;
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
      throw new Error('Field graduation is not valid');
    this._graduation = input;
  }

  set academicDegrees(input: string) {
    if (!this.validateAcademicDegrees(input))
      throw new Error('Field academic degrees is not valid');
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
      minLength(input, 1) &&
      maxLengthInclusive(input, 255)
    );
  }
}
