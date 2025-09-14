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
import { ConflictError } from '@/modules/@shared/application/errors/conflict.error';

export default class CreateUserMaster
  implements UseCaseInterface<CreateUserMasterInputDto, CreateUserMasterOutputDto>
{
  constructor(
    private readonly userMasterRepository: UserMasterGateway,
    private readonly emailValidatorService: EmailAuthValidator,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {}
  async execute(
    input: CreateUserMasterInputDto,
    token: TokenData
  ): Promise<CreateUserMasterOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.MASTER,
      FunctionCalledEnum.CREATE,
      token
    );

    const { email, cnpj, creationMode } = input;
    let baseUser;

    if (!(await this.emailValidatorService.validate(email))) {
      throw new ConflictError('You must register this email before creating the user.');
    }

    if (creationMode === 'partial') {
      baseUser = await this.userService.getOrCreateUser(email, 'partial');
    } else {
      const { name, address, birthday } = input;
      baseUser = await this.userService.getOrCreateUser(email, 'full', {
        email,
        name: new Name(name),
        address: new Address(address),
        birthday: new Date(birthday),
      });
    }

    const userMaster = new UserMaster({
      userId: baseUser.id.value,
      cnpj,
    });

    const userVerification = await this.userMasterRepository.findByBaseUserId(
      token.masterId,
      baseUser.id.value
    );
    if (userVerification) throw new ConflictError('User already exists');

    const result = await this.userMasterRepository.create(token.masterId, userMaster);

    return { id: result };
  }
}
