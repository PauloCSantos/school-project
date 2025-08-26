import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';
import { States } from '@/modules/@shared/type/sharedTypes';
import {
  isNotEmpty,
  isNumeric,
  isString,
  maxLengthInclusive,
  minLength,
  validId,
  validNote,
} from '@/modules/@shared/utils/validations';

/**
 * Properties required to create an evaluation
 */
export type EvaluationProps = {
  id?: Id;
  teacher: string;
  lesson: string;
  type: string;
  value: number;
  state?: States;
};

/**
 * Entity representing an evaluation in the system
 *
 * Responsible for defining evaluation criteria and standards for a lesson
 */
export default class Evaluation {
  private _id: Id;
  private _teacher: string;
  private _lesson: string;
  private _type: string;
  private _value: number;
  private _lifecycle: Lifecycle;

  /**
   * Creates a new evaluation
   *
   * @param input - Evaluation properties including teacher, lesson, type, and value
   * @throws Error if any required field is missing or invalid
   */
  constructor(input: EvaluationProps) {
    this.validateConstructorParams(input);

    this._id = input.id || new Id();
    this._teacher = input.teacher;
    this._lesson = input.lesson;
    this._type = input.type;
    this._value = input.value;
    this._lifecycle = Lifecycle.from(input.state ?? StatesEnum.ACTIVE);
  }

  /**
   * Validates all parameters provided to the constructor
   */
  private validateConstructorParams(input: EvaluationProps): void {
    if (
      input.teacher === undefined ||
      input.lesson === undefined ||
      input.type === undefined ||
      input.value === undefined
    ) {
      throw new Error('All evaluation fields are mandatory');
    }

    if (input.id && !(input.id instanceof Id)) {
      throw new Error('Invalid id');
    }

    if (!validId(input.teacher)) {
      throw new Error('Teacher id is not valid');
    }

    if (!validId(input.lesson)) {
      throw new Error('Lesson id is not valid');
    }

    if (!this.validateType(input.type)) {
      throw new Error('Type field is not valid');
    }

    if (!this.validateValue(input.value)) {
      throw new Error('The value field must be numeric and between 0 and 10');
    }
  }

  /**
   * Unique identifier for this evaluation
   */
  get id(): Id {
    return this._id;
  }

  /**
   * ID of the teacher who created this evaluation
   */
  get teacher(): string {
    return this._teacher;
  }

  /**
   * Sets a new teacher ID after validation
   */
  set teacher(value: string) {
    if (!validId(value)) {
      throw new Error('Teacher id is not valid');
    }
    this._teacher = value;
  }

  /**
   * ID of the lesson this evaluation belongs to
   */
  get lesson(): string {
    return this._lesson;
  }

  /**
   * Sets a new lesson ID after validation
   */
  set lesson(value: string) {
    if (!validId(value)) {
      throw new Error('Lesson id is not valid');
    }
    this._lesson = value;
  }

  /**
   * Type of evaluation (e.g., exam, quiz, project)
   */
  get type(): string {
    return this._type;
  }

  /**
   * Sets a new evaluation type after validation
   */
  set type(value: string) {
    if (!this.validateType(value)) {
      throw new Error('Type field is not valid');
    }
    this._type = value;
  }

  /**
   * Maximum value for this evaluation (used for grading scale)
   */
  get value(): number {
    return this._value;
  }

  /**
   * Sets a new maximum value after validation
   */
  set value(value: number) {
    if (!this.validateValue(value)) {
      throw new Error('The value field must be numeric and between 0 and 10');
    }
    this._value = value;
  }

  /**
   * Validates the evaluation type string
   *
   * @param value - Type string to validate
   * @returns True if the type is valid, false otherwise
   */
  private validateType(value: string): boolean {
    return (
      isString(value) &&
      isNotEmpty(value) &&
      maxLengthInclusive(value, 100) &&
      minLength(value, 3)
    );
  }

  /**
   * Validates the evaluation value
   *
   * @param input - Value to validate
   * @returns True if the value is valid, false otherwise
   */
  private validateValue(input: number): boolean {
    return isNumeric(input) && validNote(input);
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
