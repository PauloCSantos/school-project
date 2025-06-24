import UserTeacherGateway from '../../gateway/teacher.gateway';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

export default class MemoryUserTeacherRepository implements UserTeacherGateway {
  private _teacherUsers: UserTeacher[];

  constructor(teacherUsers?: UserTeacher[]) {
    teacherUsers
      ? (this._teacherUsers = teacherUsers)
      : (this._teacherUsers = []);
  }

  async find(id: string): Promise<UserTeacher | null> {
    const user = this._teacherUsers.find(user => user.id.value === id);
    if (user) {
      return user;
    } else {
      return null;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserTeacher[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const users = this._teacherUsers.slice(offS, qtd);

    return users;
  }
  async create(userTeacher: UserTeacher): Promise<string> {
    this._teacherUsers.push(userTeacher);
    return userTeacher.id.value;
  }
  async update(userTeacher: UserTeacher): Promise<UserTeacher> {
    const teacherUserIndex = this._teacherUsers.findIndex(
      user => user.id.value === userTeacher.id?.value
    );
    if (teacherUserIndex !== -1) {
      return (this._teacherUsers[teacherUserIndex] = userTeacher);
    } else {
      throw new Error('User not found');
    }
  }
  async delete(id: string): Promise<string> {
    const teacherUserIndex = this._teacherUsers.findIndex(
      user => user.id.value === id
    );
    if (teacherUserIndex !== -1) {
      this._teacherUsers.splice(teacherUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('User not found');
    }
  }
}
