import { UserBase } from '../../domain/entity/user.entity';

export default interface UserGateway {
  find(id: string): Promise<UserBase | null>;
  findByEmail(email: string): Promise<UserBase | null>;
  findManyByIds(ids: ReadonlyArray<string>): Promise<UserBase[]>;
  create(user: UserBase): Promise<string>;
  update(user: UserBase): Promise<UserBase>;
  delete(id: string): Promise<string>;
}
