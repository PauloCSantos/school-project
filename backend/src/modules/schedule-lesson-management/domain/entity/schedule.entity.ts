import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';
import { States } from '@/modules/@shared/type/sharedTypes';
import { areAllValuesUnique, validId } from '@/modules/@shared/utils/validations';

/**
 * Properties required to create a schedule
 */
export type ScheduleProps = {
  id?: Id;
  student: string;
  curriculum: string;
  lessonsList: string[];
  state?: States;
};

/**
 * Entity representing a student's schedule in the system
 *
 * Responsible for validating and managing schedule information
 */
export default class Schedule {
  private _id: Id;
  private _student: string;
  private _curriculum: string;
  private _lessonsList: string[];
  private _lifecycle: Lifecycle;

  /**
   * Creates a new schedule
   *
   * @param input - Schedule properties including student, curriculum, and lessons list
   * @throws Error if any required field is missing or invalid
   */
  constructor(input: ScheduleProps) {
    this.validateConstructorParams(input);

    this._id = input.id || new Id();
    this._student = input.student;
    this._curriculum = input.curriculum;
    this._lessonsList = input.lessonsList;
    this._lifecycle = Lifecycle.from(input.state ?? StatesEnum.ACTIVE);
  }

  /**
   * Validates all parameters provided to the constructor
   */
  private validateConstructorParams(input: ScheduleProps): void {
    // Check if required fields are present
    if (
      input.curriculum === undefined ||
      input.lessonsList === undefined ||
      input.student === undefined
    ) {
      throw new Error('All schedule fields are mandatory');
    }

    // Validate field values
    if (!validId(input.student)) {
      throw new Error('Student id is not valid');
    }

    if (!validId(input.curriculum)) {
      throw new Error('Curriculum id is not valid');
    }

    if (!this.validateLessonsList(input.lessonsList)) {
      throw new Error('Lessons list have an invalid id');
    }

    // Validate id if provided
    if (input.id && !(input.id instanceof Id)) {
      throw new Error('Invalid id');
    }
  }

  /**
   * Schedule's unique identifier
   */
  get id(): Id {
    return this._id;
  }

  /**
   * Student ID associated with this schedule
   */
  get student(): string {
    return this._student;
  }

  /**
   * Curriculum ID associated with this schedule
   */
  get curriculum(): string {
    return this._curriculum;
  }

  /**
   * Sets a new curriculum ID after validation
   */
  set curriculum(input: string) {
    if (!validId(input)) {
      throw new Error('Curriculum id is not valid');
    }
    this._curriculum = input;
  }

  /**
   * List of lesson IDs in this schedule
   */
  get lessonsList(): string[] {
    return this._lessonsList;
  }

  /**
   * Adds a lesson to the schedule
   *
   * @param input - Lesson ID to add
   * @throws Error if the lesson ID is invalid or already in the list
   */
  addLesson(input: string): void {
    if (!validId(input)) {
      throw new Error('Lesson id is not valid');
    }

    const index = this.findIndex(input);
    if (index === -1) {
      this._lessonsList.push(input);
    } else {
      throw new Error('This lesson is already on the schedule');
    }
  }

  /**
   * Removes a lesson from the schedule
   *
   * @param input - Lesson ID to remove
   * @throws Error if the lesson ID is invalid or not found in the list
   */
  removeLesson(input: string): void {
    if (!validId(input)) {
      throw new Error('Lesson id is not valid');
    }

    const index = this.findIndex(input);
    if (index !== -1) {
      this._lessonsList.splice(index, 1);
    } else {
      throw new Error('This lesson is not included in the schedule');
    }
  }

  /**
   * Finds the index of a value in the lessons list
   */
  private findIndex(value: string): number {
    return this._lessonsList.indexOf(value);
  }

  /**
   * Validates a list of lesson IDs
   */
  private validateLessonsList(lessons: string[]): boolean {
    return lessons.every(id => validId(id)) && areAllValuesUnique(lessons);
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
