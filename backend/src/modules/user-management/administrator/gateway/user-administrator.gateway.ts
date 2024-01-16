import UserAdministrator from '../domain/entity/user-administrator.entity';

export default interface UserAdministratorGateway {
  find(id: string): Promise<Omit<UserAdministrator, 'id'> | undefined>;
  findAll(
    quantity?: number,
    offSet?: number
  ): Promise<Omit<UserAdministrator, 'id'>[]>;
  create(userAdministrator: UserAdministrator): Promise<string>;
  update(
    userAdministrator: UserAdministrator
  ): Promise<Omit<UserAdministrator, 'id'>>;
  delete(id: string): Promise<string>;
}
