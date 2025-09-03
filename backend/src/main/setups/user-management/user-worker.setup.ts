import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserWorker from '@/modules/user-management/application/usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/modules/user-management/application/usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/modules/user-management/application/usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/modules/user-management/application/usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/modules/user-management/application/usecases/worker/updateUserWorker.usecase';
import MemoryUserWorkerRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/worker.repository';
import { UserWorkerController } from '@/modules/user-management/interface/controller/worker.controller';
import { UserWorkerRoute } from '@/modules/user-management/interface/route/worker.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { UserService } from '@/modules/user-management/domain/services/user.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeUserWorker(
  express: HttpServer,
  tokenService: TokenService,
  authUserService: AuthUserService,
  policiesService: PoliciesService,
  userService: UserService,
  isProd: boolean
): void {
  const userWorkerRepository = new MemoryUserWorkerRepository();
  const authUserRepository = new MemoryAuthUserRepository(authUserService);
  const emailValidatorService = new EmailAuthValidatorService(authUserRepository);

  const createUserWorkerUsecase = new CreateUserWorker(
    userWorkerRepository,
    emailValidatorService,
    policiesService,
    userService
  );
  const findUserWorkerUsecase = new FindUserWorker(
    userWorkerRepository,
    policiesService,
    userService
  );
  const findAllUserWorkerUsecase = new FindAllUserWorker(
    userWorkerRepository,
    policiesService,
    userService
  );
  const deleteUserWorkerUsecase = new DeleteUserWorker(
    userWorkerRepository,
    policiesService
  );
  const updateUserWorkerUsecase = new UpdateUserWorker(
    userWorkerRepository,
    policiesService,
    userService
  );

  const userWorkerController = new UserWorkerController(
    createUserWorkerUsecase,
    findUserWorkerUsecase,
    findAllUserWorkerUsecase,
    updateUserWorkerUsecase,
    deleteUserWorkerUsecase
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.WORKER,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userWorkerRoute = new UserWorkerRoute(
    userWorkerController,
    express,
    authUserMiddleware
  );
  userWorkerRoute.routes();
}
