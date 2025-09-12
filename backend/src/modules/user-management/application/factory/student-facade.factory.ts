import StudentFacade from '../facade/facade/student.facade';
import CreateUserStudent from '../usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '../usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '../usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '../usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '../usecases/student/updateUserStudent.usecase';
import { EmailAuthValidator } from '../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { UserServiceInterface } from '../../domain/services/user.service';
import FindUserStudentByBaseUser from '../usecases/student/findUserStudentByBaseUser.usecase';
import UserStudentGateway from '../gateway/student.gateway';

export default class StudentFacadeFactory {
  static create(
    repository: UserStudentGateway,
    emailValidatorService: EmailAuthValidator,
    policiesService: PoliciesServiceInterface,
    userService: UserServiceInterface
  ): StudentFacade {
    const createUserStudent = new CreateUserStudent(
      repository,
      emailValidatorService,
      policiesService,
      userService
    );
    const deleteUserStudent = new DeleteUserStudent(repository, policiesService);
    const findAllUserStudent = new FindAllUserStudent(
      repository,
      policiesService,
      userService
    );
    const findUserStudent = new FindUserStudent(repository, policiesService, userService);
    const updateUserStudent = new UpdateUserStudent(
      repository,
      policiesService,
      userService
    );
    const findUserStudentByBaseUser = new FindUserStudentByBaseUser(
      repository,
      userService
    );
    const facade = new StudentFacade({
      createUserStudent,
      deleteUserStudent,
      findAllUserStudent,
      findUserStudent,
      updateUserStudent,
      findUserStudentByBaseUser,
    });

    return facade;
  }
}
