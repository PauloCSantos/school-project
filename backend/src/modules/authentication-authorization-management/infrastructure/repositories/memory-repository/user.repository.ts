import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '../../gateway/user.gateway';

/**
 * In-memory implementation of AuthUserGateway.
 * Stores and manipulates authentication users in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryAuthUserRepository implements AuthUserGateway {
  private _authUser: AuthUser[];

  /**
   * Creates a new in-memory repository.
   * @param authUser - Optional initial array of authentication users
   */
  constructor(authUser?: AuthUser[]) {
    authUser ? (this._authUser = authUser) : (this._authUser = []);
  }

  /**
   * Finds a user by their email address.
   * @param email - The email address to search for
   * @returns Promise resolving to the found AuthUser or null if not found
   */
  async find(email: string): Promise<AuthUser | null> {
    const authUser = this._authUser.find(authUser => authUser.email === email);
    if (authUser) {
      return authUser;
    } else {
      return null;
    }
  }

  /**
   * Creates a new authentication user in memory.
   * @param authUser - The user entity to be created
   * @returns Promise resolving to an object containing the email and masterId of the created user
   */
  async create(
    authUser: AuthUser
  ): Promise<{ email: string; masterId: string }> {
    this._authUser.push(authUser);
    return { email: authUser.email, masterId: authUser.masterId };
  }

  /**
   * Updates an existing user identified by email.
   * @param authUser - The user entity with updated information
   * @param email - The email address of the user to update
   * @returns Promise resolving to the updated AuthUser entity
   * @throws Error if the user is not found
   */
  async update(authUser: AuthUser, email: string): Promise<AuthUser> {
    const authUserIndex = this._authUser.findIndex(
      dbAuthUser => dbAuthUser.email === email
    );
    if (authUserIndex !== -1) {
      return (this._authUser[authUserIndex] = authUser);
    } else {
      throw new Error('AuthUser not found');
    }
  }

  /**
   * Deletes a user by their email address.
   * @param email - The email address of the user to delete
   * @returns Promise resolving to a success message
   * @throws Error if the user is not found
   */
  async delete(email: string): Promise<string> {
    const authUserIndex = this._authUser.findIndex(
      dbAuthUser => dbAuthUser.email === email
    );
    if (authUserIndex !== -1) {
      this._authUser.splice(authUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('AuthUser not found');
    }
  }

  async verify(email: string): Promise<boolean> {
    return this._authUser.some(authUser => authUser.email === email);
  }
}
