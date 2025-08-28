import UserStudent from '@/modules/user-management/domain/entity/student.entity';

export default interface UserStudentGateway {
  find(masterId: string, id: string): Promise<UserStudent | null>;
  findByBaseUserId(masterId: string, userId: string): Promise<UserStudent | null>;
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<UserStudent[]>;
  create(masterId: string, userStudent: UserStudent): Promise<string>;
  update(masterId: string, userStudent: UserStudent): Promise<UserStudent>;
  delete(masterId: string, userStudent: UserStudent): Promise<string>;
}
