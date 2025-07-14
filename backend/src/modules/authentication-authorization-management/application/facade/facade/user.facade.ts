import CreateAuthUser from '../../usecases/authUser/create-user.usecase';
import DeleteAuthUser from '../../usecases/authUser/delete-user.usecase';
import FindAuthUser from '../../usecases/authUser/find-user.usecase';
import UpdateAuthUser from '../../usecases/authUser/update-user.usecase';
import LoginAuthUser from '../../usecases/authUser/login-user.usecase';
import AuthUserFacadeInterface from '../interface/user-facade.interface';
import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
  LoginAuthUserInputDto,
  LoginAuthUserOutputDto,
} from '../../dto/user-facade.dto';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

/**
 * Properties required to initialize the AuthUserFacade
 */
type AuthUserFacadeProps = {
  readonly createAuthUser: CreateAuthUser;
  readonly deleteAuthUser: DeleteAuthUser;
  readonly findAuthUser: FindAuthUser;
  readonly updateAuthUser: UpdateAuthUser;
  readonly loginAuthUser: LoginAuthUser;
  readonly policiesService: PoliciesServiceInterface;
};

/**
 * Facade implementation for authentication user operations
 *
 * This class provides a unified interface to the underlying authentication
 * use cases, simplifying client interaction with the auth subsystem.
 */
export default class AuthUserFacade implements AuthUserFacadeInterface {
  private readonly _createAuthUser: CreateAuthUser;
  private readonly _deleteAuthUser: DeleteAuthUser;
  private readonly _findAuthUser: FindAuthUser;
  private readonly _updateAuthUser: UpdateAuthUser;
  private readonly _loginAuthUser: LoginAuthUser;
  private readonly _policiesService: PoliciesServiceInterface;

  /**
   * Creates a new instance of AuthUserFacade
   * @param input Dependencies required by the facade
   */
  constructor(input: AuthUserFacadeProps) {
    this._createAuthUser = input.createAuthUser;
    this._deleteAuthUser = input.deleteAuthUser;
    this._findAuthUser = input.findAuthUser;
    this._updateAuthUser = input.updateAuthUser;
    this._loginAuthUser = input.loginAuthUser;
    this._policiesService = input.policiesService;
  }

  /**
   * Creates a new authentication user
   * @param input User creation parameters
   * @returns Information about the created user
   */
  public async create(
    input: CreateAuthUserInputDto,
    token: TokenData
  ): Promise<CreateAuthUserOutputDto> {
    return await this._createAuthUser.execute(
      input,
      this._policiesService,
      token
    );
  }

  /**
   * Finds an authentication user by email
   * @param input Search parameters
   * @returns User information if found, null otherwise
   */
  public async find(
    input: FindAuthUserInputDto,
    token: TokenData
  ): Promise<FindAuthUserOutputDto | null> {
    // Changed from undefined to null for better semantic meaning
    const result = await this._findAuthUser.execute(
      input,
      this._policiesService,
      token
    );
    return result || null;
  }

  /**
   * Deletes an authentication user
   * @param input User identification (email)
   * @returns Confirmation message
   */
  public async delete(
    input: DeleteAuthUserInputDto,
    token: TokenData
  ): Promise<DeleteAuthUserOutputDto> {
    return await this._deleteAuthUser.execute(
      input,
      this._policiesService,
      token
    );
  }

  /**
   * Updates an authentication user's information
   * @param input User identification and data to update
   * @returns Updated user information
   */
  public async update(
    input: UpdateAuthUserInputDto,
    token: TokenData
  ): Promise<UpdateAuthUserOutputDto> {
    return await this._updateAuthUser.execute(
      input,
      this._policiesService,
      token
    );
  }

  /**
   * Authenticates a user and generates an access token
   * @param input Login credentials
   * @returns Authentication token
   */
  public async login(
    input: LoginAuthUserInputDto
  ): Promise<LoginAuthUserOutputDto> {
    return await this._loginAuthUser.execute(input);
  }
}
