import { validCNPJ } from '@/util/validations';
import UserBase, {
  UserBaseProps,
} from '../../../@shared/domain/entity/user-base.entity';

type MasterUserProps = UserBaseProps & {
  cnpj: string;
};

export default class UserMaster extends UserBase {
  private _cnpj;
  constructor(input: MasterUserProps) {
    super(input);
    if (!input.cnpj) throw new Error('Field CNPJ is mandatory');
    if (!validCNPJ(input.cnpj)) throw new Error('Field CNPJ is not valid');
    this._cnpj = input.cnpj;
  }

  get cnpj(): string {
    return this._cnpj;
  }

  set cnpj(input: string) {
    if (!validCNPJ(input)) throw new Error('Field CNPJ is not valid');
    this._cnpj = input;
  }
}
