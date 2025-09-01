import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserWorkerRepository from '../../infrastructure/repositories/memory-repository/worker.repository';
import WorkerFacade from '../facade/facade/worker.facade';
import CreateUserWorker from '../usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '../usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '../usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '../usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '../usecases/worker/updateUserWorker.usecase';
import { EmailAuthValidatorService } from '../services/email-auth-validator.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryUserRepository from '../../infrastructure/repositories/memory-repository/user.repository';
import { UserService } from '../../domain/services/user.service';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';

export default class WorkerFacadeFactory {
  static create(): WorkerFacade {
    const repository = new MemoryUserWorkerRepository();
    const authUserService = new AuthUserService();
    const authUserRepository = new MemoryAuthUserRepository(authUserService);
    const userRepository = new MemoryUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(authUserRepository);
    const policiesService = new PoliciesService();
    const userService = new UserService(userRepository);

    const createUserWorker = new CreateUserWorker(
      repository,
      emailValidatorService,
      policiesService,
      userService
    );
    const deleteUserWorker = new DeleteUserWorker(repository, policiesService);
    const findAllUserWorker = new FindAllUserWorker(
      repository,
      policiesService,
      userService
    );
    const findUserWorker = new FindUserWorker(repository, policiesService, userService);
    const updateUserWorker = new UpdateUserWorker(
      repository,
      policiesService,
      userService
    );
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
