import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';

/**
 * Use case responsible for updating an authenticated user.
 *
 * Verifies user existence, applies updates, and persists changes.
 */
export default class UpdateAuthUser
  implements UseCaseInterface<UpdateAuthUserInputDto, UpdateAuthUserOutputDto>
{
  private readonly _authUserRepository: AuthUserGateway;
  private readonly _authUserService: AuthUserServiceInterface;

  /**
   * Constructs a new instance of the UpdateAuthUser use case.
   *
   * @param authUserRepository - Gateway implementation for data persistence
   * @param authUserService - Domain service for user-related logic
   */
  constructor(
    authUserRepository: AuthUserGateway,
    authUserService: AuthUserServiceInterface
  ) {
    this._authUserRepository = authUserRepository;
    this._authUserService = authUserService;
  }

  /**
   * Executes the update of an authenticated user.
   *
   * @param input - Input data containing the user email and fields to update
   * @returns Output data of the updated user
   * @throws Error if the user with the specified email does not exist
   * @throws ValidationError if any of the updated data fails validation
   */
  async execute(
    { email, authUserDataToUpdate }: UpdateAuthUserInputDto,
    policiesService: PoliciesServiceInterface,
    token: TokenData
  ): Promise<UpdateAuthUserOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.AUTHUSER,
        FunctionCalledEnum.UPDATE,
        token,
        { targetEmail: email }
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const existingUser = await this._authUserRepository.find(email);
    if (!existingUser) {
      throw new Error('AuthUser not found');
    }

    const authUser = new AuthUser(
      {
        email: existingUser.email,
        password: existingUser.password,
        role: existingUser.role,
        masterId: existingUser.masterId,
        isHashed: existingUser.isHashed,
      },
      this._authUserService
    );

    if (authUserDataToUpdate.email !== undefined) {
      authUser.email = authUserDataToUpdate.email;
    }

    if (authUserDataToUpdate.role !== undefined) {
      authUser.role = authUserDataToUpdate.role;
    }

    if (authUserDataToUpdate.password !== undefined) {
      authUser.password = authUserDataToUpdate.password;
      await authUser.hashPassword();
    }

    const result = await this._authUserRepository.update(authUser, email);

    return {
      email: result.email,
      role: result.role,
    };
  }
}
