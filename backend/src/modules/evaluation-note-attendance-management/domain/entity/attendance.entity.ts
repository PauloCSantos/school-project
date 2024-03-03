import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  areAllValuesUnique,
  validDate,
  validDay,
  validHour24h,
  validId,
} from '@/util/validations';

type AttendanceProps = {
  id?: Id;
  lesson: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  studentsPresent: string[];
};

export default class Attendance {
  private _id;
  private _lesson;
  private _date;
  private _hour;
  private _day;
  private _studentsPresent;

  constructor(input: AttendanceProps) {
    if (
      input.lesson === undefined ||
      input.date === undefined ||
      input.hour === undefined ||
      input.day === undefined ||
      input.studentsPresent === undefined
    )
      throw new Error('All attendance fields are mandatory');

    if (!validId(input.lesson)) throw new Error('Lesson id is not valid');
    if (!validDay(input.day)) throw new Error('Day are not up to standard');
    if (!validHour24h(input.hour))
      throw new Error('Hour is not up to standard');
    if (!validDate(input.date)) throw new Error('Date is not up to standard');
    if (!this.validateList(input.studentsPresent))
      throw new Error('All student IDs do not follow standards');
    if (input.id) {
      if (!(input.id instanceof Id)) throw new Error('Invalid id');
      this._id = input.id;
    } else {
      this._id = new Id();
    }

    this._lesson = input.lesson;
    this._date = input.date;
    this._hour = input.hour;
    this._day = input.day;
    this._studentsPresent = input.studentsPresent;
  }

  get id(): Id {
    return this._id;
  }
  get lesson(): string {
    return this._lesson;
  }
  get date(): Date {
    return this._date;
  }
  get hour(): string {
    return this._hour;
  }
  get day(): string {
    return this._day;
  }
  get studentsPresent(): string[] {
    return this._studentsPresent;
  }

  set lesson(value: string) {
    if (!validId(value)) throw new Error('Lesson id is not valid');
    this._lesson = value;
  }
  set date(value: Date) {
    if (!validDate(value)) throw new Error('Date is not up to standard');
    this._date = value;
  }
  set hour(value: Hour) {
    if (!validHour24h(value)) throw new Error('Hour is not up to standard');
    this._hour = value;
  }
  set day(value: DayOfWeek) {
    if (!validDay(value)) throw new Error('Day are not up to standard');
    this._day = value;
  }

  addStudent(input: string) {
    if (!validId(input)) throw new Error('Student id is not valid');
    if (this.findIndex(input) === -1) {
      this._studentsPresent.push(input);
    } else {
      throw new Error('This student is already on the attendance');
    }
  }
  removeStudent(input: string): void {
    if (!validId(input)) throw new Error('Student id is not valid');
    const index = this.findIndex(input);
    if (index !== -1) {
      this._studentsPresent.splice(index, 1);
    } else {
      throw new Error('This student is not included in the attendance');
    }
  }

  private validateList(subjects: string[]): boolean {
    return subjects.every(id => validId(id)) && areAllValuesUnique(subjects);
  }
  private findIndex(value: string): number {
    return this._studentsPresent.indexOf(value);
  }
}
