import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserAdministrator from '@/modules/user-management/application/usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/modules/user-management/application/usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/modules/user-management/application/usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/modules/user-management/application/usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/modules/user-management/application/usecases/administrator/updateUserAdministrator.usecase';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';
import { UserAdministratorController } from '@/modules/user-management/interface/controller/administrator.controller';
import { UserAdministratorRoute } from '@/modules/user-management/interface/route/administrator.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { UserService } from '@/modules/user-management/domain/services/user.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeUserAdministrator(
  express: HttpServer,
  tokenService: TokenService,
  authUserService: AuthUserService,
  policiesService: PoliciesService,
  userService: UserService,
  isProd: boolean
): void {
  const userAdministratorRepository = new MemoryUserAdministratorRepository();
  const authUserRepository = new MemoryAuthUserRepository(authUserService);
  const emailValidatorService = new EmailAuthValidatorService(authUserRepository);

  const createUserAdministratorUsecase = new CreateUserAdministrator(
    userAdministratorRepository,
    emailValidatorService,
    policiesService,
    userService
  );
  const findUserAdministratorUsecase = new FindUserAdministrator(
    userAdministratorRepository,
    policiesService,
    userService
  );
  const findAllUserAdministratorUsecase = new FindAllUserAdministrator(
    userAdministratorRepository,
    policiesService,
    userService
  );
  const deleteUserAdministratorUsecase = new DeleteUserAdministrator(
    userAdministratorRepository,
    policiesService
  );
  const updateUserAdministratorUsecase = new UpdateUserAdministrator(
    userAdministratorRepository,
    policiesService,
    userService
  );

  const userAdministratorController = new UserAdministratorController(
    createUserAdministratorUsecase,
    findUserAdministratorUsecase,
    findAllUserAdministratorUsecase,
    updateUserAdministratorUsecase,
    deleteUserAdministratorUsecase
  );

  const allowedRoles: RoleUsers[] = [RoleUsersEnum.MASTER, RoleUsersEnum.ADMINISTRATOR];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userAdministratorRoute = new UserAdministratorRoute(
    userAdministratorController,
    express,
    authUserMiddleware
  );
  userAdministratorRoute.routes();
}
