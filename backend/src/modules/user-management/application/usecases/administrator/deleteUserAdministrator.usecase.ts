import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserAdministratorInputDto,
  DeleteUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '@/modules/user-management/application/gateway/administrator.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';

export default class DeleteUserAdministrator
  implements
    UseCaseInterface<DeleteUserAdministratorInputDto, DeleteUserAdministratorOutputDto>
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(
    userAdministratorRepository: UserAdministratorGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute(
    { id }: DeleteUserAdministratorInputDto,
    token: TokenData
  ): Promise<DeleteUserAdministratorOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.ADMINISTRATOR,
      FunctionCalledEnum.DELETE,
      token
    );

    const userVerification = await this._userAdministratorRepository.find(
      token.masterId,
      id
    );
    if (!userVerification) throw new Error('User not found');

    const result = await this._userAdministratorRepository.delete(token.masterId, id);

    return { message: result };
  }
}
