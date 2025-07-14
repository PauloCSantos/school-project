import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserAdministratorInputDto,
  DeleteUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '@/modules/user-management/infrastructure/gateway/administrator.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class DeleteUserAdministrator
  implements
    UseCaseInterface<
      DeleteUserAdministratorInputDto,
      DeleteUserAdministratorOutputDto
    >
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(userAdministratorRepository: UserAdministratorGateway) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute(
    { id }: DeleteUserAdministratorInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteUserAdministratorOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.ADMINISTRATOR,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const userVerification = await this._userAdministratorRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userAdministratorRepository.delete(id);

    return { message: result };
  }
}
