import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  isNotEmpty,
  isNumeric,
  maxLengthInclusive,
  minLength,
  validNote,
  validId,
  isString,
} from '@/modules/@shared/utils/validations';

type EvaluationProps = {
  id?: Id;
  teacher: string;
  lesson: string;
  type: string;
  value: number;
};

export default class Evaluation {
  private _id;
  private _teacher;
  private _lesson;
  private _type;
  private _value;

  constructor(input: EvaluationProps) {
    if (
      input.teacher === undefined ||
      input.lesson === undefined ||
      input.type === undefined ||
      input.value === undefined
    )
      throw new Error('All evalutation fields are mandatory');

    if (!validId(input.teacher)) throw new Error('Teacher id is not valid');
    if (!validId(input.lesson)) throw new Error('Lesson id is not valid');
    if (!this.validateType(input.type))
      throw new Error('Type field is not valid');
    if (!this.validateValue(input.value))
      throw new Error('The value field must be numeric and between 0 and 10');
    if (input.id) {
      if (!(input.id instanceof Id)) throw new Error('Invalid id');
      this._id = input.id;
    } else {
      this._id = new Id();
    }

    this._teacher = input.teacher;
    this._lesson = input.lesson;
    this._type = input.type;
    this._value = input.value;
  }

  get id(): Id {
    return this._id;
  }
  get teacher(): string {
    return this._teacher;
  }
  get lesson(): string {
    return this._lesson;
  }
  get type(): string {
    return this._type;
  }
  get value(): number {
    return this._value;
  }

  set teacher(value: string) {
    if (!validId(value)) throw new Error('Teacher id is not valid');
    this._teacher = value;
  }
  set lesson(value: string) {
    if (!validId(value)) throw new Error('Lesson id is not valid');
    this._lesson = value;
  }
  set type(value: string) {
    if (!this.validateType(value)) throw new Error('Type field is not valid');
    this._type = value;
  }
  set value(value: number) {
    if (!this.validateValue(value))
      throw new Error('The value field must be numeric and between 0 and 10');
    this._value = value;
  }

  private validateType(value: string): boolean {
    return (
      isString(value) &&
      isNotEmpty(value) &&
      maxLengthInclusive(value, 100) &&
      minLength(value, 3)
    );
  }
  private validateValue(input: number): boolean {
    return isNumeric(input) && validNote(input);
  }
}
