import UserGateway from '../../application/gateway/user.gateway';
import { UserBase, UserBaseProps } from '../entity/user.entity';

export interface UserServiceInterface {
  findBaseUsers<T extends { userId: string }>(
    entities: ReadonlyArray<T>
  ): Promise<ReadonlyArray<{ entity: T; user: UserBase }>>;
  findBaseUser(userId: string): Promise<UserBase | null>;
  getOrCreateUser(email: string, user: UserBaseProps): Promise<UserBase>;
  update(user: UserBase): Promise<UserBase>;
}

export class UserService implements UserServiceInterface {
  constructor(private readonly usersGateway: UserGateway) {}

  async findBaseUsers<T extends { userId: string }>(
    entities: ReadonlyArray<T>
  ): Promise<ReadonlyArray<{ entity: T; user: UserBase }>> {
    if (entities.length === 0) return [];
    const uniqueIds = Array.from(new Set(entities.map(e => e.userId)));
    const users = await this.usersGateway.findManyByIds(uniqueIds);
    const userById = new Map(users.map(u => [u.id.value, u]));

    const out: Array<{ entity: T; user: UserBase }> = [];

    entities.forEach(entity => {
      const user = userById.get(entity.userId);
      if (user) {
        out.push({ entity, user });
      }
    });

    return out;
  }

  async findBaseUser(userId: string): Promise<UserBase | null> {
    const user = await this.usersGateway.find(userId);
    return user;
  }

  async getOrCreateUser(email: string, userProps: UserBaseProps): Promise<UserBase> {
    const user = await this.usersGateway.findByEmail(email);
    if (user) return user;
    const newUser = new UserBase(userProps);
    await this.usersGateway.create(newUser);
    return newUser;
  }

  async update(user: UserBase): Promise<UserBase> {
    await this.usersGateway.update(user);
    return user;
  }
}
