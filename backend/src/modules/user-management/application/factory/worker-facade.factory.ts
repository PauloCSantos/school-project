import MemoryUserWorkerRepository from '../../infrastructure/repositories/memory-repository/worker.repository';
import WorkerFacade from '../facade/facade/worker.facade';
import CreateUserWorker from '../usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '../usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '../usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '../usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '../usecases/worker/updateUserWorker.usecase';

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
