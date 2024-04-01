import { isString, validCNPJ } from '@/util/validations';
import UserBase, {
  UserBaseProps,
} from '../../@shared/domain/entity/user-base.entity';

type MasterUserProps = UserBaseProps & {
  cnpj: string;
};

export default class UserMaster extends UserBase {
  private _cnpj;
  constructor(input: MasterUserProps) {
    if (input.id === undefined) throw new Error('Master user needs id');
    super(input);
    if (input.cnpj === undefined) throw new Error('Field CNPJ is mandatory');
    if (this.validateCnpj(input.cnpj))
      throw new Error('Field CNPJ is not valid');
    this._cnpj = input.cnpj;
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
