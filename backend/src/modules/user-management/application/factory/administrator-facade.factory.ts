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
import { UserService } from '../../domain/services/user.service';
import MemoryUserRepository from '../../infrastructure/repositories/memory-repository/user.repository';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import FindUserAdministratorByBaseUser from '../usecases/administrator/findUserAdministratorByBaseUser.usecase';

export default class AdministratorFacadeFactory {
  static create(): AdministratorFacade {
    const repository = new MemoryUserAdministratorRepository();
    const authUserService = new AuthUserService();
    const authUserRepository = new MemoryAuthUserRepository(authUserService);
    const userRepository = new MemoryUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(authUserRepository);
    const policiesService = new PoliciesService();
    const userService = new UserService(userRepository);
    const createUserAdministrator = new CreateUserAdministrator(
      repository,
      emailValidatorService,
      policiesService,
      userService
    );
    const deleteUserAdministrator = new DeleteUserAdministrator(
      repository,
      policiesService
    );
    const findAllUserAdministrator = new FindAllUserAdministrator(
      repository,
      policiesService,
      userService
    );
    const findUserAdministrator = new FindUserAdministrator(
      repository,
      policiesService,
      userService
    );
    const updateUserAdministrator = new UpdateUserAdministrator(
      repository,
      policiesService,
      userService
    );
    const findUserAdministratorByBaseUser = new FindUserAdministratorByBaseUser(repository)
    const facade = new AdministratorFacade({
      createUserAdministrator,
      deleteUserAdministrator,
      findAllUserAdministrator,
      findUserAdministrator,
      updateUserAdministrator,
      findUserAdministratorByBaseUser
    });

    return facade;
  }
}
