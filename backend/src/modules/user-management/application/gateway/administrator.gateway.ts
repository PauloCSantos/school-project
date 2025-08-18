import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';

export default interface UserAdministratorGateway {
  find(masterId: string, id: string): Promise<UserAdministrator | null>;
  findByEmail(
    masterId: string,
    email: string
  ): Promise<UserAdministrator | null>;
  findAll(
    masterId: string,
    quantity?: number,
    offSet?: number
  ): Promise<UserAdministrator[]>;
  create(
    masterId: string,
    userAdministrator: UserAdministrator
  ): Promise<string>;
  update(
    masterId: string,
    userAdministrator: UserAdministrator
  ): Promise<UserAdministrator>;
  delete(masterId: string, id: string): Promise<string>;
}
