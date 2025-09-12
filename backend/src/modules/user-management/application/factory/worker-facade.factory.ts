import WorkerFacade from '../facade/facade/worker.facade';
import CreateUserWorker from '../usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '../usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '../usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '../usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '../usecases/worker/updateUserWorker.usecase';
import { EmailAuthValidator } from '../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { UserServiceInterface } from '../../domain/services/user.service';
import FindUserWorkerByBaseUser from '../usecases/worker/findUserTeacherByBaseUser.usecase';
import UserWorkerGateway from '../gateway/worker.gateway';

export default class WorkerFacadeFactory {
  static create(
    repository: UserWorkerGateway,
    emailValidatorService: EmailAuthValidator,
    policiesService: PoliciesServiceInterface,
    userService: UserServiceInterface
  ): WorkerFacade {
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
    const findUserWorkerByBaseUser = new FindUserWorkerByBaseUser(
      repository,
      userService
    );
    const facade = new WorkerFacade({
      createUserWorker,
      deleteUserWorker,
      findAllUserWorker,
      findUserWorker,
      updateUserWorker,
      findUserWorkerByBaseUser,
    });

    return facade;
  }
}
