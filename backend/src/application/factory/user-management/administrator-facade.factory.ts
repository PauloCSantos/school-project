import AdministratorFacade from '@/application/facade/user-management/facade/administrator.facade';
import CreateUserAdministrator from '@/application/usecases/user-management/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/application/usecases/user-management/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/application/usecases/user-management/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/application/usecases/user-management/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/application/usecases/user-management/administrator/updateUserAdministrator.usecase';
import MemoryUserAdministratorRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-administrator.repository';

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
