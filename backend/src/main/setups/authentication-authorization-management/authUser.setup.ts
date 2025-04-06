import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/createAuthUser.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/deleteAuthUser.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/findAuthUser.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/loginAuthUser.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/updateAuthUser.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express-http';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/authUser.repository';
import AuthUserController from '@/modules/authentication-authorization-management/interface/controller/authUser.controller';
import AuthUserRoute from '@/modules/authentication-authorization-management/interface/route/authUser.route';

export default function initializeAuthUser(express: ExpressHttp): void {
  const authUserRepository = new MemoryAuthUserRepository();
  const createAuthUser = new CreateAuthUser(authUserRepository);
  const updateAuthUser = new UpdateAuthUser(authUserRepository);
  const findAuthUser = new FindAuthUser(authUserRepository);
  const deleteAuthUser = new DeleteAuthUser(authUserRepository);
  const loginAuthUser = new LoginAuthUser(authUserRepository);
  const authUserController = new AuthUserController(
    createAuthUser,
    findAuthUser,
    updateAuthUser,
    deleteAuthUser,
    loginAuthUser
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [
    'master',
    'administrator',
    'student',
    'teacher',
    'worker',
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const authUserRoute = new AuthUserRoute(
    authUserController,
    express,
    authUserMiddleware
  );
  authUserRoute.routes();
}
