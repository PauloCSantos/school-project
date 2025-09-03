import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserTeacher from '@/modules/user-management/application/usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/modules/user-management/application/usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/modules/user-management/application/usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/modules/user-management/application/usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/modules/user-management/application/usecases/teacher/updateUserTeacher.usecase';
import MemoryUserTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';
import { UserTeacherController } from '@/modules/user-management/interface/controller/teacher.controller';
import { UserTeacherRoute } from '@/modules/user-management/interface/route/teacher.route';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { UserService } from '@/modules/user-management/domain/services/user.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeUserTeacher(
  express: HttpServer,
  tokenService: TokenService,
  authUserService: AuthUserService,
  policiesService: PoliciesService,
  userService: UserService,
  isProd: boolean
): void {
  const userTeacherRepository = new MemoryUserTeacherRepository();
  const authUserRepository = new MemoryAuthUserRepository(authUserService);
  const emailValidatorService = new EmailAuthValidatorService(authUserRepository);

  const createUserTeacherUsecase = new CreateUserTeacher(
    userTeacherRepository,
    emailValidatorService,
    policiesService,
    userService
  );
  const findUserTeacherUsecase = new FindUserTeacher(
    userTeacherRepository,
    policiesService,
    userService
  );
  const findAllUserTeacherUsecase = new FindAllUserTeacher(
    userTeacherRepository,
    policiesService,
    userService
  );
  const deleteUserTeacherUsecase = new DeleteUserTeacher(
    userTeacherRepository,
    policiesService
  );
  const updateUserTeacherUsecase = new UpdateUserTeacher(
    userTeacherRepository,
    policiesService,
    userService
  );

  const userTeacherController = new UserTeacherController(
    createUserTeacherUsecase,
    findUserTeacherUsecase,
    findAllUserTeacherUsecase,
    updateUserTeacherUsecase,
    deleteUserTeacherUsecase
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userTeacherRoute = new UserTeacherRoute(
    userTeacherController,
    express,
    authUserMiddleware
  );
  userTeacherRoute.routes();
}
