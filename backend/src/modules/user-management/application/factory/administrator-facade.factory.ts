import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserAdministratorRepository from '../../infrastructure/repositories/memory-repository/administrator.repository';
import AdministratorFacade from '../facade/facade/administrator.facade';
import CreateUserAdministrator from '../usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '../usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '../usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '../usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '../usecases/administrator/updateUserAdministrator.usecase';
import { EmailAuthValidatorService } from '../services/email-auth-validator.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';

export default class AdministratorFacadeFactory {
  static create(): AdministratorFacade {
    const repository = new MemoryUserAdministratorRepository();
    const authUserRepository = new MemoryAuthUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(
      authUserRepository
    );
    const policiesService = new PoliciesService();
    const createUserAdministrator = new CreateUserAdministrator(
      repository,
      emailValidatorService,
      policiesService
    );
    const deleteUserAdministrator = new DeleteUserAdministrator(
      repository,
      policiesService
    );
    const findAllUserAdministrator = new FindAllUserAdministrator(
      repository,
      policiesService
    );
    const findUserAdministrator = new FindUserAdministrator(
      repository,
      policiesService
    );
    const updateUserAdministrator = new UpdateUserAdministrator(
      repository,
      policiesService
    );
    const facade = new AdministratorFacade({
      createUserAdministrator,
      deleteUserAdministrator,
      findAllUserAdministrator,
      findUserAdministrator,
      updateUserAdministrator,
    });

    return facade;
  }
}
