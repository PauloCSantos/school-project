import UserMaster from '@/modules/user-management/domain/entity/master.entity';

export default interface UserMasterGateway {
  find(id: string): Promise<UserMaster | null>;
  findByEmail(email: string): Promise<UserMaster | null>;
  create(userMaster: UserMaster): Promise<string>;
  update(userMaster: UserMaster): Promise<UserMaster>;
}
