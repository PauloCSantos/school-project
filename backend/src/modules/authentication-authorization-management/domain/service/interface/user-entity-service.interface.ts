export interface AuthUserServiceInterface {
  generateHash(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}
