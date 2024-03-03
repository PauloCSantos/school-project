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
} from '@/util/validations';

type CurriculumProps = {
  id?: Id;
  name: string;
  yearsToComplete: number;
  subjectsList: string[];
};

export default class Curriculum {
  private _id;
  private _name;
  private _yearsToComplete;
  private _subjectsList;

  constructor(input: CurriculumProps) {
    if (
      input.name === undefined ||
      input.yearsToComplete === undefined ||
      input.subjectsList === undefined
    )
      throw new Error('All curriculum fields are mandatory');
    if (!this.validateName(input.name))
      throw new Error('Field name is not valid');
    if (!this.validateYears(input.yearsToComplete))
      throw new Error('Field date is not valid');
    if (!this.validateSubjects(input.subjectsList))
      throw new Error('Subject IDs do not match pattern');

    if (input.id) {
      if (!(input.id instanceof Id)) throw new Error('Invalid id');
      this._id = input.id;
    } else {
      this._id = new Id();
    }

    this._name = input.name;
    this._yearsToComplete = input.yearsToComplete;
    this._subjectsList = input.subjectsList;
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
    if (!this.validateName(input))
      throw new Error('Field description is not valid');
    this._name = input;
  }
  set year(input: number) {
    if (!this.validateYears(input))
      throw new Error('Field description is not valid');
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
}
