import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { AuthUserNotFoundError } from '../../errors/auth-user-not-found.error';

/**
 * Use case responsible for deleting an authenticated user.
 *
 * Verifies user existence before proceeding with deletion.
 */
export default class DeleteAuthUser
  implements UseCaseInterface<DeleteAuthUserInputDto, DeleteAuthUserOutputDto>
{
  /** Repository for persisting and retrieving authenticated users */
  private readonly _authUserRepository: AuthUserGateway;

  /**
   * Constructs a new instance of the DeleteAuthUser use case.
   *
   * @param authUserRepository - Gateway implementation for data persistence
   */
  constructor(
    authUserRepository: AuthUserGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._authUserRepository = authUserRepository;
  }

  /**
   * Executes the deletion of an authenticated user.
   *
   * @param input - Input data containing the email of the user to delete
   * @returns Output data with the result message
   * @throws Error if the user with the specified email does not exist
   */
  async execute(
    { email }: DeleteAuthUserInputDto,
    token: TokenData
  ): Promise<DeleteAuthUserOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.DELETE,
      token
    );

    const authUser = await this._authUserRepository.find(email);
    if (!authUser) {
      throw new AuthUserNotFoundError(email);
    }
    authUser.deactivate();
    const result = await this._authUserRepository.delete(authUser);

    return { message: result };
  }
}
