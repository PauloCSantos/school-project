import AdministratorFacade from '../facade/facade/administrator.facade';
import CreateUserAdministrator from '../usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '../usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '../usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '../usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '../usecases/administrator/updateUserAdministrator.usecase';
import { EmailAuthValidator } from '../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { UserServiceInterface } from '../../domain/services/user.service';
import FindUserAdministratorByBaseUser from '../usecases/administrator/findUserAdministratorByBaseUser.usecase';
import UserAdministratorGateway from '../gateway/administrator.gateway';

export default class AdministratorFacadeFactory {
  static create(
    repository: UserAdministratorGateway,
    emailValidatorService: EmailAuthValidator,
    policiesService: PoliciesServiceInterface,
    userService: UserServiceInterface
  ): AdministratorFacade {
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
    const findUserAdministratorByBaseUser = new FindUserAdministratorByBaseUser(
      repository,
      userService
    );
    const facade = new AdministratorFacade({
      createUserAdministrator,
      deleteUserAdministrator,
      findAllUserAdministrator,
      findUserAdministrator,
      updateUserAdministrator,
      findUserAdministratorByBaseUser,
    });

    return facade;
  }
}
