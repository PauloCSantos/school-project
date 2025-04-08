import UserStudent from '@/modules/user-management/domain/entity/student.entity';

export default interface UserStudentGateway {
  find(id: string): Promise<UserStudent | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<UserStudent[]>;
  create(userStudent: UserStudent): Promise<string>;
  update(userStudent: UserStudent): Promise<UserStudent>;
  delete(id: string): Promise<string>;
}
