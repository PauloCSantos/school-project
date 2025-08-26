import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  areAllValuesUnique,
  isGreaterZero,
  isNotEmpty,
  isNumeric,
  isString,
  maxLengthInclusive,
  minLength,
  validId,
} from '../../../@shared/utils/validations';
import { States } from '@/modules/@shared/type/sharedTypes';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';

type CurriculumProps = {
  id?: Id;
  name: string;
  yearsToComplete: number;
  subjectsList: string[];
  state?: States;
};

export default class Curriculum {
  private _id;
  private _name;
  private _yearsToComplete;
  private _subjectsList;
  private _lifecycle: Lifecycle;

  constructor({ id, name, yearsToComplete, subjectsList, state }: CurriculumProps) {
    if (name === undefined || yearsToComplete === undefined || subjectsList === undefined)
      throw new Error('All curriculum fields are mandatory');
    if (!this.validateName(name)) throw new Error('Field name is not valid');
    if (!this.validateYears(yearsToComplete)) throw new Error('Field date is not valid');
    if (!this.validateSubjects(subjectsList))
      throw new Error('Subject IDs do not match pattern');

    if (id) {
      if (!(id instanceof Id)) throw new Error('Invalid id');
      this._id = id;
    } else {
      this._id = new Id();
    }

    this._name = name;
    this._yearsToComplete = yearsToComplete;
    this._subjectsList = subjectsList;
    this._lifecycle = Lifecycle.from(state ?? StatesEnum.ACTIVE);
  }

  get id(): Id {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get yearsToComplete(): number {
    return this._yearsToComplete;
  }
  get subjectList(): string[] {
    return this._subjectsList;
  }

  set name(input: string) {
    if (!this.validateName(input)) throw new Error('Field description is not valid');
    this._name = input;
  }
  set year(input: number) {
    if (!this.validateYears(input)) throw new Error('Field description is not valid');
    this._yearsToComplete = input;
  }

  addSubject(input: string): void {
    if (this.findIndex(input) === -1) {
      if (!validId(input)) throw new Error('This subject id is invalid');
      this._subjectsList.push(input);
    } else {
      throw new Error('This subject is already on the curriculum');
    }
  }
  removeSubject(input: string) {
    const index = this.findIndex(input);
    if (index !== -1) {
      this._subjectsList.splice(index, 1);
    } else {
      throw new Error('This subject is not included in the curriculum');
    }
  }

  private findIndex(value: string): number {
    return this._subjectsList.indexOf(value);
  }
  private validateName(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 255) &&
      minLength(input, 3)
    );
  }
  private validateYears(input: number): boolean {
    return isNumeric(input) && isGreaterZero(input);
  }
  private validateSubjects(subjects: string[]): boolean {
    return subjects.every(id => validId(id)) && areAllValuesUnique(subjects);
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
