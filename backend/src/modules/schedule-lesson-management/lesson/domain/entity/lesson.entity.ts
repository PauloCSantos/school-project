import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  areAllValuesUnique,
  isGreaterZero,
  isNotEmpty,
  isNumeric,
  maxLengthInclusive,
  minLength,
  validDay,
  validHour24h,
  validId,
} from '@/util/validations';

type LessonProps = {
  id?: Id;
  name: string;
  duration: number;
  teacher: string;
  studentsList: string[];
  subject: string;
  days: DayOfWeek[];
  times: Hour[];
  semester: 1 | 2;
};

export default class Lesson {
  private _id;
  private _name;
  private _duration;
  private _teacher;
  private _studentsList;
  private _subject;
  private _days;
  private _times;
  private _semester;

  constructor(input: LessonProps) {
    if (
      !input.name ||
      input.duration === undefined ||
      !input.teacher ||
      !input.studentsList ||
      !input.subject ||
      !input.days ||
      !input.times ||
      !input.semester === undefined
    )
      throw new Error('All lesson fields are mandatory');

    if (!this.validateName(input.name))
      throw new Error('Field name is not valid');
    if (!this.validateNumbers(input.duration))
      throw new Error('Field duration is not valid');
    if (!validId(input.teacher)) throw new Error('Teacher id is not valid');
    if (!this.validateStudents(input.studentsList))
      throw new Error('Subject IDs do not match pattern');
    if (!validId(input.subject)) throw new Error('Subject id is not valid');
    if (
      !input.days.every(day => validDay(day)) &&
      areAllValuesUnique(input.days)
    )
      throw new Error('Days are not up to standard');
    if (input.semester !== 1 && input.semester !== 2)
      throw new Error('Field semester is not valid');
    if (
      !input.times.every(time => validHour24h(time)) &&
      areAllValuesUnique(input.times)
    )
      throw new Error('Times are not up to standard');
    this._id = input.id || new Id();
    this._name = input.name;
    this._duration = input.duration;
    this._teacher = input.teacher;
    this._studentsList = input.studentsList;
    this._subject = input.subject;
    this._days = input.days;
    this._times = input.times;
    this._semester = input.semester;
  }

  get id(): Id {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get duration(): number {
    return this._duration;
  }
  get teacher(): string {
    return this._teacher;
  }
  get studentList(): string[] {
    return this._studentsList;
  }
  get subject(): string {
    return this._subject;
  }
  get days(): DayOfWeek[] {
    return this._days;
  }
  get times(): string[] {
    return this._times;
  }
  get semester(): 1 | 2 {
    return this._semester;
  }

  set name(newName: string) {
    if (!this.validateName(newName)) {
      throw new Error('Field name is not valid');
    }
    this._name = newName;
  }
  set duration(newDuration: number) {
    if (!this.validateNumbers(newDuration)) {
      throw new Error('Field duration is not valid');
    }
    this._duration = newDuration;
  }
  set teacher(newTeacher: string) {
    if (!validId(newTeacher)) {
      throw new Error('Teacher id is not valid');
    }
    this._teacher = newTeacher;
  }
  set subject(newSubject: string) {
    if (!validId(newSubject)) {
      throw new Error('Subject id is not valid');
    }
    this._subject = newSubject;
  }
  set semester(newSemester: 1 | 2) {
    if (newSemester !== 1 && newSemester !== 2) {
      throw new Error('Field semester is not valid');
    }
    this._semester = newSemester;
  }

  addStudent(input: string) {
    if (!validId(input)) throw new Error('Student id is not valid');
    if (this.findIndex(input) === -1) {
      this._studentsList.push(input);
    } else {
      throw new Error('This studend is already on the lesson');
    }
  }
  removeStudent(input: string): void {
    if (!validId(input)) throw new Error('Student id is not valid');
    const index = this.findIndex(input);
    if (index !== -1) {
      this._studentsList.splice(index, 1);
    } else {
      throw new Error('This studend is not included in the lesson');
    }
  }
  addDay(day: DayOfWeek): void {
    if (!validDay(day)) throw new Error(`${day} is not valid`);
    if (!this._days.includes(day)) {
      this._days.push(day);
    } else {
      throw new Error(`Day ${day} is already added to the lesson`);
    }
  }
  removeDay(day: DayOfWeek): void {
    if (!validDay(day)) throw new Error(`${day} is not valid`);
    const index = this._days.indexOf(day);
    if (index !== -1) {
      this._days.splice(index, 1);
    } else {
      throw new Error(`Day ${day} is not included in the lesson`);
    }
  }
  addTime(time: Hour): void {
    if (!validHour24h(time))
      throw new Error(`${time} is not a valid 24-hour format time`);
    if (!this._times.includes(time)) {
      this._times.push(time);
    } else {
      throw new Error(`Time ${time} is already added to the lesson`);
    }
  }
  removeTime(time: Hour): void {
    if (!validHour24h(time))
      throw new Error(`${time} is not a valid 24-hour format time`);
    const index = this._times.indexOf(time);
    if (index !== -1) {
      this._times.splice(index, 1);
    } else {
      throw new Error(`Time ${time} is not included in the lesson`);
    }
  }

  private findIndex(value: string): number {
    return this._studentsList.indexOf(value);
  }
  private validateName(input: string): boolean {
    return (
      isNotEmpty(input) && maxLengthInclusive(input, 255) && minLength(input, 4)
    );
  }
  private validateNumbers(input: number): boolean {
    return isNumeric(input) && isGreaterZero(input);
  }
  private validateStudents(subjects: string[]): boolean {
    return subjects.every(id => validId(id)) && areAllValuesUnique(subjects);
  }
}
