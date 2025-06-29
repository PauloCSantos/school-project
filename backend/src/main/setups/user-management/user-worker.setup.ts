import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserWorker from '@/modules/user-management/application/usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/modules/user-management/application/usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/modules/user-management/application/usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/modules/user-management/application/usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/modules/user-management/application/usecases/worker/updateUserWorker.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import MemoryUserWorkerRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/worker.repository';
import { UserWorkerController } from '@/modules/user-management/interface/controller/worker.controller';
import { UserWorkerRoute } from '@/modules/user-management/interface/route/worker.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/enum';

export default function initializeUserWorker(express: HttpServer): void {
  const userWorkerRepository = new MemoryUserWorkerRepository();
  const createUserWorkerUsecase = new CreateUserWorker(userWorkerRepository);
  const findUserWorkerUsecase = new FindUserWorker(userWorkerRepository);
  const findAllUserWorkerUsecase = new FindAllUserWorker(userWorkerRepository);
  const deleteUserWorkerUsecase = new DeleteUserWorker(userWorkerRepository);
  const updateUserWorkerUsecase = new UpdateUserWorker(userWorkerRepository);
  const userWorkerController = new UserWorkerController(
    createUserWorkerUsecase,
    findUserWorkerUsecase,
    findAllUserWorkerUsecase,
    updateUserWorkerUsecase,
    deleteUserWorkerUsecase
  );
  const tokenService = tokenInstance();
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
