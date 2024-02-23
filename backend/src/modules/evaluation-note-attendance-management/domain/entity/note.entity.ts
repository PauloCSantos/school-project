import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { isNumeric, validId, validNote } from '@/util/validations';

type NoteProps = {
  id?: Id;
  evaluation: string;
  student: string;
  note: number;
};

export default class Note {
  private _id;
  private _evaluation;
  private _student;
  private _note;

  constructor(input: NoteProps) {
    if (
      input.evaluation === undefined ||
      input.student === undefined ||
      input.note === undefined
    )
      throw new Error('All note fields are mandatory');
    if (!validId(input.evaluation))
      throw new Error('Evaluation id is not valid');
    if (!validId(input.student)) throw new Error('Student id is not valid');
    if (!this.validateNote(input.note))
      throw new Error('The note field must be numeric and between 0 and 10');
    if (input.id) {
      if (!(input.id instanceof Id)) throw new Error('Invalid id');
      this._id = input.id;
    } else {
      this._id = new Id();
    }

    this._evaluation = input.evaluation;
    this._student = input.student;
    this._note = input.note;
  }

  get id(): Id {
    return this._id;
  }
  get evaluation(): string {
    return this._evaluation;
  }
  get student(): string {
    return this._student;
  }
  get note(): number {
    return this._note;
  }

  set evaluation(value: string) {
    if (!validId(value)) throw new Error('Evaluation id is not valid');
    this._evaluation = value;
  }
  set student(value: string) {
    if (!validId(value)) throw new Error('Student id is not valid');
    this._student = value;
  }
  set note(value: number) {
    if (!this.validateNote(value))
      throw new Error('The note field must be numeric and between 0 and 10');
    this._note = value;
  }

  private validateNote(input: number): boolean {
    return isNumeric(input) && validNote(input);
  }
}
