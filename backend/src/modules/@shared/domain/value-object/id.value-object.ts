import { validId } from '../../utils/validations';

export default class Id {
  private _id: string;

  constructor(id?: string) {
    if (id) {
      if (typeof id !== 'string') throw new Error('Invalid id');
      this.validate(id);
      this._id = id;
    } else {
      this._id = crypto.randomUUID();
    }
  }

  get id(): string {
    return this._id;
  }

  private validate(id: string): void {
    if (!validId(id)) {
      throw new Error('Invalid id');
    }
  }
}
