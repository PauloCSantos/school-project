import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '../../../application/gateway/user.gateway';

/**
 * In-memory implementation of AuthUserGateway.
 * Stores and manipulates authentication users in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryAuthUserRepository implements AuthUserGateway {
  private _authUser: Map<string, AuthUser>;

  /**
   * Creates a new in-memory repository.
   * @param authUser - Optional initial array of authentication users
   */
  constructor(authUser?: AuthUser[]) {
    this._authUser = new Map<string, AuthUser>();
    if (authUser) {
      for (const user of authUser) {
        this._authUser.set(user.email, user);
      }
    }
  }

  /**
   * Finds a user by their email address.
   * @param email - The email address to search for
   * @returns Promise resolving to the found AuthUser or null if not found
   */
  async find(email: string): Promise<AuthUser | null> {
    return this._authUser.get(email) ?? null;
  }

  /**
   * Creates a new authentication user in memory.
   * @param authUser - The user entity to be created
   * @returns Promise resolving to an object containing the email and masterId of the created user
   */
  async create(authUser: AuthUser): Promise<{ email: string }> {
    this._authUser.set(authUser.email, authUser);
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
    if (!this._authUser.has(email)) {
      throw new Error('AuthUser not found');
    }
    this._authUser.set(email, authUser);
    return authUser;
  }

  /**
   * Deactivate a user by their email address.
   * @param email - The email address of the user to deactivate
   * @returns Promise resolving to a success message
   * @throws Error if the user is not found
   */
  async delete(email: string): Promise<string> {
    let user = this._authUser.get(email);
    if (!user) {
      throw new Error('AuthUser not found');
    }
    user.deactivate();
    this._authUser.set(email, user);
    return 'Operação concluída com sucesso';
  }

  /**
   * Verifies whether a user exists by email.
   * @param email - The email address to verify
   * @returns Promise resolving to true if exists, false otherwise
   */
  async verify(email: string): Promise<boolean> {
    return this._authUser.has(email);
  }
}
