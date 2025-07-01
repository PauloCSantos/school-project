import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserTeacherRepository from '../../infrastructure/repositories/memory-repository/teacher.repository';
import TeacherFacade from '../facade/facade/teacher.facade';
import CreateUserTeacher from '../usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '../usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '../usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '../usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '../usecases/teacher/updateUserTeacher.usecase';
import { EmailAuthValidatorService } from '../services/email-auth-validator.service';

export default class TeacherFacadeFactory {
  static create(): TeacherFacade {
    const repository = new MemoryUserTeacherRepository();
    const authUserRepository = new MemoryAuthUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(
      authUserRepository
    );
    const createUserTeacher = new CreateUserTeacher(
      repository,
      emailValidatorService
    );
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
