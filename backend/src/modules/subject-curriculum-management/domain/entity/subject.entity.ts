import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  isNotEmpty,
  isString,
  maxLengthInclusive,
  minLength,
} from '../../../@shared/utils/validations';
import { States } from '@/modules/@shared/type/sharedTypes';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';

type SubjectProps = {
  id?: Id;
  name: string;
  description: string;
  state?: States;
};

export default class Subject {
  private _id;
  private _name;
  private _description;
  private _lifecycle: Lifecycle;

  constructor({ id, name, description, state }: SubjectProps) {
    if (name === undefined || description === undefined)
      throw new Error('Name and description are mandatory');
    if (!this.validateName(name)) throw new Error('Field name is not valid');
    if (!this.validateDescription(description))
      throw new Error('Field description is not valid');

    if (id) {
      if (!(id instanceof Id)) throw new Error('Invalid id');
      this._id = id;
    } else {
      this._id = new Id();
    }

    this._name = name;
    this._description = description;
    this._lifecycle = Lifecycle.from(state ?? StatesEnum.ACTIVE);
  }

  get id(): Id {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  set name(input: string) {
    if (!this.validateName(input)) throw new Error('Field name is not valid');
    this._name = input;
  }

  set description(input: string) {
    if (!this.validateDescription(input))
      throw new Error('Field description is not valid');
    this._description = input;
  }

  private validateName(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 255) &&
      minLength(input, 3)
    );
  }
  private validateDescription(input: string): boolean {
    return (
      isString(input) &&
      isNotEmpty(input) &&
      maxLengthInclusive(input, 500) &&
      minLength(input, 4)
    );
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
