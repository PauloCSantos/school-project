import TeacherFacade from '../facade/facade/teacher.facade';
import CreateUserTeacher from '../usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '../usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '../usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '../usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '../usecases/teacher/updateUserTeacher.usecase';
import { EmailAuthValidator } from '../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { UserServiceInterface } from '../../domain/services/user.service';
import FindUserTeacherByBaseUser from '../usecases/teacher/findUserTeacherByBaseUser.usecase';
import UserTeacherGateway from '../gateway/teacher.gateway';

export default class TeacherFacadeFactory {
  static create(
    repository: UserTeacherGateway,
    emailValidatorService: EmailAuthValidator,
    policiesService: PoliciesServiceInterface,
    userService: UserServiceInterface
  ): TeacherFacade {
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
    const findUserTeacherByBaseUser = new FindUserTeacherByBaseUser(
      repository,
      userService
    );
    const facade = new TeacherFacade({
      createUserTeacher,
      deleteUserTeacher,
      findAllUserTeacher,
      findUserTeacher,
      updateUserTeacher,
      findUserTeacherByBaseUser,
    });

    return facade;
  }
}
