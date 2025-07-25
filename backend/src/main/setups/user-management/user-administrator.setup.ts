import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserAdministrator from '@/modules/user-management/application/usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/modules/user-management/application/usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/modules/user-management/application/usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/modules/user-management/application/usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/modules/user-management/application/usecases/administrator/updateUserAdministrator.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';
import { UserAdministratorController } from '@/modules/user-management/interface/controller/administrator.controller';
import { UserAdministratorRoute } from '@/modules/user-management/interface/route/administrator.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/sharedTypes';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';

export default function initializeUserAdministrator(express: HttpServer): void {
  const userAdministratorRepository = new MemoryUserAdministratorRepository();
  const authUserRepository = new MemoryAuthUserRepository();
  const emailValidatorService = new EmailAuthValidatorService(
    authUserRepository
  );
  const createUserAdministratorUsecase = new CreateUserAdministrator(
    userAdministratorRepository,
    emailValidatorService
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
  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userAdministratorRoute = new UserAdministratorRoute(
    userAdministratorController,
    express,
    authUserMiddleware
  );
  userAdministratorRoute.routes();
}
