import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserStudentRepository from '../../infrastructure/repositories/memory-repository/student.repository';
import StudentFacade from '../facade/facade/student.facade';
import CreateUserStudent from '../usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '../usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '../usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '../usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '../usecases/student/updateUserStudent.usecase';
import { EmailAuthValidatorService } from '../services/email-auth-validator.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryUserRepository from '../../infrastructure/repositories/memory-repository/user.repository';
import { UserService } from '../../domain/services/user.service';

export default class StudentFacadeFactory {
  static create(): StudentFacade {
    const repository = new MemoryUserStudentRepository();
    const authUserRepository = new MemoryAuthUserRepository();
    const userRepository = new MemoryUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(authUserRepository);
    const policiesService = new PoliciesService();
    const userService = new UserService(userRepository);

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
    const facade = new StudentFacade({
      createUserStudent,
      deleteUserStudent,
      findAllUserStudent,
      findUserStudent,
      updateUserStudent,
    });

    return facade;
  }
}
