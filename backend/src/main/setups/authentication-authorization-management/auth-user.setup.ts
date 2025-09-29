import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import AuthUserController from '@/modules/authentication-authorization-management/interface/controller/user.controller';
import AuthUserRoute from '@/modules/authentication-authorization-management/interface/route/user.route';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import CheckRegistration from '@/modules/authentication-authorization-management/application/usecases/authUser/check-registration.usecase';
import AddRole from '@/modules/authentication-authorization-management/application/usecases/authUser/add-role.usecase';
import MasterFacadeInterface from '@/modules/user-management/application/facade/interface/master-facade.interface';
import AdministratorFacadeInterface from '@/modules/user-management/application/facade/interface/administrator-facade.interface';
import TeacherFacadeInterface from '@/modules/user-management/application/facade/interface/teacher-facade.interface';
import StudentFacadeInterface from '@/modules/user-management/application/facade/interface/student-facade.interface';
import WorkerFacadeInterface from '@/modules/user-management/application/facade/interface/worker-facade.interface';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';

export default function initializeAuthUser(
  express: HttpServer,
  tokenService: TokenService,
  tenantRepository: TenantGateway,
  tenantService: TenantServiceInterface,
  authUserService: AuthUserService,
  policiesService: PoliciesService,
  authUserRepository: AuthUserGateway,
  masterFacade: MasterFacadeInterface,
  administratorFacade: AdministratorFacadeInterface,
  teacherFacade: TeacherFacadeInterface,
  studentFacade: StudentFacadeInterface,
  workerFacade: WorkerFacadeInterface,
  isProd: boolean
): void {
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
  const checkRegistration = new CheckRegistration(
    masterFacade,
    administratorFacade,
    teacherFacade,
    studentFacade,
    workerFacade
  );

  const addRole = new AddRole(
    authUserRepository,
    tenantRepository,
    tenantService,
    policiesService
  );

  const authUserController = new AuthUserController(
    createAuthUser,
    findAuthUser,
    updateAuthUser,
    deleteAuthUser,
    loginAuthUser,
    checkRegistration,
    addRole
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
