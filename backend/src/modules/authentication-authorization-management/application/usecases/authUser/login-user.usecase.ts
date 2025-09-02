import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import TokenServiceInterface from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import {
  LoginAuthUserInputDto,
  LoginAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error';

/**
 * Use case responsible for user authentication.
 *
 * Verifies user credentials, validates password, and generates an authentication token.
 */
export default class LoginAuthUser
  implements UseCaseInterface<LoginAuthUserInputDto, LoginAuthUserOutputDto>
{
  /**
   * Constructs a new instance of the LoginAuthUser use case.
   *
   * @param authUserRepository - Gateway implementation for data persistence
   * @param authUserService - Domain service for user-related logic
   * @param tokenService - Service for token generation and validation
   */
  constructor(
    private readonly authUserRepository: AuthUserGateway,
    private readonly authUserService: AuthUserServiceInterface,
    private readonly tokenService: TokenServiceInterface,
    private readonly tenantService: TenantServiceInterface
  ) {}

  /**
   * Executes the user authentication process.
   *
   * @param input - Input data containing email, password and role
   * @returns Output data with the generated authentication token
   * @throws Error if user doesn't exist or credentials are invalid
   */
  async execute({
    email,
    password,
    masterId,
    role,
  }: LoginAuthUserInputDto): Promise<LoginAuthUserOutputDto> {
    const authUserVerification = await this.authUserRepository.find(email);

    if (!authUserVerification) {
      throw new InvalidCredentialsError();
    }

    const authUser = new AuthUser(
      {
        email: authUserVerification.email,
        password: authUserVerification.password,
        isHashed: authUserVerification.isHashed,
      },
      this.authUserService
    );

    if (!(await authUser.comparePassword(password))) {
      throw new InvalidCredentialsError();
    }

    if (masterId && role) {
      await this.tenantService.verifyTenantRole(masterId, authUser.email, role);
      const token = await this.tokenService.generateToken(authUser, masterId, role);
      return { token };
    }

    const data = await this.tenantService.getAvailableTenantsAndRoles(authUser.email);

    return { data };
  }
}
