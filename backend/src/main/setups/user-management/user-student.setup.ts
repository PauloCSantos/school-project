import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserStudent from '@/modules/user-management/application/usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '@/modules/user-management/application/usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/modules/user-management/application/usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '@/modules/user-management/application/usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '@/modules/user-management/application/usecases/student/updateUserStudent.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import MemoryUserStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';
import { UserStudentController } from '@/modules/user-management/interface/controller/student.controller';
import { UserStudentRoute } from '@/modules/user-management/interface/route/student.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/enum';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';

export default function initializeUserStudent(express: HttpServer): void {
  const userStudentRepository = new MemoryUserStudentRepository();
  const authUserRepository = new MemoryAuthUserRepository();
  const emailValidatorService = new EmailAuthValidatorService(
    authUserRepository
  );
  const createUserStudentUsecase = new CreateUserStudent(
    userStudentRepository,
    emailValidatorService
  );
  const findUserStudentUsecase = new FindUserStudent(userStudentRepository);
  const findAllUserStudentUsecase = new FindAllUserStudent(
    userStudentRepository
  );
  const deleteUserStudentUsecase = new DeleteUserStudent(userStudentRepository);
  const updateUserStudentUsecase = new UpdateUserStudent(userStudentRepository);
  const userStudentController = new UserStudentController(
    createUserStudentUsecase,
    findUserStudentUsecase,
    findAllUserStudentUsecase,
    updateUserStudentUsecase,
    deleteUserStudentUsecase
  );
  const tokenService = tokenInstance();
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
