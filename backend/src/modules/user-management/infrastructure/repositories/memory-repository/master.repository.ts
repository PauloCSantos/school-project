import UserMasterGateway from '../../gateway/master.gateway';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';

export default class MemoryUserMasterRepository implements UserMasterGateway {
  private _masterUsers: UserMaster[];

  constructor(masterUsers?: UserMaster[]) {
    masterUsers ? (this._masterUsers = masterUsers) : (this._masterUsers = []);
  }

  async find(id: string): Promise<UserMaster | undefined> {
    const user = this._masterUsers.find(user => user.id.value === id);
    if (user) {
      return user;
    } else {
      return undefined;
    }
  }
  async create(userMaster: UserMaster): Promise<string> {
    this._masterUsers.push(userMaster);
    return userMaster.id.value;
  }
  async update(userMaster: UserMaster): Promise<UserMaster> {
    const masterUserIndex = this._masterUsers.findIndex(
      user => user.id.value === userMaster.id.value
    );
    if (masterUserIndex !== -1) {
      this._masterUsers[masterUserIndex] = userMaster;
      return this._masterUsers[masterUserIndex];
    } else {
      throw new Error('User not found');
    }
  }
}
