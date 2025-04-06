import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserAdministrator from '@/modules/user-management/application/usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/modules/user-management/application/usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/modules/user-management/application/usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/modules/user-management/application/usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/modules/user-management/application/usecases/administrator/updateUserAdministrator.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express-http';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/user-administrator.repository';
import { UserAdministratorController } from '@/modules/user-management/interface/controller/user-administrator.controller';
import { UserAdministratorRoute } from '@/modules/user-management/interface/route/user-administrator.route';

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
