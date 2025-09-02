import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '../../../application/gateway/user.gateway';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import { AuthUserMapper, AuthUserMapperProps } from '../../mapper/authUser.mapper';
import { AuthUserNotFoundError } from '@/modules/authentication-authorization-management/application/errors/auth-user-not-found.error';

/**
 * In-memory implementation of AuthUserGateway.
 * Stores and manipulates authentication users in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryAuthUserRepository implements AuthUserGateway {
  private _authUsers: Map<string, AuthUserMapperProps> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param authUser - Optional initial array of authentication users
   */
  constructor(
    private readonly authUserService: AuthUserServiceInterface,
    authUsers?: AuthUser[]
  ) {
    if (authUsers) {
      for (const user of authUsers) {
        this._authUsers.set(user.email, AuthUserMapper.toObj(user));
      }
    }
  }

  /**
   * Finds a user by their email address.
   * @param email - The email address to search for
   * @returns Promise resolving to the found AuthUser or null if not found
   */
  async find(email: string): Promise<AuthUser | null> {
    const obj = this._authUsers.get(email);
    return obj ? AuthUserMapper.toInstance(obj, this.authUserService) : null;
  }

  /**
   * Creates a new authentication user in memory.
   * @param authUser - The user entity to be created
   * @returns Promise resolving to an object containing the email and masterId of the created user
   */
  async create(authUser: AuthUser): Promise<{ email: string }> {
    this._authUsers.set(authUser.email, AuthUserMapper.toObj(authUser));
    return { email: authUser.email };
  }

  /**
   * Updates an existing user identified by email.
   * @param authUser - The user entity with updated information
   * @param email - The email address of the user to update
   * @returns Promise resolving to the updated AuthUser entity
   * @throws Error if the user is not found
   */
  async update(authUser: AuthUser, email: string): Promise<AuthUser> {
    if (!this._authUsers.has(email)) {
      throw new AuthUserNotFoundError(email);
    }
    this._authUsers.set(email, AuthUserMapper.toObj(authUser));
    return authUser;
  }

  /**
   * Deactivate a user by their email address.
   * @param email - The email address of the user to deactivate
   * @returns Promise resolving to a success message
   * @throws Error if the user is not found
   */
  async delete(authUser: AuthUser): Promise<string> {
    if (!this._authUsers.get(authUser.email)) {
      throw new AuthUserNotFoundError(authUser.email);
    }

    this._authUsers.set(authUser.email, AuthUserMapper.toObj(authUser));
    return 'Operação concluída com sucesso';
  }

  /**
   * Verifies whether a user exists by email.
   * @param email - The email address to verify
   * @returns Promise resolving to true if exists, false otherwise
   */
  async verify(email: string): Promise<boolean> {
    return this._authUsers.has(email);
  }
}
