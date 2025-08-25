import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
} from '../../../application/dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import { EmailAuthValidator } from '../../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';

export default class CreateUserMaster
  implements UseCaseInterface<CreateUserMasterInputDto, CreateUserMasterOutputDto>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(
    userMasterRepository: UserMasterGateway,
    readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute(
    { name, address, email, birthday, cnpj }: CreateUserMasterInputDto,
    token: TokenData
  ): Promise<CreateUserMasterOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.MASTER,
      FunctionCalledEnum.CREATE,
      token
    );

    if (!(await this.emailValidatorService.validate(email))) {
      throw new Error('You must register this email before creating the user.');
    }

    const baseUser = await this.userService.getOrCreateUser(token.email, {
      email: token.email,
      name: new Name(name),
      address: new Address(address),
      birthday,
    });

    const userMaster = new UserMaster({
      userId: baseUser.id.value,
      cnpj,
    });

    const userVerification = await this._userMasterRepository.findByBaseUserId(
      token.masterId,
      baseUser.id.value
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userMasterRepository.create(token.masterId, userMaster);

    return { id: result };
  }
}
