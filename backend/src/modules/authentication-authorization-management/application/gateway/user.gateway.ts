import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';

/**
 * Interface for authentication user operations.
 * Provides methods to interact with user data persistence layer.
 */
export default interface AuthUserGateway {
  /**
   * Finds a user by their email address and role.
   * @param email - The email address to search for
   * @returns Promise resolving to the found AuthUser or null if not found
   */
  find(email: string): Promise<AuthUser | null>;

  /**
   * Creates a new authentication user.
   * @param authUser - The user entity to be created
   * @returns Promise resolving to an object containing the email and masterId of the created user
   */
  create(authUser: AuthUser): Promise<{ email: string }>;

  /**
   * Updates an existing user identified by email.
   * @param authUser - The user entity with updated information
   * @param email - The email address of the user to update
   * @returns Promise resolving to the updated AuthUser entity
   */
  update(authUser: AuthUser, email: string): Promise<AuthUser>;

  /**
   * Deletes a user by their email address.
   * @param email - The email address of the user to delete
   * @returns Promise resolving to a success message
   */
  delete(email: string): Promise<string>;

  verify(email: string): Promise<boolean>;
}
