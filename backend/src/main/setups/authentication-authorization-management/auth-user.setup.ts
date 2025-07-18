import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import AuthUserController from '@/modules/authentication-authorization-management/interface/controller/user.controller';
import AuthUserRoute from '@/modules/authentication-authorization-management/interface/route/user.route';
import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/sharedTypes';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import TokenService from '@/modules/@shared/infraestructure/services/token.service';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';

export default function initializeAuthUser(express: HttpServer): void {
  const authUserRepository = new MemoryAuthUserRepository();
  const authUserService = new AuthUserService();
  const tokenUserService = new TokenService('PxHf3H7');
  const createAuthUser = new CreateAuthUser(
    authUserRepository,
    authUserService
  );
  const updateAuthUser = new UpdateAuthUser(
    authUserRepository,
    authUserService
  );
  const findAuthUser = new FindAuthUser(authUserRepository);
  const deleteAuthUser = new DeleteAuthUser(authUserRepository);
  const loginAuthUser = new LoginAuthUser(
    authUserRepository,
    authUserService,
    tokenUserService
  );
  const authUserController = new AuthUserController(
    createAuthUser,
    findAuthUser,
    updateAuthUser,
    deleteAuthUser,
    loginAuthUser
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
    RoleUsersEnum.WORKER,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const authUserRoute = new AuthUserRoute(
    authUserController,
    express,
    authUserMiddleware
  );
  authUserRoute.routes();
}
