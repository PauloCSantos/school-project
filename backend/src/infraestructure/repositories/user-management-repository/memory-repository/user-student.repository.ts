import UserStudent from '@/modules/user-management/student/domain/entity/user-student.entity';
import UserStudentGateway from '@/modules/user-management/student/gateway/user-student.gateway';

export default class MemoryUserStudentRepository implements UserStudentGateway {
  private _studentUsers: UserStudent[];

  constructor(studentUsers?: UserStudent[]) {
    studentUsers
      ? (this._studentUsers = studentUsers)
      : (this._studentUsers = []);
  }

  async find(id: string): Promise<UserStudent | undefined> {
    const user = this._studentUsers.find(user => user.id.id === id);
    if (user) {
      return user;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserStudent[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const users = this._studentUsers.slice(offS, qtd);
    return users;
  }
  async create(userStudent: UserStudent): Promise<string> {
    this._studentUsers.push;
    return userStudent.id.id;
  }
  async update(userStudent: UserStudent): Promise<UserStudent> {
    const studentUserIndex = this._studentUsers.findIndex(
      user => user.id.id === userStudent.id.id
    );
    if (studentUserIndex !== -1) {
      return (this._studentUsers[studentUserIndex] = userStudent);
    } else {
      throw new Error('User not found');
    }
  }
  async delete(id: string): Promise<string> {
    const studentUserIndex = this._studentUsers.findIndex(
      user => user.id.id === id
    );
    if (studentUserIndex !== -1) {
      this._studentUsers.splice(studentUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('User not found');
    }
  }
}
