import CreateUserWorker from '@/application/usecases/user-management/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/application/usecases/user-management/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/application/usecases/user-management/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/application/usecases/user-management/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/application/usecases/user-management/worker/updateUserWorker.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryUserWorkerRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-worker.repository';
import { UserWorkerController } from '@/interface/controller/user-management/user-worker.controller';
import { UserWorkerRoute } from '@/interface/route/user-management/user-worker.route';

export default function initializeUserWorker(express: ExpressHttp): void {
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
  const userWorkerRoute = new UserWorkerRoute(userWorkerController, express);
  userWorkerRoute.routes();
}
