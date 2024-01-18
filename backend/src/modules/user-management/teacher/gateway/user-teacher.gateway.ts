import UserTeacher from '../domain/entity/user-teacher.entity';

export default interface UserTeacherGateway {
  find(id: string): Promise<Omit<UserTeacher, 'id'> | undefined>;
  findAll(
    quantity?: number,
    offSet?: number
  ): Promise<Omit<UserTeacher, 'id'>[]>;
  create(userTeacher: UserTeacher): Promise<string>;
  update(userTeacher: UserTeacher): Promise<Omit<UserTeacher, 'id'>>;
  delete(id: string): Promise<string>;
}
