import WorkerFacade from '@/application/facade/user-management/facade/worker.facade';
import CreateUserWorker from '@/application/usecases/user-management/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/application/usecases/user-management/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/application/usecases/user-management/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/application/usecases/user-management/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/application/usecases/user-management/worker/updateUserWorker.usecase';
import MemoryUserWorkerRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-worker.repository';

export default class WorkerFacadeFactory {
  static create(): WorkerFacade {
    const repository = new MemoryUserWorkerRepository();
    const createUserWorker = new CreateUserWorker(repository);
    const deleteUserWorker = new DeleteUserWorker(repository);
    const findAllUserWorker = new FindAllUserWorker(repository);
    const findUserWorker = new FindUserWorker(repository);
    const updateUserWorker = new UpdateUserWorker(repository);
    const facade = new WorkerFacade({
      createUserWorker,
      deleteUserWorker,
      findAllUserWorker,
      findUserWorker,
      updateUserWorker,
    });

    return facade;
  }
}
