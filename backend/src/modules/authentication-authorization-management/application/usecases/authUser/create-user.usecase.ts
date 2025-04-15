import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';

/**
 * Use case responsible for creating a new authenticated user.
 *
 * Checks for email uniqueness, hashes the password (if necessary),
 * and persists the user in the repository.
 */
export default class CreateAuthUser
  implements UseCaseInterface<CreateAuthUserInputDto, CreateAuthUserOutputDto>
{
  /** Repository for persisting and retrieving authenticated users */
  private readonly _authUserRepository: AuthUserGateway;

  /** Domain service containing business rules for the user entity */
  private readonly _authUserService: AuthUserService;

  /**
   * Constructs a new instance of the CreateAuthUser use case.
   *
   * @param authUserRepository - Gateway implementation for data persistence
   * @param authUserService - Domain service for user-related logic
   */
  constructor(
    authUserRepository: AuthUserGateway,
    authUserService: AuthUserService
  ) {
    this._authUserRepository = authUserRepository;
    this._authUserService = authUserService;
  }

  /**
   * Executes the creation of a new authenticated user.
   *
   * @param input - Input data including email, password, role, master ID, and whether the password is already hashed
   * @returns Output data of the created user
   * @throws Error if a user with the same email already exists
   * @throws ValidationError if any of the input data fails validation during entity creation
   */
  async execute({
    email,
    password,
    role,
    masterId,
    isHashed,
  }: CreateAuthUserInputDto): Promise<CreateAuthUserOutputDto> {
    const authUser = new AuthUser(
      {
        email,
        password,
        role,
        masterId,
        isHashed,
      },
      this._authUserService
    );

    const existingUser = await this._authUserRepository.find(authUser.email);
    if (existingUser) {
      throw new Error('AuthUser already exists');
    }

    await authUser.hashPassword();

    const result = await this._authUserRepository.create(authUser);

    return result;
  }
}
