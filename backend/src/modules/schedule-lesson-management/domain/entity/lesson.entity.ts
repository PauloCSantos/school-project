import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  areAllValuesUnique,
  isGreaterZero,
  isNotEmpty,
  isNumeric,
  isString,
  maxLengthInclusive,
  minLength,
  validDay,
  validHour24h,
  validId,
} from '@/modules/@shared/utils/validations';

/**
 * Properties required to create a lesson
 */
export type LessonProps = {
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

/**
 * Entity representing a lesson in the system
 *
 * Responsible for validating and managing lesson information
 */
export default class Lesson {
  private _id: Id;
  private _name: string;
  private _duration: number;
  private _teacher: string;
  private _studentsList: string[];
  private _subject: string;
  private _days: DayOfWeek[];
  private _times: Hour[];
  private _semester: 1 | 2;

  /**
   * Creates a new lesson
   *
   * @param input - Lesson properties including name, duration, teacher, students, subject, days, times, and semester
   * @throws Error if any required field is missing or invalid
   */
  constructor(input: LessonProps) {
    this.validateConstructorParams(input);

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

  /**
   * Validates all parameters provided to the constructor
   */
  private validateConstructorParams(input: LessonProps): void {
    // Check if required fields are present
    if (
      input.name === undefined ||
      input.duration === undefined ||
      input.teacher === undefined ||
      input.studentsList === undefined ||
      input.subject === undefined ||
      input.days === undefined ||
      input.times === undefined ||
      input.semester === undefined
    ) {
      throw new Error('All lesson fields are mandatory');
    }

    // Validate field values
    if (!this.validateName(input.name)) {
      throw new Error('Field name is not valid');
    }

    if (!this.validateNumbers(input.duration)) {
      throw new Error('Field duration is not valid');
    }

    if (!validId(input.teacher)) {
      throw new Error('Teacher id is not valid');
    }

    if (!this.validateStudents(input.studentsList)) {
      throw new Error('Subject IDs do not match pattern');
    }

    if (!validId(input.subject)) {
      throw new Error('Subject id is not valid');
    }

    if (
      !input.days.every(day => validDay(day)) ||
      !areAllValuesUnique(input.days)
    ) {
      throw new Error('Days are not up to standard');
    }

    if (
      !input.times.every(time => validHour24h(time)) ||
      !areAllValuesUnique(input.times)
    ) {
      throw new Error('Times are not up to standard');
    }

    if (input.semester !== 1 && input.semester !== 2) {
      throw new Error('Field semester is not valid');
    }

    // Validate id if provided
    if (input.id && !(input.id instanceof Id)) {
      throw new Error('Invalid id');
    }
  }

  /**
   * Lesson's unique identifier
   */
  get id(): Id {
    return this._id;
  }

  /**
   * Lesson's name
   */
  get name(): string {
    return this._name;
  }

  /**
   * Sets a new name after validation
   */
  set name(input: string) {
    if (!this.validateName(input)) {
      throw new Error('Field name is not valid');
    }
    this._name = input;
  }

  /**
   * Lesson's duration
   */
  get duration(): number {
    return this._duration;
  }

  /**
   * Sets a new duration after validation
   */
  set duration(input: number) {
    if (!this.validateNumbers(input)) {
      throw new Error('Field duration is not valid');
    }
    this._duration = input;
  }

  /**
   * Lesson's teacher ID
   */
  get teacher(): string {
    return this._teacher;
  }

  /**
   * Sets a new teacher ID after validation
   */
  set teacher(input: string) {
    if (!validId(input)) {
      throw new Error('Teacher id is not valid');
    }
    this._teacher = input;
  }

  /**
   * List of student IDs enrolled in the lesson
   */
  get studentsList(): string[] {
    return this._studentsList;
  }

  /**
   * Lesson's subject ID
   */
  get subject(): string {
    return this._subject;
  }

  /**
   * Sets a new subject ID after validation
   */
  set subject(input: string) {
    if (!validId(input)) {
      throw new Error('Subject id is not valid');
    }
    this._subject = input;
  }

  /**
   * Days when the lesson occurs
   */
  get days(): DayOfWeek[] {
    return this._days;
  }

  /**
   * Times when the lesson occurs
   */
  get times(): Hour[] {
    return this._times;
  }

  /**
   * Semester when the lesson is offered
   */
  get semester(): 1 | 2 {
    return this._semester;
  }

  /**
   * Sets a new semester after validation
   */
  set semester(input: 1 | 2) {
    if (input !== 1 && input !== 2) {
      throw new Error('Field semester is not valid');
    }
    this._semester = input;
  }

  /**
   * Adds a student to the lesson
   *
   * @param input - Student ID to add
   * @throws Error if the student ID is invalid or already in the list
   */
  addStudent(input: string): void {
    if (!validId(input)) {
      throw new Error('Student id is not valid');
    }

    const index = this.findIndex(input);
    if (index === -1) {
      this._studentsList.push(input);
    } else {
      throw new Error('This student is already on the lesson');
    }
  }

  /**
   * Removes a student from the lesson
   *
   * @param input - Student ID to remove
   * @throws Error if the student ID is invalid or not found in the list
   */
  removeStudent(input: string): void {
    if (!validId(input)) {
      throw new Error('Student id is not valid');
    }

    const index = this.findIndex(input);
    if (index !== -1) {
      this._studentsList.splice(index, 1);
    } else {
      throw new Error('This student is not included in the lesson');
    }
  }

  /**
   * Adds a day to the lesson schedule
   *
   * @param day - Day to add
   * @throws Error if the day is invalid or already in the list
   */
  addDay(day: DayOfWeek): void {
    if (!validDay(day)) {
      throw new Error(`${day} is not valid`);
    }

    if (!this._days.includes(day)) {
      this._days.push(day);
    } else {
      throw new Error(`Day ${day} is already added to the lesson`);
    }
  }

  /**
   * Removes a day from the lesson schedule
   *
   * @param day - Day to remove
   * @throws Error if the day is invalid or not found in the list
   */
  removeDay(day: DayOfWeek): void {
    if (!validDay(day)) {
      throw new Error(`${day} is not valid`);
    }

    const index = this._days.indexOf(day);
    if (index !== -1) {
      this._days.splice(index, 1);
    } else {
      throw new Error(`Day ${day} is not included in the lesson`);
    }
  }

  /**
   * Adds a time to the lesson schedule
   *
   * @param time - Time to add
   * @throws Error if the time is invalid or already in the list
   */
  addTime(time: Hour): void {
    if (!validHour24h(time)) {
      throw new Error(`${time} is not a valid 24-hour format time`);
    }

    if (!this._times.includes(time)) {
      this._times.push(time);
    } else {
      throw new Error(`Time ${time} is already added to the lesson`);
    }
  }

  /**
   * Removes a time from the lesson schedule
   *
   * @param time - Time to remove
   * @throws Error if the time is invalid or not found in the list
   */
  removeTime(time: Hour): void {
    if (!validHour24h(time)) {
      throw new Error(`${time} is not a valid 24-hour format time`);
    }

    const index = this._times.indexOf(time);
    if (index !== -1) {
      this._times.splice(index, 1);
    } else {
      throw new Error(`Time ${time} is not included in the lesson`);
    }
  }

  /**
   * Finds the index of a value in the students list
   */
  private findIndex(value: string): number {
    return this._studentsList.indexOf(value);
  }

  /**
   * Validates a name string
   */
  private validateName(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 255) &&
      minLength(input, 4)
    );
  }

  /**
   * Validates a numeric value
   */
  private validateNumbers(input: number): boolean {
    return isNumeric(input) && isGreaterZero(input);
  }

  /**
   * Validates a list of student IDs
   */
  private validateStudents(students: string[]): boolean {
    return students.every(id => validId(id)) && areAllValuesUnique(students);
  }
}
