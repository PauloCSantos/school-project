import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';
import { States } from '@/modules/@shared/type/sharedTypes';
import { isNumeric, validId, validNote } from '@/modules/@shared/utils/validations';

/**
 * Properties required to create a note
 */
export type NoteProps = {
  id?: Id;
  evaluation: string;
  student: string;
  note: number;
  state?: States;
};

/**
 * Entity representing a student's grade/note for a specific evaluation
 *
 * Responsible for storing and validating student performance records
 */
export default class Note {
  private _id: Id;
  private _evaluation: string;
  private _student: string;
  private _note: number;
  private _lifecycle: Lifecycle;

  /**
   * Creates a new note record
   *
   * @param input - Note properties including evaluation ID, student ID, and note value
   * @throws Error if any required field is missing or invalid
   */
  constructor(input: NoteProps) {
    this.validateConstructorParams(input);

    this._id = input.id || new Id();
    this._evaluation = input.evaluation;
    this._student = input.student;
    this._note = input.note;
    this._lifecycle = Lifecycle.from(input.state ?? StatesEnum.ACTIVE);
  }

  /**
   * Validates all parameters provided to the constructor
   */
  private validateConstructorParams(input: NoteProps): void {
    if (
      input.evaluation === undefined ||
      input.student === undefined ||
      input.note === undefined
    ) {
      throw new Error('All note fields are mandatory');
    }

    if (input.id && !(input.id instanceof Id)) {
      throw new Error('Invalid id');
    }

    if (!validId(input.evaluation)) {
      throw new Error('Evaluation id is not valid');
    }

    if (!validId(input.student)) {
      throw new Error('Student id is not valid');
    }

    if (!this.validateNote(input.note)) {
      throw new Error('The note field must be numeric and between 0 and 10');
    }
  }

  /**
   * Unique identifier for this note
   */
  get id(): Id {
    return this._id;
  }

  /**
   * ID of the evaluation this note is for
   */
  get evaluation(): string {
    return this._evaluation;
  }

  /**
   * Sets a new evaluation ID after validation
   */
  set evaluation(value: string) {
    if (!validId(value)) {
      throw new Error('Evaluation id is not valid');
    }
    this._evaluation = value;
  }

  /**
   * ID of the student this note belongs to
   */
  get student(): string {
    return this._student;
  }

  /**
   * Sets a new student ID after validation
   */
  set student(value: string) {
    if (!validId(value)) {
      throw new Error('Student id is not valid');
    }
    this._student = value;
  }

  /**
   * The actual grade/note value
   */
  get note(): number {
    return this._note;
  }

  /**
   * Sets a new note value after validation
   */
  set note(value: number) {
    if (!this.validateNote(value)) {
      throw new Error('The note field must be numeric and between 0 and 10');
    }
    this._note = value;
  }

  /**
   * Validates the note value
   *
   * @param input - Note value to validate
   * @returns True if the note is valid, false otherwise
   */
  private validateNote(input: number): boolean {
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
