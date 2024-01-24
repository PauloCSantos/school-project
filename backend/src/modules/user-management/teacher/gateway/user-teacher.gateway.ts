import UserTeacher from '../domain/entity/user-teacher.entity';

export default interface UserTeacherGateway {
  find(id: string): Promise<UserTeacher | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<UserTeacher[]>;
  create(userTeacher: UserTeacher): Promise<string>;
  update(userTeacher: UserTeacher): Promise<UserTeacher>;
  delete(id: string): Promise<string>;
}
