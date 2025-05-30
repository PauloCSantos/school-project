import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  areAllValuesUnique,
  validDate,
  validDay,
  validHour24h,
  validId,
} from '@/modules/@shared/utils/validations';

/**
 * Properties required to create an attendance record
 */
export type AttendanceProps = {
  id?: Id;
  lesson: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  studentsPresent: string[];
};

/**
 * Entity representing an attendance record in the system
 *
 * Responsible for tracking which students are present in a specific lesson
 */
export default class Attendance {
  private _id: Id;
  private _lesson: string;
  private _date: Date;
  private _hour: Hour;
  private _day: DayOfWeek;
  private _studentsPresent: string[];

  /**
   * Creates a new attendance record
   *
   * @param input - Attendance properties including lesson, date, hour, day, and students present
   * @throws Error if any required field is missing or invalid
   */
  constructor(input: AttendanceProps) {
    this.validateConstructorParams(input);

    this._id = input.id || new Id();
    this._lesson = input.lesson;
    this._date = input.date;
    this._hour = input.hour;
    this._day = input.day;
    this._studentsPresent = input.studentsPresent;
  }

  /**
   * Validates all parameters provided to the constructor
   */
  private validateConstructorParams(input: AttendanceProps): void {
    if (
      input.lesson === undefined ||
      input.date === undefined ||
      input.hour === undefined ||
      input.day === undefined ||
      input.studentsPresent === undefined
    ) {
      throw new Error('All attendance fields are mandatory');
    }

    if (input.id && !(input.id instanceof Id)) {
      throw new Error('Invalid id');
    }

    if (!validId(input.lesson)) {
      throw new Error('Lesson id is not valid');
    }

    if (!validDate(input.date)) {
      throw new Error('Date is not up to standard');
    }

    if (!validHour24h(input.hour)) {
      throw new Error('Hour is not up to standard');
    }

    if (!validDay(input.day)) {
      throw new Error('Day is not up to standard');
    }

    if (!this.validateStudentsList(input.studentsPresent)) {
      throw new Error('All student IDs do not follow standards');
    }
  }

  /**
   * Unique identifier for this attendance record
   */
  get id(): Id {
    return this._id;
  }

  /**
   * ID of the lesson this attendance record is for
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
   * Date when this attendance was recorded
   */
  get date(): Date {
    return this._date;
  }

  /**
   * Sets a new date after validation
   */
  set date(value: Date) {
    if (!validDate(value)) {
      throw new Error('Date is not up to standard');
    }
    this._date = value;
  }

  /**
   * Hour of the day when this attendance was recorded
   */
  get hour(): Hour {
    return this._hour;
  }

  /**
   * Sets a new hour after validation
   */
  set hour(value: Hour) {
    if (!validHour24h(value)) {
      throw new Error('Hour is not up to standard');
    }
    this._hour = value;
  }

  /**
   * Day of the week when this attendance was recorded
   */
  get day(): DayOfWeek {
    return this._day;
  }

  /**
   * Sets a new day after validation
   */
  set day(value: DayOfWeek) {
    if (!validDay(value)) {
      throw new Error('Day is not up to standard');
    }
    this._day = value;
  }

  /**
   * List of student IDs who were present
   */
  get studentsPresent(): string[] {
    return this._studentsPresent;
  }

  /**
   * Adds a student to the attendance record
   *
   * @param input - ID of the student to be added
   * @throws Error if the student ID is invalid or already in the attendance
   */
  addStudent(input: string): void {
    if (!validId(input)) {
      throw new Error('Student id is not valid');
    }

    if (this.findIndex(input) === -1) {
      this._studentsPresent.push(input);
    } else {
      throw new Error('This student is already on the attendance');
    }
  }

  /**
   * Removes a student from the attendance record
   *
   * @param input - ID of the student to be removed
   * @throws Error if the student ID is invalid or not in the attendance
   */
  removeStudent(input: string): void {
    if (!validId(input)) {
      throw new Error('Student id is not valid');
    }

    const index = this.findIndex(input);
    if (index !== -1) {
      this._studentsPresent.splice(index, 1);
    } else {
      throw new Error('This student is not included in the attendance');
    }
  }

  /**
   * Validates the list of student IDs
   *
   * @param students - List of student IDs to validate
   * @returns True if all IDs are valid and unique, false otherwise
   */
  private validateStudentsList(students: string[]): boolean {
    return students.every(id => validId(id)) && areAllValuesUnique(students);
  }

  /**
   * Finds the index of a student ID in the students present list
   *
   * @param value - Student ID to find
   * @returns Index of the student ID or -1 if not found
   */
  private findIndex(value: string): number {
    return this._studentsPresent.indexOf(value);
  }
}
