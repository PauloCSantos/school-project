import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserTeacher from '@/modules/user-management/application/usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/modules/user-management/application/usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/modules/user-management/application/usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/modules/user-management/application/usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/modules/user-management/application/usecases/teacher/updateUserTeacher.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import MemoryUserTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';
import { UserTeacherController } from '@/modules/user-management/interface/controller/teacher.controller';
import { UserTeacherRoute } from '@/modules/user-management/interface/route/teacher.route';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/enum';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';

export default function initializeUserTeacher(express: HttpServer): void {
  const userTeacherRepository = new MemoryUserTeacherRepository();
  const createUserTeacherUsecase = new CreateUserTeacher(userTeacherRepository);
  const findUserTeacherUsecase = new FindUserTeacher(userTeacherRepository);
  const findAllUserTeacherUsecase = new FindAllUserTeacher(
    userTeacherRepository
  );
  const deleteUserTeacherUsecase = new DeleteUserTeacher(userTeacherRepository);
  const updateUserTeacherUsecase = new UpdateUserTeacher(userTeacherRepository);
  const userTeacherController = new UserTeacherController(
    createUserTeacherUsecase,
    findUserTeacherUsecase,
    findAllUserTeacherUsecase,
    updateUserTeacherUsecase,
    deleteUserTeacherUsecase
  );
  const tokenService = tokenInstance();
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
