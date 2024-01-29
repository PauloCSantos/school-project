import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  isNotEmpty,
  maxLengthInclusive,
  minLength,
  validDay,
  validHour24h,
  validId,
} from '@/util/validations';

type EventProps = {
  id?: Id;
  creator: string;
  name: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  type: string;
  place: string;
};

export default class Event {
  private _id;
  private _creator;
  private _name;
  private _date;
  private _hour;
  private _day;
  private _type;
  private _place;

  constructor(input: EventProps) {
    if (
      !input.creator ||
      !input.name ||
      !input.date ||
      !input.hour ||
      !input.day ||
      !input.type ||
      !input.place
    )
      throw new Error('All event fields are mandatory');
    if (!validId(input.creator)) throw new Error('Creator id is not valid');
    if (!this.validateName(input.name))
      throw new Error('Field name is not valid');
    if (!this.validateDate(input.date))
      throw new Error('Field date is not valid');
    if (!validHour24h(input.hour)) throw new Error('Field hour is not valid');
    if (!validDay(input.day)) throw new Error('Field day is not valid');
    if (!this.validateType(input.type))
      throw new Error('Field type is not valid');
    if (!this.validatePlace(input.place))
      throw new Error('Field place is not valid');
    this._id = input.id || new Id();
    this._creator = input.creator;
    this._name = input.name;
    this._date = input.date;
    this._hour = input.hour;
    this._day = input.day;
    this._type = input.type;
    this._place = input.place;
  }

  get id(): Id {
    return this._id;
  }
  get creator(): string {
    return this._creator;
  }
  get name(): string {
    return this._name;
  }
  get date(): Date {
    return this._date;
  }
  get hour(): Hour {
    return this._hour;
  }
  get day(): DayOfWeek {
    return this._day;
  }
  get type(): string {
    return this._type;
  }
  get place(): string {
    return this._place;
  }

  set creator(value: string) {
    this._creator = value;
  }
  set name(value: string) {
    if (!this.validateName(value)) throw new Error('Field name is not valid');
    this._name = value;
  }
  set date(value: Date) {
    if (!this.validateDate(value)) throw new Error('Field date is not valid');
    this._date = value;
  }
  set hour(value: string) {
    if (!validHour24h(value)) throw new Error('Field hour is not valid');
    this._hour = value as Hour;
  }
  set day(value: string) {
    if (!validDay(value)) throw new Error('Field day is not valid');
    this._day = value as DayOfWeek;
  }
  set type(value: string) {
    if (!this.validateType(value)) throw new Error('Field type is not valid');
    this._type = value;
  }
  set place(value: string) {
    if (!this.validatePlace(value)) throw new Error('Field place is not valid');
    this._place = value;
  }

  private validateName(input: string): boolean {
    return (
      isNotEmpty(input) && maxLengthInclusive(input, 150) && minLength(input, 3)
    );
  }
  private validateType(input: string): boolean {
    return (
      isNotEmpty(input) && maxLengthInclusive(input, 150) && minLength(input, 3)
    );
  }
  private validatePlace(input: string): boolean {
    return (
      isNotEmpty(input) && maxLengthInclusive(input, 255) && minLength(input, 3)
    );
  }
  private validateDate(input: Date): boolean {
    if (!(input instanceof Date)) {
      return false;
    }
    return true;
  }
}
