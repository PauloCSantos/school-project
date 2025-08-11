import bcrypt from 'bcrypt';
import { AuthUserServiceInterface } from '../../domain/service/interface/user-entity-service.interface';

/**
 * Service responsible for user authentication,
 * including password hash generation and comparison.
 */
export class AuthUserService implements AuthUserServiceInterface {
  /**
   * Number of salt rounds used by bcrypt.
   * Higher values increase security but also processing time.
   */
  private readonly saltRounds: number = 10;

  /**
   * Generates a secure hash for a given plain-text password using bcrypt.
   *
   * @param password - The plain-text password to be hashed.
   * @returns A Promise that resolves to the hashed password.
   */
  async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain-text password with a hashed password to check if they match.
   *
   * @param password - The plain-text password provided by the user.
   * @param hash - The stored hash to compare against.
   * @returns A Promise that resolves to `true` if the password matches the hash, or `false` otherwise.
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
