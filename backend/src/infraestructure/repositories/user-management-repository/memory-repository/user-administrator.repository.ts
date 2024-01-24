import UserAdministrator from '@/modules/user-management/administrator/domain/entity/user-administrator.entity';
import UserAdministratorGateway from '@/modules/user-management/administrator/gateway/user-administrator.gateway';

export default class MemoryUserAdministratorRepository
  implements UserAdministratorGateway
{
  private _administratorUsers: UserAdministrator[];

  constructor(administratorUsers?: UserAdministrator[]) {
    administratorUsers
      ? (this._administratorUsers = administratorUsers)
      : (this._administratorUsers = []);
  }

  async find(id: string): Promise<UserAdministrator | undefined> {
    const user = this._administratorUsers.find(user => user.id.id === id);
    if (user) {
      return user;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserAdministrator[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const users = this._administratorUsers.slice(offS, qtd);

    return users;
  }
  async create(userAdministrator: UserAdministrator): Promise<string> {
    this._administratorUsers.push(userAdministrator);
    return userAdministrator.id.id;
  }
  async update(
    userAdministrator: UserAdministrator
  ): Promise<UserAdministrator> {
    const administratorUserIndex = this._administratorUsers.findIndex(
      user => user.id.id === userAdministrator.id.id
    );
    if (administratorUserIndex !== -1) {
      return (this._administratorUsers[administratorUserIndex] =
        userAdministrator);
    } else {
      throw new Error('User not found');
    }
  }
  async delete(id: string): Promise<string> {
    const administratorUserIndex = this._administratorUsers.findIndex(
      user => user.id.id === id
    );
    if (administratorUserIndex !== -1) {
      this._administratorUsers.splice(administratorUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('User not found');
    }
  }
}
