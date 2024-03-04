import bcrypt from 'bcrypt';

export default class AuthUserService {
  private readonly saltRounds: number = 10;

  async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
