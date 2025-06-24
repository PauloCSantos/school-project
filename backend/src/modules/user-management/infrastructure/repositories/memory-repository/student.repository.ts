import UserStudentGateway from '../../gateway/student.gateway';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';

export default class MemoryUserStudentRepository implements UserStudentGateway {
  private _studentUsers: UserStudent[];

  constructor(studentUsers?: UserStudent[]) {
    studentUsers
      ? (this._studentUsers = studentUsers)
      : (this._studentUsers = []);
  }

  async find(id: string): Promise<UserStudent | null> {
    const user = this._studentUsers.find(user => user.id.value === id);
    if (user) {
      return user;
    } else {
      return null;
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
    this._studentUsers.push(userStudent);
    return userStudent.id.value;
  }
  async update(userStudent: UserStudent): Promise<UserStudent> {
    const studentUserIndex = this._studentUsers.findIndex(
      user => user.id.value === userStudent.id.value
    );
    if (studentUserIndex !== -1) {
      return (this._studentUsers[studentUserIndex] = userStudent);
    } else {
      throw new Error('User not found');
    }
  }
  async delete(id: string): Promise<string> {
    const studentUserIndex = this._studentUsers.findIndex(
      user => user.id.value === id
    );
    if (studentUserIndex !== -1) {
      this._studentUsers.splice(studentUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('User not found');
    }
  }
}
