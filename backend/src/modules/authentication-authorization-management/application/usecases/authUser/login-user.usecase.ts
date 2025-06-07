import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import TokenService from '@/modules/@shared/infraestructure/service/token.service';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  LoginAuthUserInputDto,
  LoginAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';

/**
 * Use case responsible for user authentication.
 *
 * Verifies user credentials, validates password, and generates an authentication token.
 */
export default class LoginAuthUser
  implements UseCaseInterface<LoginAuthUserInputDto, LoginAuthUserOutputDto>
{
  /** Repository for retrieving authenticated users */
  private readonly _authUserRepository: AuthUserGateway;

  /** Domain service containing business rules for the user entity */
  private readonly _authUserService: AuthUserService;

  /** Service responsible for token generation and validation */
  private readonly _tokenService: TokenService;

  /**
   * Constructs a new instance of the LoginAuthUser use case.
   *
   * @param authUserRepository - Gateway implementation for data persistence
   * @param authUserService - Domain service for user-related logic
   * @param tokenService - Service for token generation and validation
   */
  constructor(
    authUserRepository: AuthUserGateway,
    authUserService: AuthUserService,
    tokenService: TokenService
  ) {
    this._authUserRepository = authUserRepository;
    this._authUserService = authUserService;
    this._tokenService = tokenService;
  }

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
    role,
  }: LoginAuthUserInputDto): Promise<LoginAuthUserOutputDto> {
    const authUserVerification = await this._authUserRepository.find(email);

    if (!authUserVerification) {
      throw new Error(
        'Invalid credentials. Please check your email and password and try again'
      );
    }

    const authUser = new AuthUser(
      {
        email: authUserVerification.email,
        password: authUserVerification.password,
        role: authUserVerification.role,
        masterId: authUserVerification.masterId,
        isHashed: authUserVerification.isHashed,
      },
      this._authUserService
    );

    const isValid = await authUser.comparePassword(password);

    if (!isValid) {
      throw new Error(
        'Invalid credentials. Please check your email and password and try again'
      );
    }

    const token = await this._tokenService.generateToken(authUser);

    return { token };
  }
}
