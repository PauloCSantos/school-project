import MemoryUserAdministratorRepository from '../../infrastructure/repositories/memory-repository/administrator.repository';
import AdministratorFacade from '../facade/facade/administrator.facade';
import CreateUserAdministrator from '../usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '../usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '../usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '../usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '../usecases/administrator/updateUserAdministrator.usecase';

export default class AdministratorFacadeFactory {
  static create(): AdministratorFacade {
    const repository = new MemoryUserAdministratorRepository();
    const createUserAdministrator = new CreateUserAdministrator(repository);
    const deleteUserAdministrator = new DeleteUserAdministrator(repository);
    const findAllUserAdministrator = new FindAllUserAdministrator(repository);
    const findUserAdministrator = new FindUserAdministrator(repository);
    const updateUserAdministrator = new UpdateUserAdministrator(repository);
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
