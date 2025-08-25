import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
} from '../../../application/dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { MasterAssembler } from '../../assemblers/master.assembler';

export default class FindUserMaster
  implements UseCaseInterface<FindUserMasterInputDto, FindUserMasterOutputDto | null>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(
    userMasterRepository: UserMasterGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute(
    { id }: FindUserMasterInputDto,
    token: TokenData
  ): Promise<FindUserMasterOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.MASTER,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userMasterRepository.find(token.masterId, id);
    if (response) {
      const baseUser = await this.userService.findBaseUser(response.userId);
      return MasterAssembler.toObj(baseUser!, response);
    }
    return null;
  }
}
