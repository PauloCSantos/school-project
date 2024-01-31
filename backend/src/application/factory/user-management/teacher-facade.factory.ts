import TeacherFacade from '@/application/facade/user-management/facade/teacher.facade';
import CreateUserTeacher from '@/application/usecases/user-management/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/application/usecases/user-management/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/application/usecases/user-management/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/application/usecases/user-management/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/application/usecases/user-management/teacher/updateUserTeacher.usecase';
import MemoryUserTeacherRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-teacher.repository';

export default class TeacherFacadeFactory {
  static create(): TeacherFacade {
    const repository = new MemoryUserTeacherRepository();
    const createUserTeacher = new CreateUserTeacher(repository);
    const deleteUserTeacher = new DeleteUserTeacher(repository);
    const findAllUserTeacher = new FindAllUserTeacher(repository);
    const findUserTeacher = new FindUserTeacher(repository);
    const updateUserTeacher = new UpdateUserTeacher(repository);
    const facade = new TeacherFacade({
      createUserTeacher,
      deleteUserTeacher,
      findAllUserTeacher,
      findUserTeacher,
      updateUserTeacher,
    });

    return facade;
  }
}
