import UserMaster from '@/modules/user-management/master/domain/entity/user-master.entity';
import UserMasterGateway from '@/modules/user-management/master/gateway/user-master.gateway';

export default class MemoryUserMasterRepository implements UserMasterGateway {
  private _masterUsers: UserMaster[];

  constructor(masterUsers?: UserMaster[]) {
    masterUsers ? (this._masterUsers = masterUsers) : (this._masterUsers = []);
  }

  async find(id: string): Promise<UserMaster | undefined> {
    const user = this._masterUsers.find(user => user.id.id === id);
    if (user) {
      return user;
    } else {
      return undefined;
    }
  }
  async create(userMaster: UserMaster): Promise<string> {
    this._masterUsers.push(userMaster);
    return userMaster.id.id;
  }
  async update(userMaster: UserMaster): Promise<UserMaster> {
    const masterUserIndex = this._masterUsers.findIndex(
      user => user.id.id === userMaster.id.id
    );
    if (masterUserIndex !== -1) {
      this._masterUsers[masterUserIndex] = userMaster;
      return this._masterUsers[masterUserIndex];
    } else {
      throw new Error('User not found');
    }
  }
}
