import MemoryUserTeacherRepository from '../../infrastructure/repositories/memory-repository/teacher.repository';
import TeacherFacade from '../facade/facade/teacher.facade';
import CreateUserTeacher from '../usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '../usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '../usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '../usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '../usecases/teacher/updateUserTeacher.usecase';

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
