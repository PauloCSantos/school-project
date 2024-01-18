import UserTeacher from '@/modules/user-management/teacher/domain/entity/user-teacher.entity';
import UserTeacherGateway from '@/modules/user-management/teacher/gateway/user-teacher.gateway';

export default class MemoryUserTeacherRepository implements UserTeacherGateway {
  private _teacherUsers: UserTeacher[];

  constructor(teacherUsers?: UserTeacher[]) {
    teacherUsers
      ? (this._teacherUsers = teacherUsers)
      : (this._teacherUsers = []);
  }

  async find(id: string): Promise<Omit<UserTeacher, 'id'> | undefined> {
    const user = this._teacherUsers.find(user => user.id.id === id);
    if (user) {
      return user;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Omit<UserTeacher, 'id'>[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const users = this._teacherUsers.slice(offS, qtd);

    return users;
  }
  async create(userTeacher: UserTeacher): Promise<string> {
    this._teacherUsers.push(userTeacher);
    return userTeacher.id.id;
  }
  async update(userTeacher: UserTeacher): Promise<Omit<UserTeacher, 'id'>> {
    const teacherUserIndex = this._teacherUsers.findIndex(
      user => user.id.id === userTeacher.id?.id
    );
    if (teacherUserIndex !== -1) {
      return (this._teacherUsers[teacherUserIndex] = userTeacher);
    } else {
      throw new Error('User not found');
    }
  }
  async delete(id: string): Promise<string> {
    const teacherUserIndex = this._teacherUsers.findIndex(
      user => user.id.id === id
    );
    if (teacherUserIndex !== -1) {
      this._teacherUsers.splice(teacherUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('User not found');
    }
  }
}
