import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';

/**
 * Use case responsible for finding an authenticated user by email.
 *
 * Retrieves user information from the repository and maps it to the appropriate output format.
 */
export default class FindAuthUser
  implements
    UseCaseInterface<FindAuthUserInputDto, FindAuthUserOutputDto | null>
{
  private readonly _authUserRepository: AuthUserGateway;

  /**
   * Constructs a new instance of the FindAuthUser use case.
   *
   * @param authUserRepository - Gateway implementation for data persistence
   */
  constructor(authUserRepository: AuthUserGateway) {
    this._authUserRepository = authUserRepository;
  }

  /**
   * Executes the search for an authenticated user by email.
   *
   * @param input - Input data containing the email to search for
   * @returns User data if found, undefined otherwise
   */
  async execute(
    { email }: FindAuthUserInputDto,
    policiesService: PoliciesServiceInterface,
    token: TokenData
  ): Promise<FindAuthUserOutputDto | null> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.AUTHUSER,
        FunctionCalledEnum.FIND,
        token,
        { targetEmail: email }
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const response = await this._authUserRepository.find(email);

    if (response) {
      return {
        email: response.email,
        masterId: response.masterId,
        role: response.role,
        isHashed: true,
      };
    }

    return null;
  }
}
