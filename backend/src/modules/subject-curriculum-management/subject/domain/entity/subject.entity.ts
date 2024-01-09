import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { isNotEmpty, maxLengthInclusive, minLength } from '@/util/validations';

type SubjectProps = {
  id?: Id;
  name: string;
  description: string;
};

export default class Subject {
  private _id;
  private _name;
  private _description;

  constructor(input: SubjectProps) {
    this._id = input.id || new Id();
    if (!input.name || !input.description)
      throw new Error('Name and description are mandatory');
    if (!this.validateName(input.name))
      throw new Error('Field name is not valid');
    if (!this.validateDescription(input.description))
      throw new Error('Field description is not valid');
    this._name = input.name;
    this._description = input.description;
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
      isNotEmpty(input) && maxLengthInclusive(input, 500) && minLength(input, 4)
    );
  }
  private validateDescription(input: string): boolean {
    return (
      isNotEmpty(input) && maxLengthInclusive(input, 500) && minLength(input, 4)
    );
  }
}
