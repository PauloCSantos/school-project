import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';
import { States } from '@/modules/@shared/type/sharedTypes';
import {
  isNotEmpty,
  isString,
  maxLengthInclusive,
  minLength,
  validDate,
  validDay,
  validHour24h,
  validId,
} from '@/modules/@shared/utils/validations';

/**
 * Properties required to create an event
 */
type EventProps = {
  id?: Id;
  creator: string;
  name: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  type: string;
  place: string;
  state?: States;
};

/**
 * Entity representing an event in the calendar system
 *
 * Responsible for validating and managing event details
 */
export default class Event {
  private _id: Id;
  private _creator: string;
  private _name: string;
  private _date: Date;
  private _hour: Hour;
  private _day: DayOfWeek;
  private _type: string;
  private _place: string;
  private _lifecycle: Lifecycle;

  /**
   * Creates a new calendar event
   *
   * @param input - Event properties including creator, name, date, etc.
   * @throws Error if any required field is missing or invalid
   */
  constructor(input: EventProps) {
    this.validateConstructorParams(input);

    // Initialize with validated properties
    this._id = input.id || new Id();
    this._creator = input.creator;
    this._name = input.name;
    this._date = input.date;
    this._hour = input.hour;
    this._day = input.day;
    this._type = input.type;
    this._place = input.place;
    this._lifecycle = Lifecycle.from(input.state ?? StatesEnum.ACTIVE);
  }

  /**
   * Validates all parameters provided to the constructor
   */
  private validateConstructorParams(input: EventProps): void {
    // Check if required fields are present
    if (
      input.creator === undefined ||
      input.name === undefined ||
      input.date === undefined ||
      input.hour === undefined ||
      input.day === undefined ||
      input.type === undefined ||
      input.place === undefined
    ) {
      throw new Error('All event fields are mandatory');
    }

    // Validate id if provided
    if (input.id && !(input.id instanceof Id)) {
      throw new Error('Invalid id');
    }

    // Validate field values
    if (!validId(input.creator)) {
      throw new Error('Creator id is not valid');
    }

    if (!this.validateName(input.name)) {
      throw new Error('Field name is not valid');
    }

    if (!validDate(input.date)) {
      throw new Error('Field date is not valid');
    }

    if (!validHour24h(input.hour)) {
      throw new Error('Field hour is not valid');
    }

    if (!validDay(input.day)) {
      throw new Error('Field day is not valid');
    }

    if (!this.validateType(input.type)) {
      throw new Error('Field type is not valid');
    }

    if (!this.validatePlace(input.place)) {
      throw new Error('Field place is not valid');
    }
  }

  /**
   * Event's unique identifier
   */
  get id(): Id {
    return this._id;
  }

  /**
   * ID of the user who created this event
   */
  get creator(): string {
    return this._creator;
  }

  /**
   * Sets a new creator ID after validation
   */
  set creator(value: string) {
    if (!validId(value)) {
      throw new Error('Creator id is not valid');
    }
    this._creator = value;
  }

  /**
   * Event name
   */
  get name(): string {
    return this._name;
  }

  /**
   * Sets a new event name after validation
   */
  set name(value: string) {
    if (!this.validateName(value)) {
      throw new Error('Field name is not valid');
    }
    this._name = value;
  }

  /**
   * Event date
   */
  get date(): Date {
    return this._date;
  }

  /**
   * Sets a new event date after validation
   */
  set date(value: Date) {
    if (!validDate(value)) {
      throw new Error('Field date is not valid');
    }
    this._date = value;
  }

  /**
   * Event hour
   */
  get hour(): Hour {
    return this._hour;
  }

  /**
   * Sets a new event hour after validation
   */
  set hour(value: string) {
    if (!validHour24h(value)) {
      throw new Error('Field hour is not valid');
    }
    this._hour = value as Hour;
  }

  /**
   * Event day of week
   */
  get day(): DayOfWeek {
    return this._day;
  }

  /**
   * Sets a new event day after validation
   */
  set day(value: string) {
    if (!validDay(value)) {
      throw new Error('Field day is not valid');
    }
    this._day = value as DayOfWeek;
  }

  /**
   * Event type
   */
  get type(): string {
    return this._type;
  }

  /**
   * Sets a new event type after validation
   */
  set type(value: string) {
    if (!this.validateType(value)) {
      throw new Error('Field type is not valid');
    }
    this._type = value;
  }

  /**
   * Event location
   */
  get place(): string {
    return this._place;
  }

  /**
   * Sets a new event location after validation
   */
  set place(value: string) {
    if (!this.validatePlace(value)) {
      throw new Error('Field place is not valid');
    }
    this._place = value;
  }

  /**
   * Validates an event name string
   */
  private validateName(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 150) &&
      minLength(input, 3)
    );
  }

  /**
   * Validates an event type string
   */
  private validateType(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 150) &&
      minLength(input, 3)
    );
  }

  /**
   * Validates an event place string
   */
  private validatePlace(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 255) &&
      minLength(input, 3)
    );
  }

  get state(): States {
    return this._lifecycle.value;
  }
  get isActive(): boolean {
    return !this._lifecycle.equals(StatesEnum.INACTIVE);
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
