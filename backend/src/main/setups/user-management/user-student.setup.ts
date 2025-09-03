import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserStudent from '@/modules/user-management/application/usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '@/modules/user-management/application/usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/modules/user-management/application/usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '@/modules/user-management/application/usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '@/modules/user-management/application/usecases/student/updateUserStudent.usecase';

import MemoryUserStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';
import { UserStudentController } from '@/modules/user-management/interface/controller/student.controller';
import { UserStudentRoute } from '@/modules/user-management/interface/route/student.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { UserService } from '@/modules/user-management/domain/services/user.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeUserStudent(
  express: HttpServer,
  tokenService: TokenService,
  authUserService: AuthUserService,
  policiesService: PoliciesService,
  userService: UserService,
  isProd: boolean
): void {
  const userStudentRepository = new MemoryUserStudentRepository();
  const authUserRepository = new MemoryAuthUserRepository(authUserService);
  const emailValidatorService = new EmailAuthValidatorService(authUserRepository);

  const createUserStudentUsecase = new CreateUserStudent(
    userStudentRepository,
    emailValidatorService,
    policiesService,
    userService
  );
  const findUserStudentUsecase = new FindUserStudent(
    userStudentRepository,
    policiesService,
    userService
  );
  const findAllUserStudentUsecase = new FindAllUserStudent(
    userStudentRepository,
    policiesService,
    userService
  );
  const deleteUserStudentUsecase = new DeleteUserStudent(
    userStudentRepository,
    policiesService
  );
  const updateUserStudentUsecase = new UpdateUserStudent(
    userStudentRepository,
    policiesService,
    userService
  );

  const userStudentController = new UserStudentController(
    createUserStudentUsecase,
    findUserStudentUsecase,
    findAllUserStudentUsecase,
    updateUserStudentUsecase,
    deleteUserStudentUsecase
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userStudentRoute = new UserStudentRoute(
    userStudentController,
    express,
    authUserMiddleware
  );
  userStudentRoute.routes();
}
