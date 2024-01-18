import UserStudent from '../domain/entity/user-student.entity';

export default interface UserStudentGateway {
  find(id: string): Promise<Omit<UserStudent, 'id'> | undefined>;
  findAll(
    quantity?: number,
    offSet?: number
  ): Promise<Omit<UserStudent, 'id'>[]>;
  create(userStudent: UserStudent): Promise<string>;
  update(userStudent: UserStudent): Promise<Omit<UserStudent, 'id'>>;
  delete(id: string): Promise<string>;
}
