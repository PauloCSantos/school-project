import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';

export default interface UserAdministratorGateway {
  find(id: string): Promise<UserAdministrator | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<UserAdministrator[]>;
  create(userAdministrator: UserAdministrator): Promise<string>;
  update(userAdministrator: UserAdministrator): Promise<UserAdministrator>;
  delete(id: string): Promise<string>;
}
