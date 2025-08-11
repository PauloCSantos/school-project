import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
} from '../../dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class CreateUserMaster
  implements
    UseCaseInterface<CreateUserMasterInputDto, CreateUserMasterOutputDto>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(
    userMasterRepository: UserMasterGateway,
    readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute(
    { id, name, address, email, birthday, cnpj }: CreateUserMasterInputDto,
    token?: TokenData
  ): Promise<CreateUserMasterOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.MASTER,
      FunctionCalledEnum.CREATE,
      token
    );

    if (!(await this.emailValidatorService.validate(email))) {
      throw new Error('You must register this email before creating the user.');
    }

    const userMaster = new UserMaster({
      id: new Id(id),
      name: new Name(name),
      address: new Address(address),
      email,
      birthday: new Date(birthday),
      cnpj,
    });

    const userVerification = await this._userMasterRepository.findByEmail(
      userMaster.email
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userMasterRepository.create(userMaster);

    return { id: result };
  }
}
