import UserAdministrator from '../domain/entity/user-administrator.entity';

export default interface UserAdministratorGateway {
  find(id: string): Promise<UserAdministrator | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<UserAdministrator[]>;
  create(userAdministrator: UserAdministrator): Promise<string>;
  update(userAdministrator: UserAdministrator): Promise<UserAdministrator>;
  delete(id: string): Promise<string>;
}
