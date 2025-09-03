import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import AuthUserController from '@/modules/authentication-authorization-management/interface/controller/user.controller';
import AuthUserRoute from '@/modules/authentication-authorization-management/interface/route/user.route';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';
import { TenantService } from '@/modules/authentication-authorization-management/domain/service/tenant.service';

export default function initializeAuthUser(
  express: HttpServer,
  tokenService: TokenService,
  authUserService: AuthUserService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const authUserRepository = new MemoryAuthUserRepository(authUserService);
  const tenantRepository = new MemoryTenantRepository();
  const tenantService = new TenantService(tenantRepository);

  const createAuthUser = new CreateAuthUser(
    authUserRepository,
    tenantRepository,
    authUserService,
    tenantService,
    policiesService
  );
  const updateAuthUser = new UpdateAuthUser(
    authUserRepository,
    tenantRepository,
    authUserService,
    tenantService,
    policiesService
  );
  const findAuthUser = new FindAuthUser(authUserRepository, policiesService);
  const deleteAuthUser = new DeleteAuthUser(authUserRepository, policiesService);
  const loginAuthUser = new LoginAuthUser(
    authUserRepository,
    authUserService,
    tokenService,
    tenantService
  );

  const authUserController = new AuthUserController(
    createAuthUser,
    findAuthUser,
    updateAuthUser,
    deleteAuthUser,
    loginAuthUser
  );

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
