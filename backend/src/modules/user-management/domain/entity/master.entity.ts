import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lifecycle from '@/modules/@shared/domain/value-object/state.value-object';
import { StatesEnum } from '@/modules/@shared/enums/enums';
import { States } from '@/modules/@shared/type/sharedTypes';
import { isString, validCNPJ, validId } from '@/modules/@shared/utils/validations';

type MasterUserProps = {
  id?: string;
  userId: string;
  cnpj: string;
  state?: States;
};

export default class UserMaster {
  private _id;
  private _userId;
  private _cnpj;
  private _lifecycle: Lifecycle;

  constructor({ id, userId, cnpj, state }: MasterUserProps) {
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
    this._lifecycle = Lifecycle.from(state ?? StatesEnum.ACTIVE);
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
