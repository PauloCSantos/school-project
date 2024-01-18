import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { areAllValuesUnique, validId } from '@/util/validations';

type ScheduleProps = {
  id?: Id;
  student: string;
  curriculum: string;
  lessonsList: string[];
};

export default class Schedule {
  private _id;
  private _student;
  private _curriculum;
  private _lessonsList: string[];

  constructor(input: ScheduleProps) {
    if (!input.curriculum || !input.lessonsList || !input.student)
      throw new Error('All schedule fields are mandatory');
    if (!validId(input.curriculum))
      throw new Error('Curriculum id is not valid');
    if (!validId(input.student)) throw new Error('Student id is not valid');
    if (
      !input.lessonsList.every(id => validId(id)) &&
      areAllValuesUnique(input.lessonsList)
    )
      throw new Error('lessons list have an invalid id');

    this._id = input.id || new Id();
    this._student = input.student;
    this._curriculum = input.curriculum;
    this._lessonsList = input.lessonsList;
  }

  get id(): Id {
    return this._id;
  }
  get student(): string {
    return this._student;
  }
  get curriculum(): string {
    return this._curriculum;
  }
  get lessonsList(): string[] {
    return this._lessonsList;
  }

  set curriculum(input: string) {
    if (!validId(input)) throw new Error('Curriculum id is not valid');
    this._curriculum = input;
  }

  addLesson(input: string): void {
    if (!validId(input)) throw new Error('Lesson id is not valid');
    if (this.findIndex(input) === -1) {
      this._lessonsList.push(input);
    } else {
      throw new Error('This lesson is already on the lesson');
    }
  }
  removeLesson(input: string): void {
    if (!validId(input)) throw new Error('Lesson id is not valid');
    const index = this.findIndex(input);
    if (index !== -1) {
      this._lessonsList.splice(index, 1);
    } else {
      throw new Error('This lesson is not included in the schedule');
    }
  }

  private findIndex(value: string): number {
    return this._lessonsList.indexOf(value);
  }
}
