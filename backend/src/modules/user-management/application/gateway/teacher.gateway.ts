import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

export default interface UserTeacherGateway {
  find(masterId: string, id: string): Promise<UserTeacher | null>;
  findByBaseUserId(masterId: string, userId: string): Promise<UserTeacher | null>;
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<UserTeacher[]>;
  create(masterId: string, userTeacher: UserTeacher): Promise<string>;
  update(masterId: string, userTeacher: UserTeacher): Promise<UserTeacher>;
  delete(masterId: string, userTeacher: UserTeacher): Promise<string>;
}
