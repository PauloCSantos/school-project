import UserMaster from '@/modules/user-management/domain/entity/master.entity';

export default interface UserMasterGateway {
  find(masterId: string, id: string): Promise<UserMaster | null>;
  findByBaseUserId(masterId: string, userId: string): Promise<UserMaster | null>;
  create(masterId: string, userMaster: UserMaster): Promise<string>;
  update(masterId: string, userMaster: UserMaster): Promise<UserMaster>;
}
