import { TokenData } from '@/modules/@shared/type/sharedTypes';
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

/**
 * Interface for authentication user operations
 *
 * Provides methods for CRUD operations on authentication users
 * and authentication-related functionality
 */
export default interface AuthUserFacadeInterface {
  /**
   * Creates a new authentication user
   * @param input User creation parameters including email, password and role
   * @returns Information about the created user
   */
  create(
    input: CreateAuthUserInputDto,
    token: TokenData
  ): Promise<CreateAuthUserOutputDto>;

  /**
   * Finds an authentication user by email
   * @param input Search parameters (primarily email)
   * @returns User information if found, null otherwise
   */
  find(
    input: FindAuthUserInputDto,
    token: TokenData
  ): Promise<FindAuthUserOutputDto | null>;

  /**
   * Deletes an authentication user
   * @param input User identification (email)
   * @returns Confirmation message
   */
  delete(
    input: DeleteAuthUserInputDto,
    token: TokenData
  ): Promise<DeleteAuthUserOutputDto>;

  /**
   * Updates an authentication user's information
   * @param input User identification and data to update
   * @returns Updated user information
   */
  update(
    input: UpdateAuthUserInputDto,
    token: TokenData
  ): Promise<UpdateAuthUserOutputDto>;

  /**
   * Authenticates a user and generates an access token
   * @param input Login credentials
   * @returns Authentication token
   */
  login(input: LoginAuthUserInputDto): Promise<LoginAuthUserOutputDto>;
}
