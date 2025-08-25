import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { isString, validCNPJ, validId } from '@/modules/@shared/utils/validations';

type MasterUserProps = {
  id?: string;
  userId: string;
  cnpj: string;
};

export default class UserMaster {
  private _id;
  private _userId;
  private _cnpj;
  constructor({ id, userId, cnpj }: MasterUserProps) {
    if (userId === undefined) throw new Error('Master user needs id');
    if (cnpj === undefined) throw new Error('Field CNPJ is mandatory');
    if (this.validateCnpj(cnpj)) throw new Error('Field CNPJ is not valid');
    if (!validId(userId)) throw new Error('Invalid id');
    if (id) {
      if (!validId(id)) throw new Error('Invalid id');
      this._id = new Id(id);
    } else {
      this._id = new Id();
    }
    this._userId = userId;
    this._cnpj = cnpj;
  }

  get id(): Id {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get cnpj(): string {
    return this._cnpj;
  }

  set cnpj(input: string) {
    if (this.validateCnpj(input)) throw new Error('Field CNPJ is not valid');
    this._cnpj = input;
  }

  private validateCnpj(input: string): boolean {
    return !isString(input) || !validCNPJ(input);
  }
}
