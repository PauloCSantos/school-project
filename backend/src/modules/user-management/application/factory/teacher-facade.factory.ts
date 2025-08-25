import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserTeacherRepository from '../../infrastructure/repositories/memory-repository/teacher.repository';
import TeacherFacade from '../facade/facade/teacher.facade';
import CreateUserTeacher from '../usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '../usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '../usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '../usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '../usecases/teacher/updateUserTeacher.usecase';
import { EmailAuthValidatorService } from '../services/email-auth-validator.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryUserRepository from '../../infrastructure/repositories/memory-repository/user.repository';
import { UserService } from '../../domain/services/user.service';

export default class TeacherFacadeFactory {
  static create(): TeacherFacade {
    const repository = new MemoryUserTeacherRepository();
    const authUserRepository = new MemoryAuthUserRepository();
    const userRepository = new MemoryUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(authUserRepository);
    const policiesService = new PoliciesService();
    const userService = new UserService(userRepository);

    const createUserTeacher = new CreateUserTeacher(
      repository,
      emailValidatorService,
      policiesService,
      userService
    );
    const deleteUserTeacher = new DeleteUserTeacher(repository, policiesService);
    const findAllUserTeacher = new FindAllUserTeacher(
      repository,
      policiesService,
      userService
    );
    const findUserTeacher = new FindUserTeacher(repository, policiesService, userService);
    const updateUserTeacher = new UpdateUserTeacher(
      repository,
      policiesService,
      userService
    );
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
