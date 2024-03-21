import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateUserAdministrator from '@/application/usecases/user-management/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/application/usecases/user-management/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/application/usecases/user-management/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/application/usecases/user-management/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/application/usecases/user-management/administrator/updateUserAdministrator.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryUserAdministratorRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-administrator.repository';
import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
import { UserAdministratorRoute } from '@/interface/route/user-management/user-administrator.route';

export default function initializeUserAdministrator(
  express: ExpressHttp
): void {
  const userAdministratorRepository = new MemoryUserAdministratorRepository();
  const createUserAdministratorUsecase = new CreateUserAdministrator(
    userAdministratorRepository
  );
  const findUserAdministratorUsecase = new FindUserAdministrator(
    userAdministratorRepository
  );
  const findAllUserAdministratorUsecase = new FindAllUserAdministrator(
    userAdministratorRepository
  );
  const deleteUserAdministratorUsecase = new DeleteUserAdministrator(
    userAdministratorRepository
  );
  const updateUserAdministratorUsecase = new UpdateUserAdministrator(
    userAdministratorRepository
  );
  const userAdministratorController = new UserAdministratorController(
    createUserAdministratorUsecase,
    findUserAdministratorUsecase,
    findAllUserAdministratorUsecase,
    updateUserAdministratorUsecase,
    deleteUserAdministratorUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = ['master', 'administrator'];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userAdministratorRoute = new UserAdministratorRoute(
    userAdministratorController,
    express,
    authUserMiddleware
  );
  userAdministratorRoute.routes();
}
