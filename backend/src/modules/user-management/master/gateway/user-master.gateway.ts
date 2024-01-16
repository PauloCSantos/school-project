import UserMaster from '../domain/entity/user-master.entity';

export default interface UserMasterGateway {
  find(id: string): Promise<Omit<UserMaster, 'id'> | undefined>;
  create(userMaster: UserMaster): Promise<string>;
  update(userMaster: UserMaster): Promise<Omit<UserMaster, 'id'>>;
}
