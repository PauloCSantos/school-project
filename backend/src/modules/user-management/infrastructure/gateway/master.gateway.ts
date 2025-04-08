import UserMaster from '@/modules/user-management/domain/entity/master.entity';

export default interface UserMasterGateway {
  find(id: string): Promise<UserMaster | undefined>;
  create(userMaster: UserMaster): Promise<string>;
  update(userMaster: UserMaster): Promise<UserMaster>;
}
