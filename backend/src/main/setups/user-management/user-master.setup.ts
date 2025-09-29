import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';
import FindUserMaster from '@/modules/user-management/application/usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '@/modules/user-management/application/usecases/master/updateUserMaster.usecase';
import { UserMasterController } from '@/modules/user-management/interface/controller/master.controller';
import { UserMasterRoute } from '@/modules/user-management/interface/route/master.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { UserService } from '@/modules/user-management/domain/services/user.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';

export default function initializeUserMaster(
  express: HttpServer,
  tokenService: TokenService,
  userMasterRepository: UserMasterGateway,
  emailValidatorService: EmailAuthValidatorService,
  policiesService: PoliciesService,
  userService: UserService,
  tenantService: TenantServiceInterface,
  isProd: boolean
): void {
  const createUserMasterUsecase = new CreateUserMaster(
    userMasterRepository,
    emailValidatorService,
    policiesService,
    userService,
    tenantService
  );
  const findUserMasterUsecase = new FindUserMaster(
    userMasterRepository,
    policiesService,
    userService
  );
  const updateUserMasterUsecase = new UpdateUserMaster(
    userMasterRepository,
    policiesService,
    userService
  );

  const userMasterController = new UserMasterController(
    createUserMasterUsecase,
    findUserMasterUsecase,
    updateUserMasterUsecase
  );

  const allowedRoles: RoleUsers[] = [RoleUsersEnum.MASTER];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userMasterRoute = new UserMasterRoute(
    userMasterController,
    express,
    authUserMiddleware
  );
  userMasterRoute.routes();
}
