import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/createAuthUser.usecase';
import DeleteAuthUser from '@/application/usecases/authentication-authorization-management/authUser/deleteAuthUser.usecase';
import FindAuthUser from '@/application/usecases/authentication-authorization-management/authUser/findAuthUser.usecase';
import LoginAuthUser from '@/application/usecases/authentication-authorization-management/authUser/loginAuthUser.usecase';
import UpdateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/updateAuthUser.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryAuthUserRepository from '@/infraestructure/repositories/authentication-authorization-management/authUser.repository';
import AuthUserController from '@/interface/controller/authentication-authorization-management/authUser.controller';
import AuthUserRoute from '@/interface/route/authentication-authorization-management/authUser.route';

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
