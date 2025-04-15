import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
  LoginAuthUserInputDto,
  LoginAuthUserOutputDto,
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '../../application/dto/user-usecase.dto';
import CreateAuthUser from '../../application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '../../application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '../../application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '../../application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '../../application/usecases/authUser/update-user.usecase';

/**
 * Controller for authentication and user management operations.
 * Handles HTTP requests by delegating to appropriate use cases.
 */
export default class AuthUserController {
  /**
   * Creates a new AuthUserController instance.
   * @param createAuthUser - Use case for creating a new authentication user
   * @param findAuthUser - Use case for finding an authentication user
   * @param updateAuthUser - Use case for updating an authentication user
   * @param deleteAuthUser - Use case for deleting an authentication user
   * @param loginAuthUser - Use case for logging in an authentication user
   */
  constructor(
    private readonly createAuthUser: CreateAuthUser,
    private readonly findAuthUser: FindAuthUser,
    private readonly updateAuthUser: UpdateAuthUser,
    private readonly deleteAuthUser: DeleteAuthUser,
    private readonly loginAuthUser: LoginAuthUser
  ) {}

  /**
   * Creates a new authentication user.
   * @param input - The data for creating a new user
   * @returns Promise resolving to the created user data
   */
  async create(
    input: CreateAuthUserInputDto
  ): Promise<CreateAuthUserOutputDto> {
    const response = await this.createAuthUser.execute(input);
    return response;
  }

  /**
   * Finds an authentication user by email.
   * @param input - The input containing the email to search for
   * @returns Promise resolving to the found user data or undefined
   */
  async find(
    input: FindAuthUserInputDto
  ): Promise<FindAuthUserOutputDto | undefined> {
    const response = await this.findAuthUser.execute(input);
    return response;
  }

  /**
   * Deletes an authentication user.
   * @param input - The input containing the email of the user to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(
    input: DeleteAuthUserInputDto
  ): Promise<DeleteAuthUserOutputDto> {
    const response = await this.deleteAuthUser.execute(input);
    return response;
  }

  /**
   * Updates an authentication user.
   * @param input - The input containing the user data to update
   * @returns Promise resolving to the updated user data
   */
  async update(
    input: UpdateAuthUserInputDto
  ): Promise<UpdateAuthUserOutputDto> {
    const response = await this.updateAuthUser.execute(input);
    return response;
  }

  /**
   * Authenticates a user and returns login information.
   * @param input - The credentials for user login
   * @returns Promise resolving to the login information, including token
   */
  async login(input: LoginAuthUserInputDto): Promise<LoginAuthUserOutputDto> {
    const response = await this.loginAuthUser.execute(input);
    return response;
  }
}
